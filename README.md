# Voice AI Agent

Conversion-focused SaaS site for `voiceaiagent.space`.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build generates prerendered HTML pages, `sitemap.xml`, `robots.txt`, and the IndexNow key file.

## Cloudflare

```bash
npm run cloudflare:deploy
npm run pages:deploy
```

Worker APIs:

- `GET /api/runtime`
- `POST /api/checkout`
- `POST /api/analytics/events`
- `GET /sitemap.xml`
- `GET /robots.txt`

Payment expects `API_PROD_KEY` to be configured as a Cloudflare secret.
