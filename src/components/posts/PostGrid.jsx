import PostCard from './PostCard'
import Button from '../common/Button'
import Loader, { SkeletonCard } from '../common/Loader'
import { useLanguage } from '../../hooks/useLanguage'

export default function PostGrid({ posts, loading, hasMore, onLoadMore }) {
  const { t } = useLanguage()

  if (loading && posts.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="text-center py-16 sm:py-24">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 mx-auto mb-6 rounded-2xl bg-surface border border-border flex items-center justify-center">
            <svg
              className="w-12 h-12 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {t('posts.noPostsFound')}
        </h3>
        <p className="text-text-secondary max-w-sm mx-auto">
          {t('posts.tryDifferentFilters')}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {posts.map((post, index) => (
          <div
            key={post._id}
            className="animate-fade-in-up opacity-0"
            style={{
              animationDelay: `${(index % 6) * 50}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={onLoadMore}
            loading={loading}
            className="min-w-[200px]"
          >
            {!loading && (
              <>
                <span>{t('common.loadMore')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </Button>
        </div>
      )}

      {/* End of results */}
      {!hasMore && posts.length > 0 && (
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-text-secondary text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('posts.seenAll')} ({posts.length})
          </div>
        </div>
      )}
    </div>
  )
}
