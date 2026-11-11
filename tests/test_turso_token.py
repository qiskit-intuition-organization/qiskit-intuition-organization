"""The backend finds the Turso token under either name Vercel may give it."""
from backend.auth.store import turso_token

INTEGRATION_NAME = "TURSO_DATABASE_TURSO_AUTH_TOKEN"


def test_reads_the_documented_name(monkeypatch):
    monkeypatch.setenv("TURSO_AUTH_TOKEN", "documented")
    monkeypatch.setenv(INTEGRATION_NAME, "integration")
    assert turso_token() == "documented"


def test_falls_back_to_the_vercel_integration_name(monkeypatch):
    monkeypatch.delenv("TURSO_AUTH_TOKEN", raising=False)
    monkeypatch.setenv(INTEGRATION_NAME, " integration ")
    assert turso_token() == "integration"


def test_empty_when_neither_is_set(monkeypatch):
    monkeypatch.delenv("TURSO_AUTH_TOKEN", raising=False)
    monkeypatch.delenv(INTEGRATION_NAME, raising=False)
    assert turso_token() == ""
