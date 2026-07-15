import { useState } from 'react'
import { gameArtUrl } from '../../utils/gameArt'

/**
 * Small square game icon with a graceful letter-tile fallback when no
 * artwork exists or the image fails to load.
 */
export default function GameIcon({ game, className = 'w-12 h-12 rounded-lg', textClass = 'text-xl' }) {
  const [failed, setFailed] = useState(false)
  const src = gameArtUrl(game)

  if (!src || failed) {
    return (
      <div className={`${className} bg-surface-hover flex items-center justify-center flex-shrink-0`}>
        <span className={`${textClass} font-bold text-text-secondary`}>
          {game?.name?.[0]?.toUpperCase() || '?'}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={game?.name || ''}
      className={`${className} object-cover flex-shrink-0`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
