# MAS Website

Portfolio and services site for Mosley Automation Systems. Static HTML/CSS/JS — no build step, no framework, no dependencies to install.

## What's here

```
mas-website/
├── index.html        # Full single-page site
├── css/style.css      # Design tokens + mobile-first layout
├── js/script.js        # Nav, accessibility panel, form validation
├── assets/mas-logo.png # MAS003 mark
└── README.md
```

## Running it locally

No build tools required — open `index.html` directly in a browser, or serve the folder with any static server, e.g.:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying

Same pattern as prior client sites (Glass House): push to a GitHub repo, enable GitHub Pages on `main` / root, done.

```powershell
cd "MAS WEBSITE"
git init
git add .
git commit -m "Initial MAS site build — current toolkit, standard v2.1, and services"
git remote add origin https://github.com/MosleyAutomationSystems/MAS-website.git
git branch -M main
git push -u origin main
```

Then: repo Settings → Pages → Source: `main` / `(root)`.

## Content sourced from

- `MAS_Revenue_Strategy_v2-1.docx` — service tier pricing (T1–T5)
- `mosley-standard-v2.docx` — four-pillar summaries (site reflects Standard v2.1 numbering; the security-framework additions from v2.1 are summarized in Pillar IV's copy)
- `MAS_Feature_Registry_v1.docx` — toolkit module count (49 built)
- Chat history — MAS LLC approval date, Language Switcher/Email Reporter status, Glass House case study numbers

## Before this goes live — things to check

- [x] Contact email is the real MAS inbox (`mosleyautomationsystems@gmail.com`) — confirmed against the capabilities proposal and revenue docs
- [x] Contact form removed — there was no backend wired up, and a fake "message received" confirmation would've misled anyone who submitted it. Replaced with a direct `mailto:` link plus a checklist of what to include. Revisit with Formspree (or similar) only if a real form becomes worth the added maintenance.
- [ ] GitHub link in the Toolkit section points at the org page, not a specific repo — update once the toolkit repo visibility is decided (public vs. private pro repo)
- [ ] Verify pricing in Services section still matches current MAS_Revenue_Strategy — this build used the version in the project's uploaded docx
- [ ] Run a full Mosley Standard audit pass before publishing (matches your existing habit on this project — last two audits both hit zero open findings before launch)

## Accessibility panel — what's implemented

- Theme: Dark (default) / Light / High Contrast
- Text size: Normal / Large / X-Large
- Reading-friendly font toggle (Lexend, swapped in for the body/display faces)
- Reduce motion toggle (also respects OS-level `prefers-reduced-motion` automatically)
- Large click targets toggle (48px minimum, on top of the 44px coarse-pointer floor that's always on)
- All preferences persist via `localStorage` across visits
- Panel is a keyboard-operable dialog: Escape closes it, focus moves to the first control on open, outside-click closes it

Not yet implemented, deferred same as the toolkit: letter-spacing as a separate slider (currently folded into the reading-friendly toggle), full WCAG 2.1 AAA line-length constraints.