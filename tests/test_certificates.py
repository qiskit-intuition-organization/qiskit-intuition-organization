"""Server-checked course completion and publicly verifiable certificates."""

import re

from fastapi.testclient import TestClient
import pytest
from sqlalchemy import select

from backend.auth.store import ExercisePass, engine_for, database
from backend.core.course_content import course_content
from backend.main import app
from backend.routers import course as course_router

ID_FORMAT = re.compile(r"^QE-QI-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$")
REQUIRED = [
    lesson["id"]
    for lesson in course_content()["lessons"]
    if lesson.get("code_task", {}).get("solution")
]


@pytest.fixture(params=["sqlite", "sqlite+libsql"])
def make_client(tmp_path, monkeypatch, request):
    monkeypatch.setenv(
        "AUTH_DATABASE_URL", f"{request.param}:///{tmp_path}/certificates.sqlite3"
    )
    monkeypatch.setenv(
        "AUTH_JWT_SECRET", "certificate-test-only-key-at-least-32-characters"
    )
    monkeypatch.setenv("AUTH_FRONTEND_URL", "http://localhost:3000")
    for key in ["VERCEL", "APP_ENV", "TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"]:
        monkeypatch.delenv(key, raising=False)
    # Grading is tested elsewhere; here "right" passes and anything else fails.
    monkeypatch.setattr(
        course_router,
        "check_code_task",
        lambda code, task: {"passed": code == "right", "message": "", "stdout": ""},
    )
    browsers = []

    def make(email=None):
        browser = TestClient(app, headers={"Origin": "http://localhost:3000"})
        browsers.append(browser)
        if email:
            response = browser.post(
                "/auth/signup",
                json={
                    "email": email,
                    "display_name": "Learner",
                    "password": "long certificate test passphrase",
                },
            )
            assert response.status_code == 201, response.text
        return browser

    yield make
    for browser in browsers:
        browser.close()
    engine_for.cache_clear()


def solve(browser, lesson_id, code="right"):
    response = browser.post(
        "/course/exercise", json={"lesson_id": lesson_id, "code": code}
    )
    assert response.status_code == 200, response.text
    return response.json()


def solve_all(browser, lessons=REQUIRED):
    for lesson_id in lessons:
        assert solve(browser, lesson_id)["passed"]


def recorded_passes():
    with database() as conn:
        return [(row.user_id, row.lesson_id) for row in conn.scalars(select(ExercisePass))]


def issue(browser, name="Ada Lovelace"):
    return browser.post("/certificate", json={"name": name})


def test_every_lesson_has_a_checkable_exercise():
    assert len(REQUIRED) == len(course_content()["lessons"])


def test_pass_recorded_only_for_signed_in_learner_when_checker_passes(make_client):
    learner = make_client("ada@example.com")
    user_id = learner.get("/auth/me").json()["user"]["id"]
    assert solve(learner, REQUIRED[0], "wrong") == {
        "passed": False, "message": "", "stdout": "", "recorded": False
    }
    assert recorded_passes() == []
    result = solve(learner, REQUIRED[0])
    assert result["passed"] and result["recorded"]
    solve(learner, REQUIRED[0])
    assert recorded_passes() == [(user_id, REQUIRED[0])]


def test_real_checker_records_reference_solution(make_client, monkeypatch):
    from backend.core.exercise_checker import check_code_task

    monkeypatch.setattr(course_router, "check_code_task", check_code_task)
    learner = make_client("ada@example.com")
    lesson = course_content()["lessons"][0]
    assert not solve(learner, lesson["id"], lesson["code_task"]["starter"])["recorded"]
    assert solve(learner, lesson["id"], lesson["code_task"]["solution"])["recorded"]
    assert learner.get("/certificate/status").json()["passed"] == [lesson["id"]]


def test_first_pass_time_is_kept(make_client):
    learner = make_client("ada@example.com")
    solve(learner, REQUIRED[0])
    with database() as conn:
        first = conn.scalar(select(ExercisePass)).passed_at
        conn.execute(ExercisePass.__table__.update().values(passed_at=first - 100))
    solve(learner, REQUIRED[0])
    with database() as conn:
        assert conn.scalar(select(ExercisePass)).passed_at == first - 100


def test_guest_pass_records_nothing(make_client):
    make_client("ada@example.com")
    guest = make_client()
    result = solve(guest, REQUIRED[0])
    assert result["passed"] and not result["recorded"]
    assert recorded_passes() == []


def test_expired_session_counts_as_guest(make_client):
    guest = make_client()
    guest.cookies.set("qi_session", "not-a-valid-token")
    result = solve(guest, REQUIRED[0])
    assert result["passed"] and not result["recorded"]


def test_notebook_progress_does_not_count(make_client):
    learner = make_client("ada@example.com")
    owner = learner.get("/auth/me").json()["user"]["id"]
    saved = learner.post(
        "/auth/notebook",
        json={
            "owner_id": owner,
            "revision": 0,
            "notebook": {"completed_lessons": REQUIRED, "tasks_passed": REQUIRED},
        },
    )
    assert saved.status_code == 200, saved.text
    assert learner.get("/certificate/status").json()["passed"] == []
    assert issue(learner).status_code == 409


def test_status_lists_passed_and_missing_lessons(make_client):
    learner = make_client("ada@example.com")
    solve_all(learner, [REQUIRED[2], REQUIRED[0]])
    response = learner.get("/certificate/status")
    assert response.status_code == 200
    assert response.headers["cache-control"] == "private, no-store"
    status = response.json()
    assert status["passed"] == [REQUIRED[0], REQUIRED[2]]
    assert status["missing"] == [
        lesson for lesson in REQUIRED if lesson not in status["passed"]
    ]
    assert status["total"] == len(REQUIRED)
    assert status["complete"] is False
    assert status["certificate"] is None


