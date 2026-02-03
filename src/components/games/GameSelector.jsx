import { useState, useEffect } from 'react'
import { useApi } from '../../hooks/useApi'
import { useLanguage } from '../../hooks/useLanguage'
import { ENDPOINTS, getImageUrl } from '../../config/api'
import Loader from '../common/Loader'

export default function GameSelector({ value, onChange, error }) {
  const { t } = useLanguage()
  const { get, loading } = useApi()
  const [games, setGames] = useState([])

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error: apiError } = await get(ENDPOINTS.GAMES)
      if (data) {
        setGames(data)
      }
    }
    fetchGames()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader size="sm" />
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        {t('post.game')} <span className="text-error">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {games.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => onChange(game.id)}
            className={`
              p-3 rounded-lg border text-left transition-colors
              ${value === game.id
                ? 'bg-primary/10 border-primary'
                : 'bg-surface border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center gap-2">
              {game.icon ? (
                <img
                  src={getImageUrl(game.icon)}
                  alt={game.name}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-surface-hover flex items-center justify-center">
                  <span className="text-sm font-bold text-text-secondary">
                    {game.name[0]}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-text-primary truncate">
                {game.name}
              </span>
            </div>
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
    </div>
  )
}
