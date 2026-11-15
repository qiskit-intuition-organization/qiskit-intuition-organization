import asyncio
import threading
import time

import httpx

from backend.main import app
from backend.routers import execute as execute_router


def _slow(code, *a, **k):
    time.sleep(0.6)
    return {"success": True, "stdout": "", "stderr": "", "figures": []}


async def _max_loop_stall(monkeypatch):
    monkeypatch.setattr(execute_router, "execute_notebook_code", _slow)
    transport = httpx.ASGITransport(app=app)
    stall = 0.0

    async def ticker():
        nonlocal stall
        last = time.perf_counter()
        while True:
            await asyncio.sleep(0.01)
            now = time.perf_counter()
            stall = max(stall, now - last)
            last = now

    async with httpx.AsyncClient(transport=transport, base_url="http://t") as c:
        tick = asyncio.create_task(ticker())
        await asyncio.sleep(0.05)
        await c.post("/execute", json={"code": "x = 1"})
        await asyncio.sleep(0.05)  # let the ticker record any stall
        tick.cancel()
    return stall


def test_execute_does_not_block_the_event_loop(monkeypatch):
    assert asyncio.run(_max_loop_stall(monkeypatch)) < 0.3


def test_execute_rejects_oversized_code():
    transport = httpx.ASGITransport(app=app)

    async def go():
        async with httpx.AsyncClient(transport=transport, base_url="http://t") as c:
            return await c.post("/execute", json={"code": "#" * 200_000})

    assert asyncio.run(go()).status_code == 422


def test_execute_sheds_load_when_busy(monkeypatch):
    gate = threading.Event()

    def blocked(code, *a, **k):
        gate.wait(5)
        return {"success": True, "stdout": "", "stderr": "", "figures": []}

    monkeypatch.setattr(execute_router, "execute_notebook_code", blocked)

    async def go():
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://t") as c:
            jobs = [asyncio.create_task(c.post("/execute", json={"code": "x=1"}))
                    for _ in range(execute_router.MAX_CONCURRENT_RUNS)]
            await asyncio.sleep(0.2)
            extra = await c.post("/execute", json={"code": "x=1"})
            gate.set()
            await asyncio.gather(*jobs)
            return extra.status_code

    assert asyncio.run(go()) == 429


def test_execute_errors_do_not_leak_details(monkeypatch):
    def boom(*a, **k):
        raise RuntimeError("secret-internal-detail")

    monkeypatch.setattr(execute_router, "execute_notebook_code", boom)

    async def go():
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://t") as c:
            return await c.post("/execute", json={"code": "x=1"})

    r = asyncio.run(go())
    assert r.status_code == 500
    assert "secret-internal-detail" not in r.text
