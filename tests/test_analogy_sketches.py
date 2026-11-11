"""Every analogy sketch the content points to must exist, with the size the page reserves for it."""
from pathlib import Path

import pytest
from PIL import Image

from frontend.learning_content import LESSONS

PUBLIC = Path(__file__).resolve().parents[1] / "web" / "public"
WITH_SKETCH = [lesson for lesson in LESSONS if lesson.get("analogy", {}).get("sketch")]


@pytest.mark.parametrize("lesson", WITH_SKETCH, ids=lambda lesson: lesson["id"])
def test_sketch_file_matches_its_entry(lesson):
    sketch = lesson["analogy"]["sketch"]
    path = PUBLIC / sketch["src"].lstrip("/")
    assert path.exists(), f"missing {path}"
    with Image.open(path) as img:
        assert img.size == (sketch["width"], sketch["height"])
    assert sketch["alt"].strip() and "—" not in sketch["alt"]


def test_every_lesson_has_a_sketch():
    assert len(WITH_SKETCH) == len(LESSONS)
