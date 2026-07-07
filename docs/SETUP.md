# Deployment setup

Follow these steps in order. The app will not accept signups until Google Apps Script and `.env` are configured.

## 1. Google Sheet and Apps Script

1. Create a new Google Sheet (or open an existing one).
2. Go to **Extensions → Apps Script**.
3. Delete any default code and paste the contents of [`scripts/google-signup.gs`](../scripts/google-signup.gs).
4. Save the project.
5. In the toolbar, select **`setup`** from the function dropdown and click **Run**.
   - Authorize the script when prompted (Review permissions → your account → Allow).
   - This creates a **Signups** tab with headers: `timestamp`, `name`, `email`, `ip`, `fdm`, `fmaq`.
6. Generate a secret:
   ```bash
   openssl rand -hex 32
   ```
7. In Apps Script, open **Project settings** (gear icon) → **Script properties** → **Add script property**:
   - Property: `SIGNUP_SECRET`
   - Value: the string from step 6
8. Deploy the web app:
   - **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (ends in `/exec`).

Keep the web app URL and secret safe. They are never put in the frontend.

## 2. Configure environment on the VPS

1. Install Docker and Docker Compose on the VPS.
2. Clone the repo:
   ```bash
   git clone <your-repo-url> designer
   cd designer
   ```
3. Create `.env` from the example:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env`:
   ```env
   HOST_PORT=8080
   APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   SIGNUP_SECRET=same-value-as-script-property
   ```
   - `SIGNUP_SECRET` must match the Apps Script property exactly.
   - Set `HOST_PORT=80` if you want the container on port 80 directly (requires root-capable Docker or `cap_add`).

## 3. Start the app

```bash
docker compose up -d --build
```

Smoke test:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/
```

You should get `200`.

Test signup (replace values):

```bash
curl -s -X POST http://localhost:8080/api/signup \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","groups":["fdm"]}'
```

Expected: `{"ok":true}` and a new row in the **Signups** sheet.

## 4. Firewall and HTTPS

- Open the port you chose (`8080` or `80`) in your VPS firewall.
- For production, put **Caddy** or **nginx** on the host in front of the container:
  - Proxy `https://yourdomain.com` → `http://127.0.0.1:8080`
  - Terminate TLS on the host (Let's Encrypt / Caddy auto-HTTPS).
- The container serves HTTP only; HTTPS on the host is recommended.

## 5. Verify security

1. Open the site in a browser and submit the form.
2. In DevTools → **Network**, confirm only `/api/signup` is called (not `script.google.com`).
3. On the VPS, inspect the built bundle — it must not contain `APPS_SCRIPT_URL`, `SIGNUP_SECRET`, or `script.google.com`:
   ```bash
   docker compose exec app grep -r script.google /app/dist || echo "OK: no script URL in bundle"
   ```
4. Confirm the new row in Google Sheets has the correct `fdm` / `fmaq` booleans and an IP address.

## 6. Local development

Terminal 1 — API (needs `.env` with real Apps Script values):

```bash
node api/server.js
```

Terminal 2 — frontend:

```bash
npm run dev
```

Vite proxies `/api` to `http://localhost:8080`.

Or run everything in Docker:

```bash
docker compose up --build
```

## 7. Updating

```bash
git pull
docker compose up -d --build
```

## Troubleshooting

| Problem | Check |
|---------|--------|
| Container exits immediately | `docker compose logs app` — usually missing `APPS_SCRIPT_URL` or `SIGNUP_SECRET` in `.env` |
| `Unauthorized` from API | `SIGNUP_SECRET` mismatch between `.env` and Apps Script properties |
| Signup succeeds but no row | Apps Script deployment URL wrong; redeploy and update `.env` |
| Empty IP column | Normal behind some proxies; host reverse proxy should pass `X-Forwarded-For` or `X-Real-IP` |
