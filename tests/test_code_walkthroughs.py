"""Every walkthrough must explain every line of its lesson's worked example, in order, briefly."""
import io
import math
import tokenize

import pytest

from frontend.code_walkthroughs import WALKTHROUGHS
from frontend.learning_content import LESSONS

LESSON_IDS = {lesson["id"] for lesson in LESSONS}
WITH_WALKTHROUGH = [lesson for lesson in LESSONS if lesson.get("walkthrough")]
MAX_WORDS = 16  # the one-line "does" must stay one line


def _code_lines(text: str) -> list[str]:
    """Non-blank lines with # comments removed (tokenize, so a # inside a string stays)."""
    lines = text.splitlines()
    for token in tokenize.generate_tokens(io.StringIO(text + "\n").readline):
        if token.type == tokenize.COMMENT:
            row, col = token.start
            lines[row - 1] = lines[row - 1][:col]
    return [line.rstrip() for line in lines if line.strip()]


def test_walkthroughs_belong_to_real_lessons():
    assert set(WALKTHROUGHS) <= LESSON_IDS


@pytest.mark.parametrize("lesson", WITH_WALKTHROUGH, ids=lambda lesson: lesson["id"])
def test_walkthrough_covers_every_line_in_order(lesson):
    covered = [line for step in lesson["walkthrough"] for line in _code_lines(step["code"])]
    assert covered == _code_lines(lesson["qiskit"]["code"])


@pytest.mark.parametrize("lesson", WITH_WALKTHROUGH, ids=lambda lesson: lesson["id"])
def test_every_step_is_short_and_well_formed(lesson):
    for step in lesson["walkthrough"]:
        words = len(step["does"].split())
        assert 0 < words <= MAX_WORDS, f"keep it to one short line: {step['does']!r}"
        assert "—" not in step["does"] + step["more"], "no em dashes in lesson text"
        sketch = step["sketch"]
        if sketch is None:
            continue
        assert sketch["kind"] in {"arrow", "odds"} and sketch["label"]
        if sketch["kind"] == "arrow":
            assert math.isclose(math.dist(sketch["xyz"], (0, 0, 0)), 1, abs_tol=1e-6)
        else:
            assert math.isclose(sum(sketch["odds"].values()), 1, abs_tol=1e-6)
