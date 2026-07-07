# Bhuvaneshwari M.C. — Semiconductor & Quantum Device Portfolio

A responsive, recruiter- and PI-facing research portfolio for **Bhuvaneshwari M.C.**, designed for PhD opportunities and semiconductor / quantum-device R&D roles.


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
