import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import PostForm from '../components/posts/PostForm'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'
import { useLanguage } from '../hooks/useLanguage'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import useSound from '../hooks/useSound'
import { ENDPOINTS } from '../config/api'
import { getResponseData } from '../utils/apiHelpers'

export default function CreatePost() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { isKYCVerified } = useAuth()
  const { post, loading, error } = useApi()
  const { play } = useSound()

  const handleSubmit = async (formData) => {
    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price)
      submitData.append('currency', formData.currency)
      submitData.append('type', formData.type)
      submitData.append('gameId', formData.gameId)

      formData.images.forEach((image) => {
        if (image.file) {
          submitData.append('images', image.file)
        }
      })

      const { data, error: apiError } = await post(ENDPOINTS.POSTS, submitData)

      if (data) {
        play('success')
        // Backend returns: { data: { post: {...} } }
        const postId = getResponseData(data, 'post', '_id') || data.post?._id || data._id
        if (postId) {
          navigate(`/posts/${postId}`)
        } else {
          navigate('/my-posts')
        }
      } else {
        play('error')
      }
    } catch {
      play('error')
    }
  }

  if (!isKYCVerified) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center animate-fade-in">
            {/* KYC Required Icon */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-warning/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-24 h-24 mx-auto rounded-2xl bg-surface border border-border flex items-center justify-center">
                <svg className="w-12 h-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              {t('post.kycRequired')}
            </h1>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
              {t('post.kycRequiredDesc')}
            </p>

            <div className="bg-surface border border-border rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Why KYC?
              </h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Protects buyers from scams
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Builds trust in the marketplace
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Your identity stays private
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button glow size="lg" onClick={() => navigate('/kyc')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t('post.goToKyc')}
              </Button>
              <Link to="/posts">
                <Button variant="secondary" size="lg">
                  Browse Listings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/my-posts" className="text-text-secondary hover:text-primary transition-colors">
              My Listings
            </Link>
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-text-primary">Create New</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full glow-red" />
            {t('post.createTitle')}
          </h1>
          <p className="text-text-secondary mt-1">{t('post.createDesc')}</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8 animate-fade-in-up">
          {error && (
            <Alert type="error" message={error} className="mb-6" />
          )}
          <PostForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Tips */}
        <div className="mt-6 bg-surface/50 border border-border rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Tips for a great listing
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              Use clear, high-quality screenshots
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              Be specific about what's included
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              Set a competitive price
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              Respond quickly to messages
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
