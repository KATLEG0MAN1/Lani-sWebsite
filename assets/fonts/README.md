# Fonts

The display face is **Dope Bam** by GraphicsBam Fonts — a thick marker/graffiti
type. It is not served by Google Fonts or any other webfont CDN, so the file has
to live here.

## Adding it

Drop the font in as `DopeBam.woff2` (best), or `DopeBam.woff` / `DopeBam.ttf`.
The `@font-face` at the top of `assets/css/style.css` already looks for all
three. Nothing else to change.

Until a file is present every display element falls back to **Anton**, which is
loaded from Google Fonts, so the site never breaks — it just isn't his face yet.

Convert a `.ttf` or `.otf` to `.woff2` at <https://cloudconvert.com/ttf-to-woff2>
or with `woff2_compress` if you have it locally. woff2 is roughly a third of the
size of the ttf, which matters because this is the first thing that renders.

## Licensing — read before pushing

- The **free** version on [FontSpace](https://www.fontspace.com/dopebam-demo-font-f29039)
  is a **personal-use-only demo**, and it is uppercase-only.
- A **commercial** licence is sold through
  [Creative Fabrica](https://www.creativefabrica.com/product/dope-bam/).

A public artist site is commercial use, and committing the font here publishes
the file itself. Get the commercial licence before this goes live — that is why
the font is not already in the repo.

## Note on casing

The demo has no lowercase glyphs, so every element set in the display face is
uppercased in CSS (see the rule under `* { box-sizing }`). That is deliberate and
suits a marker face — release titles read as tags rather than sentences. If you
buy a version with a lowercase set and want mixed case back, delete that rule.
