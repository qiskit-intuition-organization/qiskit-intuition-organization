"""Certificates of completion, earned by passing every server-checked exercise.

Only passes checked by ``POST /course/exercise`` count. The browser notebook's
progress is client-controlled and is deliberately ignored here.
"""

import logging
import re
import secrets
import time
import unicodedata

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.exc import SQLAlchemyError

from backend.auth.store import (
    AuthConfigurationError,
    Certificate,
    ExercisePass,
    database,
)
from backend.core.course_content import course_content
from backend.routers.auth import AccountRoute, current_identity, origin_check

# No 0/O, 1/I/L: IDs are read off paper and typed back in.
ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"
ID_PREFIX = "QE-QI-"
ID_PATTERN = re.compile(rf"^{ID_PREFIX}[{ALPHABET}]{{4}}-[{ALPHABET}]{{4}}$")
ID_ATTEMPTS = 5
NAME_PUNCTUATION = frozenset(" '’-.")
MAX_MARKS = 3  # Combining marks on one letter: enough for real names, not for "Zalgo" text.
NAME_RULES = (
    "Enter the name to print using 2 to 80 letters, spaces, apostrophes, "
    "hyphens or dots."
)
NOT_FOUND = {"valid": False, "detail": "No certificate has this ID."}
PRIVATE = "private, no-store"

router = APIRouter(
    prefix="/certificate",
    tags=["certificate"],
    route_class=AccountRoute,
    dependencies=[Depends(origin_check)],
)


class IssueRequest(BaseModel):
    name: str = Field(max_length=200)


def new_certificate_id() -> str:
    def block():
        return "".join(secrets.choice(ALPHABET) for _ in range(4))

    return f"{ID_PREFIX}{block()}-{block()}"


def allowed_characters(name: str) -> bool:
    """Letters and name punctuation. A combining mark (an accent with no
    precomposed form, a Devanagari vowel sign) must follow a letter, and at
    most MAX_MARKS stack on one letter."""
    marks = MAX_MARKS + 1  # No letter yet, so no mark may come first.
    for char in name:
        if unicodedata.category(char).startswith("M"):
            marks += 1
            if marks > MAX_MARKS:
                return False
        elif char.isalpha():
            marks = 0
        elif char in NAME_PUNCTUATION:
            marks = MAX_MARKS + 1
        else:
            return False
    return True


def printed_name(value: str) -> str:
    name = unicodedata.normalize("NFC", value).strip()
    if not allowed_characters(name):
        raise HTTPException(422, NAME_RULES)
    name = re.sub(" +", " ", name)
    if not 2 <= len(name) <= 80 or sum(char.isalpha() for char in name) < 2:
        raise HTTPException(422, NAME_RULES)
    return name


def required_lessons() -> list[dict]:
    """Lessons whose exercise the server can check, in course order."""
    return [
        lesson
        for lesson in course_content()["lessons"]
        if lesson.get("code_task", {}).get("solution")
    ]


def public_certificate(certificate: Certificate) -> dict:
    return {
        "id": certificate.id,
        "name": certificate.name,
        "course": certificate.course,
        "issued_at": certificate.issued_at,
    }


def owned_certificate(conn, user_id: str) -> Certificate | None:
    return conn.scalar(select(Certificate).where(Certificate.user_id == user_id))


def progress(conn, user_id: str) -> dict:
    lessons = required_lessons()
    done = set(
        conn.scalars(
            select(ExercisePass.lesson_id).where(ExercisePass.user_id == user_id)
        )
    )
    return {
        "passed": [lesson["id"] for lesson in lessons if lesson["id"] in done],
        "missing": [lesson for lesson in lessons if lesson["id"] not in done],
        "total": len(lessons),
    }


def record_pass(request: Request, lesson_id: str) -> bool:
    """Store a signed-in learner's first pass; guests are never recorded."""
    try:
        user, _ = current_identity(request)
        with database() as conn:
            conn.execute(
                insert(ExercisePass)
                .values(user_id=user.id, lesson_id=lesson_id, passed_at=int(time.time()))
                .on_conflict_do_nothing(
                    index_elements=[ExercisePass.user_id, ExercisePass.lesson_id]
                )
            )
    except HTTPException:
        return False  # A guest or an expired session.
    except (AuthConfigurationError, SQLAlchemyError, RuntimeError, ValueError) as error:
        # Never log connection details; the learner still sees their result.
        logging.getLogger(__name__).error(
            "Could not record an exercise pass (%s)", type(error).__name__
        )
        return False
    return True


@router.get("/status")
def status(response: Response, identity=Depends(current_identity)):
    user, _ = identity
    response.headers["Cache-Control"] = PRIVATE
    with database() as conn:
        state = progress(conn, user.id)
        certificate = owned_certificate(conn, user.id)
    return {
        **state,
        "missing": [lesson["id"] for lesson in state["missing"]],
        "complete": not state["missing"],
        "certificate": public_certificate(certificate) if certificate else None,
    }


@router.post("", status_code=201)
def issue(req: IssueRequest, response: Response, identity=Depends(current_identity)):
    user, _ = identity
    response.headers["Cache-Control"] = PRIVATE
    with database() as conn:
        existing = owned_certificate(conn, user.id)
        if existing:
            # One certificate per learner: the printed name and ID never change.
            response.status_code = 200
            return {"certificate": public_certificate(existing)}
        name = printed_name(req.name)
        missing = progress(conn, user.id)["missing"]
        if missing:
            titles = ", ".join(lesson["title"] for lesson in missing)
            return JSONResponse(
                {
                    "detail": f"Pass the coding exercise in every lesson first. Still to pass: {titles}.",
                    "missing": [lesson["id"] for lesson in missing],
                },
                status_code=409,
                headers={"Cache-Control": PRIVATE},
            )
        course = course_content()["brand"]["name"]
        for _ in range(ID_ATTEMPTS):
            conn.execute(
                insert(Certificate)
                .values(
                    id=new_certificate_id(),
                    user_id=user.id,
                    name=name,
                    course=course,
                    issued_at=int(time.time()),
                )
                .on_conflict_do_nothing()
            )
            certificate = owned_certificate(conn, user.id)
            if certificate:
                return {"certificate": public_certificate(certificate)}
    raise HTTPException(503, "The certificate could not be issued. Please try again.")


@router.get("/verify/{certificate_id}")
def verify(certificate_id: str):
    # The ID's 31^8 combinations make guessing impractical; only public fields leave.
    normalized = certificate_id.strip().upper()
    if not ID_PATTERN.match(normalized):
        return JSONResponse(NOT_FOUND, status_code=404)
    with database() as conn:
        certificate = conn.get(Certificate, normalized)
    if certificate is None:
        return JSONResponse(NOT_FOUND, status_code=404)
    return {"valid": True, **public_certificate(certificate)}
