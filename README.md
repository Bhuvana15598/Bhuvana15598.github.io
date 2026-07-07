# Bhuvaneshwari M.C. — Semiconductor & Quantum Device Portfolio

A responsive, recruiter- and PI-facing research portfolio for **Bhuvaneshwari M.C.**, designed for PhD opportunities and semiconductor / quantum-device R&D roles.

## Visual concept

The design uses a custom **semiconductor observatory / research foundry** language rather than a generic developer template:

- mineral-ivory background with ultraviolet, plasma-orange, ion-blue and signal-lime accents
- wafer-map hero visual with scan markers
- illustrative AlGaN / 2DEG / GaN heterostructure stack
- measurement-trace readout
- editorial research chapters instead of repeated glass cards
- band-diagram visual connecting experiment and computation
- staggered research-path timeline
- dark technical project index with category-specific signal bars

## Portfolio story

The site is structured as a research narrative rather than a long digital résumé:

1. **Why interfaces** — how the Si-QD thesis motivates a broader interest in surfaces, passivation and device behavior.
2. **Device direction** — the fabricate → characterize → extract → model loop.
3. **The path** — electronics → ISRO instrumentation → KTH cleanroom and characterization → Si-QD thesis → independent device simulation.
4. **Flagship work** — six selected projects that establish experimental and computational depth.
5. **Lab + model toolkit** — process, metrology, semiconductor physics, simulation and quantum-device tools.
6. **Close the loop** — a band-diagram-led section connecting measurement to physical modelling.
7. **Project index** — a growing documented project set with search and category filters; newer local projects can be added as they are pushed publicly.
8. **Foundation and momentum** — education, recognition and credentials.
9. **Research fit and contact** — evidence-based positioning for PhD and R&D opportunities.

## Technology

- Semantic HTML5
- Custom responsive CSS
- Vanilla JavaScript
- Scroll-reveal interactions
- Scroll progress and active navigation states
- Canvas-based semiconductor crystal / carrier animation
- Searchable and filterable project index
- Reduced-motion support
- No runtime framework or external JavaScript dependency

## Project structure

```text
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── favicon.svg
│   ├── og-card.svg
│   ├── certificates/
│   └── resume/
│       └── Bhuvaneshwari_MC_Resume.pdf
├── robots.txt
├── .nojekyll
└── README.md
```

## Run locally

From the project directory:

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## Deploy with GitHub Pages

1. Create a new GitHub repository, for example `bhuvaneshwari-portfolio`.
2. Place the contents of this folder at the repository root.
3. Commit and push:

```bash
git init
git add .
git commit -m "Launch research portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/bhuvaneshwari-portfolio.git
git push -u origin main
```

4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch **main** and folder **/(root)**.
7. Save and wait for the Pages deployment to complete.

## Updating content

- Main copy and links: `index.html`
- Visual design and responsive behavior: `css/styles.css`
- Navigation, project filtering and semiconductor background animation: `js/main.js`
- Résumé PDF: replace `assets/resume/Bhuvaneshwari_MC_Resume.pdf` while keeping the filename unchanged, or update the links in `index.html`. The visible CV buttons use the HTML `download` attribute so the PDF downloads directly from the deployed site.

## Accessibility and performance

- Semantic sectioning and a single page-level heading
- Skip link and visible keyboard focus states
- Keyboard-friendly project filters and navigation
- `prefers-reduced-motion` support
- Responsive mobile navigation
- No external font request
- No frontend framework or heavy runtime dependency
