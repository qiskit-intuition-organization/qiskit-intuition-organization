"""In-course feedback: anyone can send it, it is stored privately, and it is rate-limited."""

from fastapi.testclient import TestClient
import pytest
from sqlalchemy import select

from backend.auth.store import CourseFeedback, database, engine_for
from backend.main import app
from backend.routers import feedback as feedback_router

ORIGIN = "http://localhost:3000"
GOOD = {
    "kind": "Confusing explanation",
    "message": "The phase step lost me after the second H gate.",
    "page": "course",
    "lesson_id": "phase",
    "stage": "Formalize",
}


@pytest.fixture(params=["sqlite", "sqlite+libsql"])
def make_client(tmp_path, monkeypatch, request):
    monkeypatch.setenv("AUTH_DATABASE_URL", f"{request.param}:///{tmp_path}/feedback.sqlite3")
    monkeypatch.setenv("AUTH_JWT_SECRET", "feedback-test-only-key-at-least-32-characters")
    monkeypatch.setenv("AUTH_FRONTEND_URL", ORIGIN)
    for key in ["VERCEL", "APP_ENV", "TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"]:
        monkeypatch.delenv(key, raising=False)
    browsers = []

    def make(email=None, origin=ORIGIN):
        browser = TestClient(app, headers={"Origin": origin})
        browsers.append(browser)
        if email:
            response = browser.post(
                "/auth/signup",
                json={"email": email, "display_name": "Learner", "password": "long feedback test passphrase"},
            )
            assert response.status_code == 201, response.text
        return browser

    yield make
    for browser in browsers:
        browser.close()
    engine_for.cache_clear()


def stored():
    with database() as conn:
        return list(conn.scalars(select(CourseFeedback).order_by(CourseFeedback.id)))


def test_a_guest_can_send_feedback_and_it_is_stored_with_where_it_came_from(make_client):
    response = make_client().post("/feedback", json=GOOD)

    assert response.status_code == 201, response.text
    assert response.json() == {"ok": True}
    [row] = stored()
    assert row.message == GOOD["message"]
    assert (row.kind, row.page, row.lesson_id, row.stage) == ("Confusing explanation", "course", "phase", "Formalize")
    assert row.user_id is None and row.email is None
    assert row.created_at > 0


def test_signed_in_feedback_is_linked_to_the_account(make_client):
    browser = make_client(email="learner@example.com")

    assert browser.post("/feedback", json=GOOD).status_code == 201
    assert stored()[0].user_id is not None


def test_an_optional_reply_email_is_kept_and_checked(make_client):
    browser = make_client()

    assert browser.post("/feedback", json={**GOOD, "email": "Reply@Example.com "}).status_code == 201
    assert stored()[0].email == "reply@example.com"
    assert browser.post("/feedback", json={**GOOD, "email": "not-an-email"}).status_code == 422


@pytest.mark.parametrize(
    "change",
    [
        {"message": "   short  "},
        {"message": "x" * 4001},
        {"kind": "Spam"},
        {"lesson_id": "x" * 81},
    ],
)
def test_invalid_feedback_is_refused_with_a_plain_reason(make_client, change):
    response = make_client().post("/feedback", json={**GOOD, **change})

    assert response.status_code == 422
    assert isinstance(response.json()["detail"], str)
    assert stored() == []


def test_control_characters_are_removed_but_line_breaks_kept(make_client):
    message = "Line one\x00\x1b[31m\nLine two is long enough"

    assert make_client().post("/feedback", json={**GOOD, "message": message}).status_code == 201
    assert stored()[0].message == "Line one[31m\nLine two is long enough"


def test_feedback_from_another_site_is_refused(make_client):
    response = make_client(origin="https://attacker.example").post("/feedback", json=GOOD)

    assert response.status_code == 403
    assert stored() == []


def test_one_learner_cannot_flood_the_inbox(make_client):
    browser = make_client()
    flood = {"X-Learner-IP": "203.0.113.7"}

    codes = [browser.post("/feedback", json=GOOD, headers=flood).status_code for _ in range(feedback_router.PER_LEARNER + 1)]
    other = browser.post("/feedback", json=GOOD, headers={"X-Learner-IP": "198.51.100.2"})

    assert codes[:-1] == [201] * feedback_router.PER_LEARNER
    assert codes[-1] == 429
    assert other.status_code == 201
    assert len(stored()) == feedback_router.PER_LEARNER + 1


PROXY_KEY = "proxy-test-key-0123456789abcdef"


def test_without_the_proxy_key_a_faked_learner_address_is_ignored(make_client, monkeypatch):
    monkeypatch.setenv("FEEDBACK_PROXY_KEY", PROXY_KEY)
    browser = make_client()

    codes = [
        browser.post("/feedback", json=GOOD, headers={"X-Learner-IP": f"10.0.0.{i}"}).status_code
        for i in range(feedback_router.PER_LEARNER + 1)
    ]

    assert codes[-1] == 429  # Rotating the header does not reset the limit.


def test_the_proxy_key_lets_each_learner_have_their_own_limit(make_client, monkeypatch):
    monkeypatch.setenv("FEEDBACK_PROXY_KEY", PROXY_KEY)
    browser = make_client()

    def proxied(ip):
        return {"X-Learner-IP": ip, "X-Feedback-Proxy-Key": PROXY_KEY}

    for _ in range(feedback_router.PER_LEARNER):
        assert browser.post("/feedback", json=GOOD, headers=proxied("203.0.113.7")).status_code == 201
    assert browser.post("/feedback", json=GOOD, headers=proxied("203.0.113.7")).status_code == 429
    assert browser.post("/feedback", json=GOOD, headers=proxied("198.51.100.2")).status_code == 201


def test_direct_callers_cannot_use_up_the_limit_for_real_learners(make_client, monkeypatch):
    monkeypatch.setenv("FEEDBACK_PROXY_KEY", PROXY_KEY)
    monkeypatch.setattr(feedback_router, "DIRECT_OVERALL", 2)
    browser = make_client()

    direct = [
        browser.post("/feedback", json=GOOD, headers={"X-Forwarded-For": f"192.0.2.{i}"}).status_code
        for i in range(3)
    ]
    proxied = browser.post(
        "/feedback", json=GOOD, headers={"X-Learner-IP": "203.0.113.9", "X-Feedback-Proxy-Key": PROXY_KEY}
    )

    assert direct == [201, 201, 429]
    assert proxied.status_code == 201


def test_emoji_joiners_survive_and_errors_read_plainly(make_client):
    family = "Loved this lesson 👩‍👩‍👧 thank you"
    browser = make_client()

    assert browser.post("/feedback", json={**GOOD, "message": family}).status_code == 201
    assert stored()[0].message == family
    detail = browser.post("/feedback", json={**GOOD, "email": "not-an-email"}).json()["detail"]
    assert not detail.startswith("Value error")
