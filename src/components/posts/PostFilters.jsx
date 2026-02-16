import { useState, useEffect } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { useLanguage } from '../../hooks/useLanguage'
import { useApi } from '../../hooks/useApi'
import useSound from '../../hooks/useSound'
import { ENDPOINTS } from '../../config/api'

export default function PostFilters({ filters, onChange, onReset }) {
  const { t } = useLanguage()
  const { get } = useApi()
  const { play } = useSound()
  const [games, setGames] = useState([])

  useEffect(() => {
    const fetchGames = async () => {
      const { data } = await get(ENDPOINTS.GAMES)
      if (data) {
        // Backend returns: { data: { games: [...] } } or { data: [...] }
        const gamesList = data.data?.games || data.data || data.games || []
        setGames(Array.isArray(gamesList) ? gamesList : [])
      }
    }
    fetchGames()
  }, [])

  const handleChange = (key, value) => {
    play('pop')
    onChange({ ...filters, [key]: value })
  }

  const postTypes = [
    { value: '', label: t('common.all') },
    { value: 'skin', label: t('post.types.skin') },
    { value: 'account', label: t('post.types.account') },
    { value: 'item', label: t('post.types.item') },
    { value: 'currency', label: t('post.types.currency') },
    { value: 'boosting', label: t('post.types.boosting') }
  ]

  const sortOptions = [
    { value: 'newest', label: t('filters.newest') },
    { value: 'oldest', label: t('filters.oldest') },
    { value: 'price_asc', label: t('filters.priceAsc') },
    { value: 'price_desc', label: t('filters.priceDesc') }
  ]

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 space-y-5 sticky top-24">
      <h3 className="font-semibold text-text-primary flex items-center gap-2 pb-4 border-b border-border/50">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {t('filters.title')}
      </h3>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {t('filters.search')}
        </label>
        <Input
          type="text"
          placeholder={t('filters.searchPlaceholder')}
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      {/* Game Select */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {t('filters.game')}
        </label>
        <select
          value={filters.game_id || ''}
          onChange={(e) => handleChange('game_id', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 appearance-none cursor-pointer"
          onFocus={() => play('hover')}
        >
          <option value="">{t('common.all')}</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>

      {/* Type Select */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {t('filters.type')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {postTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleChange('type', type.value)}
              className={`
                px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${filters.type === type.value
                  ? 'bg-primary text-white glow-red-subtle'
                  : 'bg-surface-hover text-text-secondary hover:text-text-primary border border-border hover:border-primary/30'
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {t('filters.priceRange')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={filters.min_price || ''}
            onChange={(e) => handleChange('min_price', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.max_price || ''}
            onChange={(e) => handleChange('max_price', e.target.value)}
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {t('filters.sortBy')}
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 appearance-none cursor-pointer"
          onFocus={() => play('hover')}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <Button variant="secondary" fullWidth onClick={onReset} className="mt-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {t('filters.reset')}
      </Button>
    </div>
  )
}
