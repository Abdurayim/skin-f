import { getImageUrl } from '../config/api'

// Header artwork for well-known PC titles, served from Steam's CDN
// (the same source the home page has always used for its defaults).
// Mobile/non-Steam titles fall back to a generated tile.
const KNOWN_GAME_ART = {
  'counter-strike 2': 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
  'dota 2': 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
  'pubg: battlegrounds': 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg',
  'apex legends': 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg',
  'rust': 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg',
  'team fortress 2': 'https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg',
  'gta v': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
  'grand theft auto v': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
  'ark: survival evolved': 'https://cdn.akamai.steamstatic.com/steam/apps/346110/header.jpg',
  'diablo iv': 'https://cdn.akamai.steamstatic.com/steam/apps/2344520/header.jpg',
  'rainbow six siege': 'https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg',
  'rocket league': 'https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg',
  'call of duty: warzone': 'https://cdn.akamai.steamstatic.com/steam/apps/1962663/header.jpg',
}

/**
 * Best available artwork URL for a game, or null when none exists.
 * Bare filenames (legacy seed data like "cs2.png") are ignored — those
 * files never existed.
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
 * Self-contained SVG placeholder tile (data URI) with a gradient and the
 * game's name — always renders, no external requests.
 */
export function gameArtPlaceholder(name = '?', width = 460, height = 215) {
  const hue = nameHue(name)
  const label = name.length > 24 ? name.slice(0, 23) + '…' : name
  const fontSize = Math.max(16, Math.min(34, Math.floor((width * 0.9) / Math.max(label.length, 6))))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue},60%,28%)"/>
      <stop offset="1" stop-color="hsl(${(hue + 40) % 360},70%,14%)"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
    font-family="system-ui,Segoe UI,Arial,sans-serif" font-weight="700"
    font-size="${fontSize}" fill="rgba(255,255,255,0.92)">${label.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>
</svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
