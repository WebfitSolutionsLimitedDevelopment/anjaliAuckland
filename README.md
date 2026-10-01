# theanjali.co.nz

Official website of **Anjali Balwal** — entrepreneur, international pageant personality, judge and mentor (Auckland, New Zealand).

- Zero-dependency static site. Source in `src/`, built to `public/` by `node build.mjs` (expands `{{pic ...}}` tags into responsive AVIF/WebP `<picture>` markup).
- Hosted on Vercel; every push to `main` deploys automatically.
- Self-hosted fonts (Cormorant Garamond, Jost, Pinyon Script — SIL OFL via Fontsource).
- Enquiry form posts to FormSubmit → bobyballi@gmail.com (first submission requires a one-time activation click in that inbox).

## Adding photos
1. Export AVIF/WebP at 640px and full width into `public/images/` as `name-640.avif`, `name-full.avif` (and `.webp`), plus `name.jpg`.
2. Add the dimensions to `dims` in `build.mjs`, then use `{{pic name "alt text" "sizes"}}` in `src/index.html`.
