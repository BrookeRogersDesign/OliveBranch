# Olive Branch — Website

A hand-built, no-build-step static site. Open `index.html` in a browser and it
works. Nothing to install, nothing to compile — which also means it deploys to
GitHub Pages, Netlify, or any host by dropping the folder in.

---

## Structure

```
Olive Branch/
├── index.html              Home
├── about.html              placeholder — nav works, design pending
├── solutions.html          placeholder
├── contact.html            placeholder (form is real)
├── 404.html
├── _page-template.html     copy this to start a new page
│
├── components/             GLOBAL COMPONENTS — edit once, changes everywhere
│   ├── site-nav.js         header + mobile drawer
│   └── site-footer.js      footer
│
├── css/
│   ├── main.css            the only stylesheet a page links; imports the rest
│   ├── tokens.css          ★ colors, type scale, spacing, radius, motion
│   ├── fonts.css           @font-face declarations
│   ├── base.css            reset + global typography
│   ├── layout.css          containers, sections, grids, aspect ratios
│   ├── components.css      buttons, nav, footer, cards, forms, media, etc.
│   ├── utilities.css       small helpers
│   └── pages/
│       └── home.css        homepage-only styles
│
├── js/
│   ├── site.config.js      ★ nav links, contact details, footer content
│   ├── icons.js            inline SVG icon set
│   └── main.js             scroll reveal, accordions, forms, viewport fix
│
├── assets/
│   ├── images/
│   │   ├── hero/           full-bleed hero imagery
│   │   ├── lifestyle/      environmental / editorial photography
│   │   ├── product/        product or detail shots
│   │   ├── texture/        backgrounds, paper, grain
│   │   └── og/             social share images (1200×630)
│   ├── logos/              logo files, favicon, brand marks
│   ├── icons/              standalone SVG icons
│   ├── graphics/           illustrations, patterns, decorative elements
│   ├── fonts/              .woff2 / .woff brand fonts
│   ├── video/              background and embedded video
│   └── documents/          PDFs and downloads
│
└── brand/                  brand reference only, not shipped to the web
                            (style guide, Figma exports, swatches, notes)
```

★ = the two files that control the most. Start there.

---

## How to change things

| I want to… | Edit |
|---|---|
| Change a color, font size, spacing, or corner radius site-wide | `css/tokens.css` |
| Add or rename a nav link | `js/site.config.js` → `nav` |
| Change footer text, social links, contact email | `js/site.config.js` → `footer` / `contact` |
| Change how the header or overlay nav looks or behaves | `components/site-nav.js` + sections 2–3 of `css/components.css` |
| Change the footer layout | `components/site-footer.js` + the footer section of `css/components.css` |
| Restyle every button on the site | `.btn` in `css/components.css` |
| Swap the wordmark for the real logo | Put the file in `assets/logos/`, set `brand.logoSrc` in `js/site.config.js` |
| Add the brand fonts | Drop `.woff2` files in `assets/fonts/`, uncomment the blocks in `css/fonts.css`, update the two font stacks in `css/tokens.css` |

Because the nav and footer are rendered from single files, updating one updates
every page — including pages built months from now.

---

## Adding a new page

1. Copy `_page-template.html` → `newpage.html`
2. Update `<title>` and the meta description
3. Add `{ label: "New page", href: "newpage.html" }` to `nav` in `js/site.config.js`
4. Only if the page needs unique styles: create `css/pages/newpage.css` and add
   one `@import` line at the bottom of `css/main.css`

That's it. The header, footer, typography, buttons, spacing, and responsive
behaviour are inherited automatically. The active nav link highlights itself
based on the filename.

---

## Brand

Olive Branch is an accounting practice. Tagline: **Thoughtful Accounting for
Modern Life**.

**Colors** — the four core values come from the Figma file (Draft 01 → Assets):

| | Hex | Used for |
|---|---|---|
| Ink | `#2E2A1F` | Deepest backgrounds, top of the nav gradient |
| Olive | `#3F3722` | Primary text, deep sections |
| Khaki | `#786D4E` | Menu pill, accents, hover states |
| Sage | `#E0E1D9` | Pale ground, light text on dark |

**Type**

| | Face | Status |
|---|---|---|
| Display / headlines | FreightDisp Pro, Medium | Licensed — needs an Adobe kit or self-hosted files. Falls back to Georgia today. |
| Body, nav, UI | Work Sans, 400 / 500 | Loading from Google Fonts. Self-host before launch. |

See the notes at the top of `css/fonts.css` for both.

**Navigation** — matches the Figma: a stacked OLIVE / BRANCH wordmark top-left
and a khaki menu pill top-right, opening a full-screen gradient ground with a
large white rounded panel on the right. Below 900px the panel fills the screen.
The alternate 250×264 dropdown variant in the Figma is a straightforward swap
if that direction wins instead.

---

## Design system at a glance

Restrained, generous whitespace, near-rectangular corners, subtle motion —
following the Hark Capital reference Brooke flagged, dialled back a notch.

- **Type** — one fluid scale from `--text-xs` to `--text-5xl`, all using
  `clamp()` so sizes move smoothly between breakpoints instead of jumping
- **Color** — a raw brand ramp plus semantic tokens (`--color-text`,
  `--color-brand`…). Components only ever reference the semantic ones, so
  recoloring the site means editing about a dozen lines
- **Section themes** — add `.theme-deep`, `.theme-muted`, or `.theme-sage` to
  any `<section>` and every component inside re-themes itself
- **Motion** — durations and easings are tokens, so the whole site's feel can
  be retuned from one place. `prefers-reduced-motion` is respected throughout

---

## Responsive approach

Authored mobile-first — base styles *are* the mobile layout, and each
breakpoint adds complexity as space allows. Layouts are genuinely rebuilt at
each size rather than scaled down:

| | |
|---|---|
| Mobile | 0 – 599px |
| Tablet | 600 – 899px |
| Laptop | 900 – 1199px |
| Desktop | 1200px+ |
| Wide | 1600px+ |

Specific mobile adjustments already in place: nav collapses to a full-screen
drawer at 900px, image crops change ratio (tall/portrait become square below
600px, the hero goes 4:3), buttons stack full-width below 480px, hero gradient
runs bottom-up on mobile and left-right on desktop, and inputs use a 16px
minimum font size so iOS doesn't zoom on focus.

---

## Working with assets

See `ASSETS.md` for naming conventions and where each type of file belongs.
Short version: drop files into the matching `assets/` subfolder, name them
descriptively in lowercase-with-hyphens, and reference the existing file rather
than adding a second copy.

Placeholder blocks in the HTML are labelled with the exact path the real file
should take, e.g. `assets/images/hero/home-hero.jpg`. Drop the file at that
path, then swap the placeholder `<div>` for the commented-out `<img>` directly
above it.

---

## Deploying

**GitHub Pages** — push the folder as a repo, then Settings → Pages → deploy
from `main` / root. No build step needed. All paths are relative, so it works
from a subdirectory too.

**Anywhere else** — upload the folder. That's the whole process.
