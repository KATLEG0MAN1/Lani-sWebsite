# Lani Colors — official site

A static, dependency-free site for [Lani Colors](https://open.spotify.com/artist/3Y5Nj3eww4wehm2XfT1vyj)
(Xolani Buyeye — hip-hop, Tahoe Studios). No build step, no framework: open
`index.html` on any static host and it runs.

## What it does

**The gate.** The site opens as a full sheet of his orange with one mark in the
middle. Swiping up drains the sheet off the top of the screen: the trailing edge
stretches into tongues of liquid, thin runners form, and beads pinch off and
fall. It is driven entirely by scroll position — swipe back down and the water
pours back in. Drawn on a canvas in `assets/js/gate.js`.

**The cross** opens a panel about him — who he is, the catalogue in numbers
(pulled live from `data/releases.json`, so it never goes stale), and links out to
Spotify, Apple Music and Instagram. The pack download lives at the bottom of that
panel; until `assets/downloads/lani-colors.zip` exists it reads "Pack drops soon"
rather than serving a 404.

**The catalogue.** Everything under the gate is rendered from
`data/releases.json`: 12 releases, 63 tracks, real cover art, filters, live
search across release *and* track titles, a detail panel per release, and a
player that streams Apple Music's public 30-second previews. Every release is
deep-linkable (`…/#thank-god`).

## The two files you need to add

**1. The photograph** → `assets/img/hero.jpg`

The orange-room shot. Drop it in and it takes over the whole hero: the drawn
light bar stands down and the type moves into the shadow at the left. Nothing to
change in code — `assets/js/main.js` probes for the file and adds `.has-photo`
if it loads. Without it the CSS light carries the hero on its own.

**2. The pack** → `assets/downloads/lani-colors.zip`

Drop the zip in with exactly that name and the mark on the gate starts serving
it. Again no code change: `gate.js` does a `HEAD` request on load and only
falls back to the "Pack drops soon" message when the file is missing.

## The ideas box

There is an **Ideas** section where people can send him something — cover art, a
verse, a video treatment, a show. GitHub Pages is static hosting, so there is no
server to receive a form; it has to post to a form service.

Until one is wired up, the section shows a working route to his Instagram DMs
rather than a form that quietly swallows what people write.

### Turning it on

Pick a service, then paste its endpoint into `IDEAS_ENDPOINT` at the top of
`assets/js/main.js`. That is the only change needed — the form, validation, spam
honeypot and status messages are already built.

```js
const IDEAS_ENDPOINT = 'https://formsubmit.co/your@email.com';
```

Two that work with plain static hosting:

- **[FormSubmit](https://formsubmit.co)** — no signup. The endpoint is just
  `https://formsubmit.co/` plus his email. Submissions arrive as email. The first
  one triggers a confirmation link he has to click once.
- **[Formspree](https://formspree.io)** — needs a free account, gives a dashboard
  and 50 submissions a month on the free tier. Endpoint looks like
  `https://formspree.io/f/xxxxxxx`.

Both accept the `FormData` POST the site already sends, and both respect the
`_honey` honeypot field for spam.

## Refreshing the catalogue

When a new release lands on Apple Music:

```bash
node scripts/fetch-catalog.js
```

That rewrites `data/releases.json` from the public iTunes API — releases,
tracklists, durations, preview URLs, labels and artwork URLs. Then pull down the
new cover art (the site serves covers locally rather than hotlinking Apple):

```bash
node -e "const d=require('./data/releases.json');d.releases.forEach(r=>console.log(r.slug+' '+r.coverRemote))" > covers.txt
while read slug url; do curl -sL -o "assets/covers/$slug.jpg" "$url"; done < covers.txt && rm covers.txt
```

### Spotify album links

Spotify has no free public API for this without auth, and the catalogue is too
small to be indexed by search engines yet, so only one album ID is confirmed. The
release panels link to Apple Music always, and to Spotify only where an ID is
known. To add more, put them in `SPOTIFY_ALBUMS` at the top of
`scripts/fetch-catalog.js`, keyed by Apple's `collectionId`, and re-run it:

```js
const SPOTIFY_ALBUMS = {
  1886167162: '183P8VfWpNTNlk8beXhYDD', // WANNA RAGE
  // 6783368889: '...',                 // THANK GOD+
};
```

Grab an ID by opening the album on Spotify — it is the last part of the URL.

## Running it locally

`fetch()` needs http, so opening `index.html` from the filesystem will not load
the catalogue. Serve the folder:

```bash
npx serve .
```

## Notes

- Colours are sampled off the photograph — the burnt corner, the falloff, the
  lit floor, the suit, and the warm yellow core of the tube. They live as tokens
  at the top of `assets/css/style.css`.
- `prefers-reduced-motion` is respected throughout: the drain becomes a direct
  cut, and the reveals and loops stop.
- The Spotify embed is sandboxed without `allow-top-navigation`. Left unpenned it
  navigates the whole page out to open.spotify.com.
- Cover art and preview audio are served from Apple; they belong to their
  respective rights holders.
