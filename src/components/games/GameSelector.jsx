import { useState, useEffect } from 'react'
import { useApi } from '../../hooks/useApi'
import { useLanguage } from '../../hooks/useLanguage'
import { ENDPOINTS, getImageUrl } from '../../config/api'
import Loader from '../common/Loader'

export default function GameSelector({ value, onChange, error }) {
  const { t } = useLanguage()
  const { get, loading } = useApi()
  const [games, setGames] = useState([])
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error: apiError } = await get(ENDPOINTS.GAMES)
      if (data) {
        // Backend returns: { data: { games: [...] } } or { data: [...] }
        const gamesList = data.data?.games || data.data || data.games || []
        setGames(Array.isArray(gamesList) ? gamesList : [])
        if (!Array.isArray(gamesList) || gamesList.length === 0) {
          setFetchError('No games available. Please contact administrator.')
        }
      } else if (apiError) {
        setFetchError(apiError)
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

      {fetchError && (
        <div className="mb-3 p-4 bg-error/10 border border-error/30 rounded-xl">
          <p className="text-sm text-error font-medium flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fetchError}
          </p>
        </div>
      )}

      {games.length === 0 && !loading && !fetchError ? (
        <div className="p-8 bg-surface border border-border rounded-xl text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-text-secondary mb-1">No games available</p>
          <p className="text-sm text-text-secondary">Please contact the administrator to add games first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {games.map((game) => (
            <button
              key={game._id || game.id}
              type="button"
              onClick={() => onChange(game._id || game.id)}
              className={`
                p-3 rounded-lg border text-left transition-colors
                ${value === (game._id || game.id)
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
                      {game.name?.[0] || '?'}
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
      )}

      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
    </div>
  )
}
