# Website Changelog

## 2026-06-24 15:06 Asia/Shanghai
- Change summary: Migrated AI Compliance checkout from legacy payment routes to Polar, removed the legacy worker module, aligned Worker domain metadata with `aicompliance.online`, and restored sitemap/robots build exports.
- Touched files: `index.html`, `src/App.jsx`, `worker/index.js`, `worker/polar.js`, `worker/nowpayments.js`, `wrangler.toml`, `WEBSITE_CHANGELOG.md`.
- Verification: `npm test`, `node --check worker/index.js`, `node --check worker/polar.js`, `git diff --check`, and targeted legacy payment keyword scans passed.
- Deployment/Git status: Ready for GitHub push and Cloudflare deployment in the current payment migration batch.
- Follow-up items: Production checkout should be verified after deploy with configured Polar secrets.

## 2026-05-28 15:31 CST
- Change summary: P0/P1 remediation: hardened unknown-path noindex behavior and pricing/resources routing, then redeployed.
- Touched files: worker/index.js.
- Verification: Deploy completed; route smoke checks passed.
- Deployment/Git: Deployed to Cloudflare where applicable; no commit or push was created in this turn.
- Follow-up: Search/Bing/GSC metrics and payment conversions may need 24-72 hours or owner-side provider/search-console permissions before the ledger fully clears.
