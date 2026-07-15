import { getImageUrl } from '../config/api'

// Header artwork for titles available on Steam, served from Steam's CDN
// (the same source the home page has always used for its defaults).
// Titles without a Steam page get a branded gradient tile instead.
const KNOWN_GAME_ART = {
  'counter-strike 2': 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
  'dota 2': 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
  'pubg: battlegrounds': 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg',
  'apex legends': 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg',
  'rust': 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg',
  'team fortress 2': 'https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg',
  'gta v': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
  'gta v online': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
  'grand theft auto v': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
  'ark: survival evolved': 'https://cdn.akamai.steamstatic.com/steam/apps/346110/header.jpg',
  'diablo iv': 'https://cdn.akamai.steamstatic.com/steam/apps/2344520/header.jpg',
  'rainbow six siege': 'https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg',
  'rocket league': 'https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg',
  'call of duty: warzone': 'https://cdn.akamai.steamstatic.com/steam/apps/1962663/header.jpg',
  'overwatch 2': 'https://cdn.akamai.steamstatic.com/steam/apps/2357570/header.jpg',
  'path of exile': 'https://cdn.akamai.steamstatic.com/steam/apps/238960/header.jpg',
  'fifa / ea fc': 'https://cdn.akamai.steamstatic.com/steam/apps/2669320/header.jpg',
}

/**
 * Best available artwork URL for a game, or null when none exists.
 * Priority: explicit image → admin-set icon (full URL or uploaded file) →
 * known Steam artwork. Bare filenames from legacy seed data ("cs2.png")
 * are ignored — those files never existed.
 */
export function gameArtUrl(game) {
  if (!game) return null
  if (game.image) return game.image
  const icon = game.icon || ''
  if (icon.startsWith('http') || icon.startsWith('/uploads') || icon.startsWith('uploads')) {
    return getImageUrl(icon)
  }
  return KNOWN_GAME_ART[(game.name || '').toLowerCase()] || null
}

// Deterministic hue from the game name so each tile gets a stable color.
function nameHue(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return h
}

/**
 * Self-contained branded tile (SVG data URI): dark gradient, glow accents,
 * and a large watermark initial. No text label — the card's own overlay
 * shows the game name, so the tile must not repeat it.
 */
export function gameArtPlaceholder(name = '?', width = 460, height = 215) {
  const hue = nameHue(name)
  const hue2 = (hue + 50) % 360
  const initial = (name.trim()[0] || '?').toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue},55%,22%)"/>
      <stop offset="1" stop-color="hsl(${hue2},65%,10%)"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.8" cy="0.15" r="0.9">
      <stop offset="0" stop-color="hsl(${hue},80%,55%)" stop-opacity="0.35"/>
      <stop offset="1" stop-color="hsl(${hue},80%,55%)" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  <circle cx="${width * 0.12}" cy="${height * 0.85}" r="${height * 0.5}" fill="hsl(${hue2},70%,45%)" opacity="0.12"/>
  <text x="78%" y="62%" dominant-baseline="middle" text-anchor="middle"
    font-family="system-ui,Segoe UI,Arial,sans-serif" font-weight="800"
    font-size="${Math.floor(height * 0.85)}" fill="rgba(255,255,255,0.08)">${initial}</text>
</svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
