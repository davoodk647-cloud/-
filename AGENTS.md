# HEGEMON — آکادمی رشد

## Overview
A single-page Persian (RTL) learning academy app. Pure HTML/CSS/JS — no framework, no build step, no backend.

## Structure
- `index.html` — markup (RTL, lang=fa)
- `styles.css` — HEGEMON design system (metallic 3D + graphite dark theme)
- `app.js` — app logic (lessons CRUD, search, filters, modal, localStorage)
- `manifest.json` — PWA manifest

## Design System
All visual tokens are CSS custom properties in `:root` in `styles.css`. Change them there to restyle the whole app.
- **Palette:** graphite backgrounds (never pure black), metallic silver/gray for chrome, metallic red (`#e23c44`) for accents
- **Logo:** `.hegemon-logo` class — metallic gradient text-fill, sizes: `--lg`, `--md`, `--sm`
- **Brandmark:** `.brandmark` — compact metallic badge; `.brandmark--red` for red variant

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
# Served on http://localhost:3000 via nginx:alpine
```

## Notes
- Data is stored in browser `localStorage` (keys: `hegemon_lessons`, `hegemon_done`)
- Seed lessons are hardcoded in `app.js` (`SEED_LESSONS`) and used on first load
- Font: Vazirmatn loaded from CDN
