# Friendly Meetup

Monorepo for Friendly Data Meetup and Friendly Meetup for Actuaries and Quants.

| Folder    | What's in it |
|-----------|--------------|
| `web/`    | Landing page and signup API (Vue 3 + Vite, Node). See [web/README.md](web/README.md). |
| `events/` | Event copy (`pages/`), group description and hackathon ideas. See [events/README.md](events/README.md). |

## Running the site

```bash
cp web/.env.example web/.env   # fill in APPS_SCRIPT_URL and SIGNUP_SECRET
docker compose up -d --build   # from the repo root, or from web/
```

Full setup guide: [web/docs/SETUP.md](web/docs/SETUP.md).
