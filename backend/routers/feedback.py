"""The in-course "Report feedback" form.

Anyone can send feedback, signed in or not. It is stored privately in the
database (never shown on the site), checked for size and kind, and
rate-limited per learner. The web proxy proves itself with FEEDBACK_PROXY_KEY
(set the same value on both Vercel projects); callers that skip the proxy are
limited by their real address and share one overall cap.
"""

import hmac
import os
import time
import unicodedata

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field, field_validator

from backend.auth.store import CourseFeedback, database, production
from backend.core.feedback import KINDS, MAX_LENGTH, validate
from backend.routers.auth import (
    AccountRoute,
    current_identity,
    normalize_email,
    origin_check,
    throttle,
)

PER_LEARNER = 5  # Messages per learner every 15 minutes.
DIRECT_OVERALL = 100  # Messages from callers that bypass the web proxy, every 15 minutes.
LINE_BREAKS = frozenset("\n\t")
# Bidirectional overrides can disguise text; joiners (used inside emoji) are kept.
BIDI_CONTROLS = frozenset("\u202a\u202b\u202c\u202d\u202e\u2066\u2067\u2068\u2069")
PROXY_KEY_HEADER = "x-feedback-proxy-key"

router = APIRouter(
    prefix="/feedback",
    tags=["feedback"],
    route_class=AccountRoute,
    dependencies=[Depends(origin_check)],
)


def plain_text(value: str) -> str:
    """Drop control characters (terminal escapes, NULs, bidi overrides) but keep line breaks."""
    return "".join(
        char
        for char in value
        if char in LINE_BREAKS
        or (unicodedata.category(char) != "Cc" and char not in BIDI_CONTROLS)
    ).strip()


class FeedbackRequest(BaseModel):
    kind: str
    message: str = Field(max_length=MAX_LENGTH * 2)
    email: str | None = Field(default=None, max_length=254)
    page: str = Field(default="", max_length=40)
    lesson_id: str = Field(default="", max_length=80)
    stage: str = Field(default="", max_length=40)

    @field_validator("kind")
    @classmethod
    def known_kind(cls, value):
        if value not in KINDS:
            raise ValueError("Choose what kind of feedback this is.")
        return value

    @field_validator("message")
    @classmethod
    def readable_message(cls, value):
        value = plain_text(value)
        problem = validate(value)
        if problem:
            raise ValueError(problem)
        return value

    @field_validator("email")
    @classmethod
    def reply_address(cls, value):
        value = (value or "").strip()
        return normalize_email(value) if value else None

    @field_validator("page", "lesson_id", "stage")
    @classmethod
    def short_label(cls, value):
        return plain_text(value)


def from_proxy(request: Request) -> bool:
    """True when the course's own web proxy sent this request (it holds the shared key)."""
    key = os.getenv("FEEDBACK_PROXY_KEY", "").strip()
    sent = request.headers.get(PROXY_KEY_HEADER, "")
    return bool(key) and hmac.compare_digest(sent.encode(), key.encode())


def platform_address(request: Request) -> str:
    # On Vercel the platform writes x-forwarded-for itself, so callers cannot fake it.
    forwarded = request.headers.get("x-forwarded-for", "").split(",")[0].strip()[:64]
    return forwarded or (request.client.host if request.client else "unknown")


def learner_key(request: Request) -> tuple[str, bool]:
    """The address to rate-limit on, and whether it came through our proxy.

    Only the proxy may name the learner's address (X-Learner-IP). Without the
    shared key the header is ignored, except in local development and tests.
    """
    named = request.headers.get("x-learner-ip", "").strip()[:64]
    if from_proxy(request):
        return named or platform_address(request), True
    if named and not production() and not os.getenv("FEEDBACK_PROXY_KEY", "").strip():
        return named, False
    return platform_address(request), False


def signed_in_user_id(request: Request) -> str | None:
    try:
        user, _ = current_identity(request)
    except HTTPException:
        return None  # A guest or an expired session: feedback is still welcome.
    return user.id


@router.post("", status_code=201)
def send_feedback(req: FeedbackRequest, request: Request):
    key, proxied = learner_key(request)
    if not proxied:
        # Direct callers share one cap, checked first so they cannot add throttle rows
        # once it is spent. Learners coming through the course are never counted here.
        throttle("feedback-direct", "everyone", maximum=DIRECT_OVERALL)
    throttle("feedback", key, maximum=PER_LEARNER)
    with database() as conn:
        conn.add(
            CourseFeedback(
                created_at=int(time.time()),
                kind=req.kind,
                message=req.message,
                email=req.email,
                page=req.page,
                lesson_id=req.lesson_id,
                stage=req.stage,
                user_id=signed_in_user_id(request),
            )
        )
    return {"ok": True}
