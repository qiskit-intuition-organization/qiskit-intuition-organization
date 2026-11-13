# Security

Quantum Intuition is a free course used by real learners, and it runs learner code on our server.
This page is the schedule we keep for security checks and patching.

## Reporting a vulnerability

Please report it privately: open the repository's **Security** tab and choose **Report a vulnerability**.
Do not open a public issue. We reply within 3 days.

## What runs, and when

| When | Check | Run by |
|---|---|---|
| Every push and pull request | Secret scanning with push protection (blocks leaked keys) | GitHub |
| Every push and pull request | CodeQL code scanning | GitHub |
| Every push and pull request | `pip-audit` and `npm audit --audit-level=high` (the `audit` job in CI) | GitHub Actions |
| As soon as an advisory is published | Dependabot alert and security-fix pull request | GitHub |
| Daily, 06:00 IST | Review of the last 24 hours of commits and any new alerts; opens fix PRs, never merges | Claude routine (Opus 5.5) |
| Weekly, Monday 09:00 IST | Dependabot version updates, the scheduled CI and audit run, and a deeper audit of the code sandbox, sign-in and headers | Dependabot, GitHub Actions, Claude routine (Opus 5.5) |
| Every 90 days | Rotate `AUTH_JWT_SECRET`, the Turso database token and `FEEDBACK_PROXY_KEY`, then redeploy | Maintainer |

## How fast we patch

| Severity | Fixed and deployed within |
|---|---|
| Critical | 24 hours |
| High | 7 days |
| Moderate | the next weekly batch |
| Low | 30 days |

Every fix goes through a pull request with the full CI run. A person merges it; automated routines never merge.

The backend installs the newest allowed Python versions from `requirements.txt` on every deploy,
so a Python security fix is applied by redeploying the backend project (after CI passes).

## Rules

- Never commit secrets. Keys live only in Vercel environment variables.
- Learner code runs in a guarded worker with a minimal environment (`backend/core/sandbox_guard.py`).
- Feedback and account data are never shared outside the project.
- The feedback form's rate limit trusts the learner's address only from the web proxy, which proves itself
  with `FEEDBACK_PROXY_KEY`. Set the same random value on both Vercel projects and rotate it with the other secrets.