def test_status_and_issue_require_sign_in(make_client):
    guest = make_client()
    assert guest.get("/certificate/status").status_code == 401
    assert issue(guest).status_code == 401


def test_issue_refused_until_every_exercise_passed(make_client):
    learner = make_client("ada@example.com")
    solve_all(learner, REQUIRED[:-1])
    response = issue(learner)
    assert response.status_code == 409
    assert response.json()["missing"] == [REQUIRED[-1]]
    titles = {lesson["id"]: lesson["title"] for lesson in course_content()["lessons"]}
    assert titles[REQUIRED[-1]] in response.json()["detail"]


def test_issue_after_completing_every_exercise(make_client):
    learner = make_client("ada@example.com")
    solve_all(learner)
    assert learner.get("/certificate/status").json()["complete"] is True
    response = issue(learner, "  Ada   Lovelace ")
    assert response.status_code == 201, response.text
    certificate = response.json()["certificate"]
    assert ID_FORMAT.match(certificate["id"])
    assert certificate["name"] == "Ada Lovelace"
    assert certificate["course"] == course_content()["brand"]["name"]
    assert isinstance(certificate["issued_at"], int)
    assert learner.get("/certificate/status").json()["certificate"] == certificate


def test_issuing_again_returns_the_same_certificate(make_client):
    learner = make_client("ada@example.com")
    solve_all(learner)
    first = issue(learner).json()["certificate"]
    again = issue(learner, "Someone Else")
    assert again.status_code == 200
    assert again.json()["certificate"] == first


@pytest.mark.parametrize(
    "name",
    [
        "A",
        "  B  ",
        "x" * 81,
        "<script>alert(1)</script>",
        "Ada <b>Lovelace</b>",
        "Ada 🚀 Lovelace",
        "Ada\nLovelace",
        "Ada Lovelace 3",
        "...",
        "",
        "\u0301Ada Lovelace",
        "Ada - \u0301Lovelace",
        "Ax\u0301\u0301\u0301\u0301da Lovelace",
    ],
)
def test_invalid_names_are_rejected(make_client, name):
    learner = make_client("ada@example.com")
    solve_all(learner)
    response = issue(learner, name)
    assert response.status_code == 422
    assert isinstance(response.json()["detail"], str)
    assert "<script>" not in response.text
    assert learner.get("/certificate/status").json()["certificate"] is None


@pytest.mark.parametrize(
    "name",
    [
        "José Ñúñez",
        "Zoë O'Brien-Smith",
        "Dr. Jean-Luc Picard",
        "Ångström",
        "Łukasz",
        # Combining marks with no precomposed form must still be accepted.
        "ध्रुव सचदेवा",
        "Adébáyọ̀",
    ],
)
def test_accented_names_are_accepted(make_client, name):
    learner = make_client("ada@example.com")
    solve_all(learner)
    response = issue(learner, name)
    assert response.status_code == 201, response.text
    assert response.json()["certificate"]["name"] == name


def test_verify_shows_only_public_fields(make_client):
    learner = make_client("ada@example.com")
    solve_all(learner)
    certificate = issue(learner).json()["certificate"]
    stranger = make_client()
    response = stranger.get(f"/certificate/verify/{certificate['id']}")
    assert response.status_code == 200
    assert response.json() == {"valid": True, **certificate}
    lowercase = stranger.get(f"/certificate/verify/{certificate['id'].lower()}")
    assert lowercase.json() == response.json()
    assert "ada@example.com" not in response.text
    user_id = learner.get("/auth/me").json()["user"]["id"]
    assert user_id not in response.text


@pytest.mark.parametrize(
    "certificate_id", ["QE-QI-2345-6789", "QE-QI-0000-OOOO", "not-an-id", "x" * 200]
)
def test_verify_unknown_or_malformed_id(make_client, certificate_id):
    response = make_client().get(f"/certificate/verify/{certificate_id}")
    assert response.status_code == 404
    assert response.json() == {"valid": False, "detail": "No certificate has this ID."}


def test_learners_cannot_see_or_issue_each_others_certificates(make_client):
    ada = make_client("ada@example.com")
    grace = make_client("grace@example.com")
    solve_all(ada)
    ada_certificate = issue(ada).json()["certificate"]
    status = grace.get("/certificate/status").json()
    assert status["certificate"] is None and status["passed"] == []
    assert issue(grace, "Grace Hopper").status_code == 409
    solve_all(grace)
    grace_certificate = issue(grace, "Grace Hopper").json()["certificate"]
    assert grace_certificate["id"] != ada_certificate["id"]
    assert grace_certificate["name"] == "Grace Hopper"
    assert ada.get("/certificate/status").json()["certificate"] == ada_certificate


def test_issue_requires_application_origin(make_client):
    learner = make_client("ada@example.com")
    solve_all(learner)
    response = learner.post(
        "/certificate", json={"name": "Ada"}, headers={"Origin": "https://evil.example"}
    )
    assert response.status_code == 403


def test_certificate_ids_are_random_and_well_formed():
    from backend.routers.certificate import ALPHABET, new_certificate_id

    assert not set("01ILO") & set(ALPHABET)
    ids = {new_certificate_id() for _ in range(500)}
    assert len(ids) == 500
    assert all(ID_FORMAT.match(value) for value in ids)
