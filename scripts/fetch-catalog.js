/* Rebuilds data/releases.json from the public iTunes API.
   Run: node scripts/fetch-catalog.js   (needs Node 18+ for global fetch) */
const fs = require('fs');
const path = require('path');

const ARTIST_ID = 1660618648;                       // Lani Colors on Apple Music
const SPOTIFY_ARTIST = '3Y5Nj3eww4wehm2XfT1vyj';
const ROOT = path.join(__dirname, '..');

// Spotify album ids, filled in by hand as they are confirmed. Key = Apple collectionId.
const SPOTIFY_ALBUMS = {
  1886167162: '183P8VfWpNTNlk8beXhYDD', // WANNA RAGE
};

const get = async (url) => (await fetch(url)).json();
const big = (art, px) => art.replace(/\/\d+x\d+bb\.jpg$/, `/${px}x${px}bb.jpg`);

(async () => {
  const albums = (await get(
    `https://itunes.apple.com/lookup?id=${ARTIST_ID}&entity=album&limit=100`
  )).results.filter((r) => r.wrapperType === 'collection');

  const releases = [];
  for (const a of albums) {
    const songs = (await get(
      `https://itunes.apple.com/lookup?id=${a.collectionId}&entity=song&limit=100`
    )).results.filter((r) => r.wrapperType === 'track');

    // Keep parentheticals: 'New Feel' and 'New Feel (Deluxe)' must not collide.
    const slug = a.collectionName
      .replace(/ - Single$/, '').toLowerCase()
      .replace(/\(feat\..*?\)/g, '').replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    releases.push({
      id: a.collectionId,
      slug,
      title: a.collectionName.replace(/ - Single$/, ''),
      artist: a.artistName,
      type: a.trackCount === 1 ? 'single' : a.trackCount <= 8 ? 'ep' : 'album',
      year: a.releaseDate.slice(0, 4),
      released: a.releaseDate.slice(0, 10),
      trackCount: a.trackCount,
      genre: a.primaryGenreName,
      explicit: a.collectionExplicitness === 'explicit',
      label: (a.copyright || '').replace(/^℗\s*\d{4}\s*/, ''),
      cover: `assets/covers/${slug}.jpg`,
      coverRemote: big(a.artworkUrl100, 1400),
      links: {
        appleMusic: a.collectionViewUrl.split('?')[0],
        spotify: SPOTIFY_ALBUMS[a.collectionId]
          ? `https://open.spotify.com/album/${SPOTIFY_ALBUMS[a.collectionId]}`
          : null,
      },
      tracks: songs.map((t) => ({
        n: t.trackNumber,
        title: t.trackName,
        seconds: Math.round((t.trackTimeMillis || 0) / 1000),
        preview: t.previewUrl || null,
      })),
    });
  }

  releases.sort((a, b) => b.released.localeCompare(a.released));

  fs.writeFileSync(
    path.join(ROOT, 'data/releases.json'),
    JSON.stringify({ artist: { name: 'Lani Colors', spotifyArtist: SPOTIFY_ARTIST,
      appleArtist: `https://music.apple.com/us/artist/lani-colors/${ARTIST_ID}` },
      updated: new Date().toISOString().slice(0, 10), releases }, null, 2)
  );
  console.log(`wrote ${releases.length} releases`);
})();
