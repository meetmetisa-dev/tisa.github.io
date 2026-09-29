# Tisa Selma — Research portfolio

A responsive, dependency-free portfolio covering video Quality of Experience, human-centered AI, and reliable machine learning.

## Site structure

- Introduction and research overview
- Six publications with journal/conference filters
- Education and professional background
- Contact and CV download

The page uses semantic HTML, CSS, and a small progressive-enhancement script. Content and navigation remain available without JavaScript. Mobile navigation supports Escape, publication filters announce their result count, and research links reveal papers hidden by filters. Reduced-motion and print styles are included. No external fonts, tracking, or runtime libraries are required.

## Publications

The 2026 QoE-Foresight paper is **published in IEEE Access**. Its citation is:

T. Selma, M. M. Masud and S. Harous, “QoE-Foresight: Performance-Aware Drift Detection and Self-Healing for Adaptive Video Streaming QoE Prediction Systems,” IEEE Access, doi: [10.1109/ACCESS.2026.3730093](https://doi.org/10.1109/ACCESS.2026.3730093).

Official article: <https://ieeexplore.ieee.org/document/11676017/>

The site links to publisher-hosted PDF viewers/downloads for the 2026 and 2025 IEEE Access papers and the 2024 Technologies paper, plus KoreaScience’s full-text PDF for the 2016 medical-imaging article. PDF viewing and download behavior is controlled by the hosting provider. Full article/DOI links are provided alongside them.

The CV and existing research-figure assets remain in `assets/`. Earlier figures are explanatory reconstructions, not original journal figures. They are retained for reuse but are no longer displayed on the shortened homepage.

## Preview

Serve the repository root with any static HTTP server, for example:

```sh
python -m http.server 8080
```

Then visit <http://localhost:8080>.

## Deployment and maintenance

The existing GitHub Pages configuration publishes this repository. Keep its current Pages source settings. No build step is needed.

Edit `index.html` for copy and publication links, `styles.css` for appearance, and `app.js` for navigation and filtering. When adding a paper, update the publication total and category counts. Preserve exact titles and DOI links; only label papers open access when supported by the publication record.
