import base64
import threading

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ..core.notebook_engine import execute_notebook_code

router = APIRouter()

# /execute is anonymous, so bound what one caller can cost: code size, and how many
# sandbox processes run at once (extra requests are turned away instead of queued).
MAX_CODE_CHARS = 100_000
MAX_CONCURRENT_RUNS = 2
_slots = threading.BoundedSemaphore(MAX_CONCURRENT_RUNS)


class ExecuteRequest(BaseModel):
    code: str = Field(max_length=MAX_CODE_CHARS)


# A plain ``def`` route runs in FastAPI's thread pool, so the blocking sandbox
# subprocess no longer freezes the event loop for every other request.
@router.post("/execute")
def execute(req: ExecuteRequest):
    if not _slots.acquire(blocking=False):
        raise HTTPException(status_code=429, detail="The code runner is busy. Try again in a moment.")
    try:
        result = execute_notebook_code(req.code)
        figures_b64 = [base64.b64encode(png).decode("ascii") for png in result.get("figures", [])]
        return {
            "success": result.get("success", False),
            "stdout": result.get("stdout", ""),
            "stderr": result.get("stderr", ""),
            "error": result.get("error", None),
            "figures": figures_b64,
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Code execution failed.") from None
    finally:
        _slots.release()
