# Race — Playwright CI/CD Pipeline Guide

This guide documents the GitHub Actions CI/CD pipeline for running the **Race Ridesharing** Playwright automation suite against the deployed production application (`https://race-cyan.vercel.app/`).

---

## 1. Architecture Overview

- **Workflow File:** `.github/workflows/playwright.yml`
- **Test Suite Root:** `playwright-test/`
- **Target Production URL:** `https://race-cyan.vercel.app/` (configurable via `BASE_URL`)
- **Browser Matrix:** Chromium (`Desktop Chrome`)
- **Execution Strategy:**
  - **3 Parallel Shards** (`--shard=1/3`, `--shard=2/3`, `--shard=3/3`) running on 3 independent `ubuntu-latest` GitHub Actions runners (`fail-fast: false`).
  - **2 Parallel Workers** per shard in CI (`workers: process.env.CI ? 2 : undefined`).
  - **Retries & Timeouts:** `2` retries on failure in CI, `45s` test timeout, `10s` assertion timeout.
- **Consolidated Reporting:**
  - Each shard outputs a Playwright **blob report** (`playwright-test/blob-report/`).
  - The `merge-reports` job downloads all 3 shard blob reports and merges them via `npx playwright merge-reports --reporter html ./all-blob-reports` into one consolidated `playwright-html-report` artifact.
  - Failure screenshots, videos, traces, and `results.json` are uploaded per shard as `test-artifacts-shard-<N>`.

---

## 2. Workflow Triggers

| Trigger | Behavior |
| :--- | :--- |
| **Push to `main`** | Runs all 3 shards automatically on every push to `main`. |
| **Pull Request to `main`** | Runs all 3 shards on PRs targeting `main`. |
| **Manual (`workflow_dispatch`)** | Allows manual run from the GitHub Actions tab with an optional `test_tag` filter (e.g., `@smoke`, `@auth`, `@private`, `@regression`). |
| **Nightly Schedule (`cron`)** | Runs automatically every night at `02:00 UTC` (`07:30 IST`). |

---

## 3. GitHub Secrets Configuration

Never hardcode credentials in the repository. Add the following in **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**:

| Secret Name | Required | Purpose |
| :--- | :---: | :--- |
| `BASE_URL` | Optional | Overrides target URL (defaults to `https://race-cyan.vercel.app/`). |
| `TEST_USER_EMAIL` | Recommended | Test account email/username for live credentialed flows. |
| `TEST_USER_PASSWORD` | Recommended | Test account password. |
| `TEST_USER_PHONE` | Recommended | Test account phone number (`deviceId`). |

> **Production Safety:** `RUN_LIVE_API` defaults to `'false'` in CI so destructive or mutating live backend tests (such as creating new users on the live database) are skipped automatically.

---

## 4. Local Validation Against Production

Before pushing, you can validate the exact CI behavior locally from `playwright-test/`:

```powershell
cd playwright-test

# 1. Typecheck all TypeScript files
npm run typecheck

# 2. Verify test discovery against production URL
$env:TEST_ENV="prod"; $env:BASE_URL="https://race-cyan.vercel.app/"; npx playwright test --list

# 3. Run a single shard locally against production URL
$env:TEST_ENV="prod"; $env:BASE_URL="https://race-cyan.vercel.app/"; npx playwright test --project=chromium --shard=1/3

# 4. Run smoke tests only
$env:TEST_ENV="prod"; $env:BASE_URL="https://race-cyan.vercel.app/"; npm run test:smoke
```

---

## 5. Pushing to GitHub & Verifying Pipeline Execution

1. **Stage, commit, and push your changes:**
   ```powershell
   git add .
   git commit -m "Configure enterprise Playwright CI/CD pipeline with 3-way sharding"
   git push origin main
   ```
2. **Monitor in GitHub Actions:**
   - Open your repository on GitHub and click the **Actions** tab.
   - Select **Playwright E2E CI/CD Pipeline**.
   - You will see 3 parallel shard jobs (`Shard 1/3`, `Shard 2/3`, `Shard 3/3`) followed by `Merge Sharded HTML Report`.
3. **Download Consolidated Report:**
   - Once complete, scroll to **Artifacts** at the bottom of the workflow run.
   - Download **`playwright-html-report`**, unzip it, and open `index.html` in your browser (or run `npx playwright show-report <unzipped-folder>`).
   - If any test failed, download `test-artifacts-shard-<N>` to inspect screenshots, videos, and Playwright traces.
