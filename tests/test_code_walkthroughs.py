"""Every walkthrough must explain every line of its lesson's worked example, in order."""
import pytest

from frontend.code_walkthroughs import WALKTHROUGHS
from frontend.learning_content import LESSONS

LESSON_IDS = {lesson["id"] for lesson in LESSONS}
WITH_WALKTHROUGH = [lesson for lesson in LESSONS if lesson.get("walkthrough")]


def _code_lines(text: str) -> list[str]:
    return [line for line in text.splitlines() if line.strip()]


def test_walkthroughs_belong_to_real_lessons():
    assert set(WALKTHROUGHS) <= LESSON_IDS


@pytest.mark.parametrize("lesson", WITH_WALKTHROUGH, ids=lambda lesson: lesson["id"])
def test_walkthrough_covers_every_line_in_order(lesson):
    steps = lesson["walkthrough"]
    covered = [line for step in steps for line in _code_lines(step["code"])]
    assert covered == _code_lines(lesson["qiskit"]["code"])


@pytest.mark.parametrize("lesson", WITH_WALKTHROUGH, ids=lambda lesson: lesson["id"])
def test_every_step_says_what_it_does(lesson):
    for step in lesson["walkthrough"]:
        assert _code_lines(step["code"]), "a step needs at least one line of code"
        assert step["does"].strip(), f"missing explanation for {step['code']!r}"
        assert "—" not in step["does"] + step["picture"], "no em dashes in lesson text"
