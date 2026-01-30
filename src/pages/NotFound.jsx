import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Button from '../components/common/Button'
import { useLanguage } from '../hooks/useLanguage'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        </div>

        <div className="text-center relative">
          {/* 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-[150px] sm:text-[200px] font-bold text-primary/10 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl sm:text-8xl font-bold text-primary text-glow-intense animate-pulse">
                404
              </span>
            </div>
          </div>

          {/* Glitch effect decoration */}
          <div className="relative mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              {t('errors.pageNotFound')}
            </h2>
          </div>

          <p className="text-text-secondary max-w-md mx-auto mb-8 text-lg">
            {t('errors.pageNotFoundDesc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" glow>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('common.backToHome')}
              </Button>
            </Link>
            <Link to="/posts">
              <Button variant="secondary" size="lg">
                Browse Listings
              </Button>
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="mt-16 flex justify-center gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-primary/30 animate-bounce"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
