import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import PostGrid from '../components/posts/PostGrid'
import PostFilters from '../components/posts/PostFilters'
import Button from '../components/common/Button'
import { useLanguage } from '../hooks/useLanguage'
import { useApi } from '../hooks/useApi'
import useSound from '../hooks/useSound'
import { ENDPOINTS } from '../config/api'

export default function Posts() {
  const { t } = useLanguage()
  const { get, loading } = useApi()
  const { play } = useSound()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [posts, setPosts] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    gameId: searchParams.get('gameId') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  })

  const fetchPosts = useCallback(async (cursor = null, append = false) => {
    const params = new URLSearchParams()
    params.append('limit', '12')
    if (cursor) params.append('cursor', cursor)

    // Map frontend filter names to backend query params
    const { search, sort, ...rest } = filters
    Object.entries(rest).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    if (search) params.append('q', search)
    if (sort) {
      const sortMap = {
        newest: { sortBy: 'createdAt', sortOrder: 'desc' },
        oldest: { sortBy: 'createdAt', sortOrder: 'asc' },
        price_asc: { sortBy: 'price', sortOrder: 'asc' },
        price_desc: { sortBy: 'price', sortOrder: 'desc' }
      }
      const { sortBy, sortOrder } = sortMap[sort] || sortMap.newest
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)
    }

    const { data } = await get(`${ENDPOINTS.POSTS}?${params.toString()}`)

    if (data) {
      const responseData = data.data || data
      const newPosts = responseData.posts || []
      const pagination = responseData.pagination || {}
      if (append) {
        setPosts(prev => [...prev, ...newPosts])
      } else {
        setPosts(newPosts)
      }
      setNextCursor(pagination.nextCursor || null)
      setHasMore(pagination.hasMore ?? newPosts.length === 12)
    }
  }, [filters])

  useEffect(() => {
    setNextCursor(null)
    fetchPosts(null, false)

    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params, { replace: true })
  }, [filters, fetchPosts, setSearchParams])

  const handleLoadMore = () => {
    play('click')
    fetchPosts(nextCursor, true)
  }

  const handleFilterChange = (newFilters) => {
    play('pop')
    setFilters(newFilters)
  }

  const handleFilterReset = () => {
    play('whoosh')
    setFilters({
      search: '',
      gameId: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    })
  }

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'newest').length

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="animate-fade-in-left">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => {
                  play('whoosh')
                  navigate('/')
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary transition-all duration-300 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline font-medium">Back</span>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full glow-red" />
                {t('posts.title')}
              </h1>
            </div>
            <p className="text-text-secondary">{t('posts.subtitle')}</p>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              play('click')
              setShowFilters(!showFilters)
            }}
            className="lg:hidden animate-fade-in-right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {t('filters.title')}
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className={`
            fixed inset-0 z-50 lg:relative lg:z-0
            ${showFilters ? 'block' : 'hidden lg:block'}
          `}>
            {/* Mobile overlay */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm lg:hidden animate-fade-in"
              onClick={() => {
                play('whoosh')
                setShowFilters(false)
              }}
            />

            {/* Filters panel */}
            <div className={`
              fixed right-0 top-0 h-full w-80 bg-background p-4 overflow-y-auto
              lg:relative lg:w-72 lg:p-0 lg:bg-transparent
              animate-fade-in-right lg:animate-none
            `}>
              {/* Mobile header */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {t('filters.title')}
                </h2>
                <button
                  onClick={() => {
                    play('click')
                    setShowFilters(false)
                  }}
                  className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <PostFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
              />
            </div>
          </aside>

          {/* Posts Grid */}
          <main className="flex-1 min-w-0 animate-fade-in-up">
            <PostGrid
              posts={posts}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </main>
        </div>
      </div>
    </Layout>
  )
}
