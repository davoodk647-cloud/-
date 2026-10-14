# AGENTS.md

## Project Overview
Static single-page HTML site (Persian/RTL learning academy — "آکادمی رشد هژمون"). No build step, no backend, no database.

## Running in the Sandbox
- Served via `python:3.12-slim` running `http.server` on port 8000, mapped to host port 3000.
- nginx was tried first but failed with 403 because the sandbox repo directory has `700` permissions (only root can traverse); the Python server runs as root and reads fine.
- No live-reload dev server — edits to `index.html` require `reload_preview` to appear.

## Missing Files
`index.html` references `styles.css`, `app.js`, and `manifest.json`, but none of these files exist in the repo. The page loads unstyled and non-interactive until they are added.

## No Secrets Required
No external services, no credentials needed.
