# `.github/workflows/` - CI/CD + keep-alive

## `ci-cd.yml`
1. `backend-tests` and `frontend-tests` run in parallel on every push/PR
   (`npm ci && npm test && npm run build` in each folder).
2. `deploy` only runs if BOTH pass, and only on a push to `main` — it then
   calls two GitHub secrets holding your Render + Vercel **deploy hook
   URLs**. If either test job fails, this job (and therefore any
   deployment) never runs.

**Required setup (one-time):**
- In Render: Service Settings → **turn OFF "Auto-Deploy"** (so pushing to
  `main` doesn't deploy on its own), then Settings → **Deploy Hook** → copy
  the URL.
- In Vercel: Project Settings → Git → **Deploy Hooks** → create one for the
  `main` branch, copy the URL. Also set **Ignored Build Step** to
  `exit 0` is not needed once auto-deploy triggers only via the hook, but
  if Vercel still auto-builds on push, disconnect the GitHub integration's
  auto-deploy and rely on the hook instead (Project Settings → Git →
  disconnect, keep the Deploy Hook).
- In your GitHub repo: Settings → Secrets and variables → Actions → add
  `RENDER_DEPLOY_HOOK_URL` and `VERCEL_DEPLOY_HOOK_URL`.
- (Optional but recommended) Settings → Branches → add a branch protection
  rule on `main` requiring the `backend-tests` and `frontend-tests` checks
  to pass before merging, so even PR merges can't bypass this.

## `keep-alive.yml`
Pings `GET /api/health` (already implemented in
`backend/src/routes/index.ts`) every 10 minutes so Render's free tier
doesn't spin the instance down.

**Required setup:** add a `RENDER_APP_URL` secret with your live backend
URL, e.g. `https://order-management-api.onrender.com`.

**More reliable alternative:** GitHub's cron scheduler is best-effort and
disables itself after 60 days without any repo activity. For something you
can set-and-forget, use a free external pinger instead — **UptimeRobot** or
**cron-job.org** — pointed at the same `/api/health` URL every 5-10
minutes. You can use either or both; they're not mutually exclusive.
