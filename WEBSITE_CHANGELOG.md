# Website Changelog

## 2026-06-24 15:06 Asia/Shanghai
- Change summary: Migrated AI Compliance checkout from legacy payment routes to Polar, removed the legacy worker module, aligned Worker domain metadata with `aicompliance.online`, restored sitemap/robots build exports, and made the Worker accept both `SITE_ASSETS` and `ASSETS` bindings.
- Touched files: `index.html`, `src/App.jsx`, `worker/index.js`, `worker/polar.js`, removed legacy worker module, `wrangler.toml`, `WEBSITE_CHANGELOG.md`.
- Verification: `npm test`, `node --check worker/index.js`, `node --check worker/polar.js`, `git diff --check`, and targeted legacy payment keyword scans passed.
- Deployment/Git status: Ready for GitHub push and Cloudflare deployment in the current payment migration batch.
- Follow-up items: Production checkout should be verified after deploy with configured Polar secrets.

## 2026-05-28 15:31 CST
- Change summary: P0/P1 remediation: hardened unknown-path noindex behavior and pricing/resources routing, then redeployed.
- Touched files: worker/index.js.
- Verification: Deploy completed; route smoke checks passed.
- Deployment/Git: Deployed to Cloudflare where applicable; no commit or push was created in this turn.
- Follow-up: Search/Bing/GSC metrics and payment conversions may need 24-72 hours or owner-side provider/search-console permissions before the ledger fully clears.

## 2026-07-01 - MiroFish contextual reference

- Added one contextual related-resource link to MiroFish AI Simulator with UTM tracking for aicompliance.online.
- Placement rule: secondary Resources/Source context when available, otherwise the homepage tail; no hero, nav, pricing, checkout, or primary CTA links were changed.
- SEO safety: brand anchor only, one link per canonical site surface, visible editorial context, and no keyword-stuffed footer/sitewide block.
- Verification pending: run the site build/deploy workflow and live link checks after all portfolio edits are applied.
