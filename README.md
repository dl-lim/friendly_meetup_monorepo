# Friendly Meetup

Landing page for Friendly Data Meetup and Friendly Meetup for Actuaries and Quants. Visitors can sign up for meetup updates; submissions are stored in a Google Sheet via a small Node API and Google Apps Script.

## Stack

- **Frontend:** Vue 3, Vite
- **API:** Node (`api/server.js`) — proxies signups to Google Apps Script
- **Deployment:** Docker (static build + API in one container)

## Local development

1. Copy env and fill in real values (see [docs/SETUP.md](docs/SETUP.md) for Google Apps Script setup):

   ```bash
   cp .env.example .env
   ```

2. Terminal 1 — API:

   ```bash
   node api/server.js
   ```

3. Terminal 2 — frontend:

   ```bash
   npm install
   npm run dev
   ```

   Open http://localhost:5173. Vite proxies `/api` to `http://localhost:8080`.

Restart `node api/server.js` after changing `.env` — it only reads env vars at startup.

## Pre-selecting signup groups

Use the `groups` query param to pre-check group checkboxes:

- `/?groups=fdm` — Friendly Data Meetup only
- `/?groups=fmaq` — Actuaries and Quants only
- `/?groups=fdm,fmaq` — both

Valid ids: `fdm`, `fmaq`. If omitted or invalid, both groups are selected.

## Spam protection (honeypot)

The signup form includes a hidden field, `colleagues_invited`, that real users never see or fill. Bots that auto-fill every input often populate it.

- **Frontend** (`src/App.vue`): off-screen text input, included in the `/api/signup` JSON body. Must stay empty for real signups.
- **API** (`api/server.js`): if `colleagues_invited` is non-empty, returns `{ "ok": true }` immediately and does **not** write to the sheet (silent reject so bots do not retry).

Quick check after deploy:

```bash
curl -s -X POST http://localhost:8080/api/signup \
  -H 'Content-Type: application/json' \
  -d '{"name":"Bot","email":"bot@example.com","groups":["fdm"],"colleagues_invited":"3"}'
```

Expected: `{"ok":true}` with **no** new row in the sheet.

## Deployment

Full VPS / Docker / HTTPS setup: [docs/SETUP.md](docs/SETUP.md).

Quick start:

```bash
cp .env.example .env   # edit with APPS_SCRIPT_URL and SIGNUP_SECRET
docker compose up -d --build
```

## Project layout

```
api/server.js           # signup API
scripts/google-signup.gs  # paste into Google Apps Script
src/                    # Vue app
docs/SETUP.md           # deployment guide
```

Google Apps Script and Sheet are in dl@doublewoodc.com Google account