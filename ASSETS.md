# Olive Branch — Asset Conventions

Where files go, what to call them, and how they get used. Following this means
assets stay findable and never get duplicated.

---

## Where things go

| Folder | What belongs here |
|---|---|
| `assets/images/hero/` | Full-bleed hero imagery, one per page |
| `assets/images/lifestyle/` | Environmental, editorial, in-context photography |
| `assets/images/product/` | Product shots, detail crops, close-ups |
| `assets/images/texture/` | Paper, grain, washes, background textures |
| `assets/images/og/` | Social share images, 1200×630 |
| `assets/logos/` | Logo lockups, marks, favicon, app icons |
| `assets/icons/` | Standalone SVG icons (inline UI icons live in `js/icons.js`) |
| `assets/graphics/` | Illustrations, patterns, decorative elements |
| `assets/fonts/` | Brand webfonts, `.woff2` preferred |
| `assets/video/` | Background loops and embedded video |
| `assets/documents/` | PDFs, downloads, press kits |
| `brand/` | Reference only — style guide, Figma exports, swatch files. Not published. |

---

## Naming

Lowercase, hyphenated, descriptive of the *subject*, not the placement:

```
✓  olive-branch-wordmark-dark.svg
✓  home-hero.jpg
✓  storefront-morning.jpg
✓  founder-portrait.jpg

✗  IMG_4823.jpg
✗  Screen Shot 2026-08-16 at 2.14.11 PM.png
✗  final-FINAL-v3.jpg
✗  image1.jpg
```

Naming by subject means an image can be reused in a new section later without
its name becoming a lie.

### Suffixes worth using

- `-dark` / `-light` — colorway variants of a logo or mark
- `-mobile` — a differently-cropped version for small screens
- `@2x` — a retina variant, if one is supplied separately

---

## Sizes to export

| Use | Longest edge | Format |
|---|---|---|
| Full-bleed hero | 2400px | `.jpg` (or `.webp`) |
| Section / band image | 1800px | `.jpg` |
| Card or grid tile | 1200px | `.jpg` |
| Portrait / headshot | 1000px | `.jpg` |
| Logos, icons, line art | — | `.svg` |
| Anything needing transparency | 2× display size | `.png` |
| Social share | 1200 × 630 | `.jpg` |

Aim to keep individual images under ~400KB. `.webp` at quality 80 usually
beats `.jpg` by a wide margin if the client is fine with it.

---

## Referring to assets in conversation

Natural language is fine — "use the logo", "pull one of the lifestyle images",
"use the photo of the storefront". The folder gets checked first and the
existing file gets used. A new placeholder only appears if nothing suitable is
already there, and it'll be labelled with the exact path the real file should
take.

Assets are never silently duplicated. If the same image is needed in two
places, both places point at the one file.

---

## Placeholders in the code

Anywhere a real asset is still missing, the HTML has a labelled placeholder and
the real `<img>` tag sits commented out directly above it:

```html
<!-- <img src="assets/images/hero/home-hero.jpg" alt="" loading="lazy" decoding="async"> -->
<div class="media--placeholder">assets/images/hero/home-hero.jpg</div>
```

To swap in a real file: save it at that exact path, uncomment the `<img>`,
delete the placeholder `<div>`, and write a real `alt` description.

---

## Alt text

Every meaningful image needs `alt` describing what it shows. Decorative images
— textures, background flourishes — take `alt=""` so screen readers skip them.
