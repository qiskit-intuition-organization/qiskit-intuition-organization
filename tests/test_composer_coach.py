"""The circuit coach parses the learner's gate sequence safely and quickly."""

import time

from fastapi.testclient import TestClient

from agents.composer_agent import _parse_sequence
from backend.main import app
from backend.routers.agents import MAX_CIRCUIT_DESC


def test_sequence_splits_on_arrows_commas_and_semicolons():
    assert _parse_sequence("H → CNOT -> X, Z;  S ") == ["H", "CNOT", "X", "Z", "S"]
    assert _parse_sequence("") == []


def test_long_runs_of_spaces_parse_in_linear_time():
    started = time.perf_counter()
    _parse_sequence("H" + " " * 50_000 + "x")
    assert time.perf_counter() - started < 0.5


def test_the_coach_refuses_an_oversized_circuit_description():
    client = TestClient(app)
    body = {"latest_gate": "H", "qubit": 0, "full_circuit_desc": "H " * MAX_CIRCUIT_DESC}

    assert client.post("/agent/coach", json=body).status_code == 422
