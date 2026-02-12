import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProfileCard from '../components/profile/ProfileCard'
import ProfileForm from '../components/profile/ProfileForm'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import { useLanguage } from '../hooks/useLanguage'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import useSound from '../hooks/useSound'
import { ENDPOINTS } from '../config/api'

export default function Profile() {
  const location = useLocation()
  const { t } = useLanguage()
  const { profile, refreshProfile, isKYCVerified } = useAuth()
  const { put, loading, error } = useApi()
  const { play } = useSound()

  const [isEditing, setIsEditing] = useState(location.state?.isNew || false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    refreshProfile()
  }, [])

  const handleSubmit = async (formData) => {
    const { data } = await put(ENDPOINTS.USER_UPDATE_PROFILE, formData)

    if (data) {
      play('success')
      await refreshProfile()
      setIsEditing(false)
      setSuccessMessage(t('profile.updateSuccess'))
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      play('error')
    }
  }

  const handleEdit = () => {
    play('click')
    setIsEditing(true)
  }

  const handleCancel = () => {
    play('whoosh')
    setIsEditing(false)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome message for new users */}
        {location.state?.isNew && (
          <Alert
            type="success"
            title={t('profile.welcome')}
            message={t('profile.completeProfile')}
            className="mb-6 animate-fade-in"
          />
        )}

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            className="mb-6 animate-fade-in"
            onClose={() => setSuccessMessage('')}
          />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6 animate-fade-in"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Quick Stats */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-left">
            {/* Profile Summary Card */}
            <div className="bg-surface border border-border rounded-2xl p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden ring-4 ring-primary/30">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-bold text-3xl">
                      {profile?.displayName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                {isKYCVerified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success rounded-full flex items-center justify-center ring-4 ring-surface">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-1">
                {profile?.displayName || 'User'}
              </h2>
              <p className="text-text-secondary text-sm mb-4">{profile?.email}</p>
              <div className="flex justify-center gap-2">
                {isKYCVerified ? (
                  <Badge variant="success" glow>Verified Seller</Badge>
                ) : (
                  <Badge variant="warning">Unverified</Badge>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface border border-border rounded-2xl p-4 space-y-2">
              <h3 className="font-semibold text-text-primary px-2 mb-3">Quick Actions</h3>
              <Link
                to="/my-posts"
                onClick={() => play('click')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                My Listings
              </Link>
              <Link
                to="/messages"
                onClick={() => play('click')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Messages
              </Link>
              {!isKYCVerified && (
                <Link
                  to="/kyc"
                  onClick={() => play('click')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-warning hover:bg-warning/10 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Complete KYC
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="bg-surface border border-border rounded-2xl p-4">
              <h3 className="font-semibold text-text-primary px-2 mb-3">Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-hover rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{profile?.postsCount || 0}</p>
                  <p className="text-xs text-text-secondary">Listings</p>
                </div>
                <div className="bg-surface-hover rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-success">{0}</p>
                  <p className="text-xs text-text-secondary">Sold</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 animate-fade-in-right">
            {isEditing ? (
              <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                    <span className="w-2 h-6 bg-primary rounded-full glow-red" />
                    {t('profile.edit')}
                  </h2>
                  {!location.state?.isNew && (
                    <button
                      onClick={handleCancel}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <ProfileForm
                  profile={profile}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              </div>
            ) : (
              <>
                <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                      <span className="w-2 h-6 bg-primary rounded-full glow-red" />
                      Profile Information
                    </h2>
                    <Button variant="secondary" onClick={handleEdit}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-surface-hover rounded-xl p-4">
                        <p className="text-sm text-text-secondary mb-1">Full Name</p>
                        <p className="text-text-primary font-medium">{profile?.displayName || '-'}</p>
                      </div>
                      <div className="bg-surface-hover rounded-xl p-4">
                        <p className="text-sm text-text-secondary mb-1">Email</p>
                        <p className="text-text-primary font-medium">{profile?.email || '-'}</p>
                      </div>
                      <div className="bg-surface-hover rounded-xl p-4">
                        <p className="text-sm text-text-secondary mb-1">Location</p>
                        <p className="text-text-primary font-medium">{profile?.city || '-'}</p>
                      </div>
                    </div>

                    {profile?.bio && (
                      <div className="bg-surface-hover rounded-xl p-4">
                        <p className="text-sm text-text-secondary mb-2">Bio</p>
                        <p className="text-text-primary">{profile.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* KYC Status Card */}
                <div className="mt-6 bg-surface border border-border rounded-2xl p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                      ${isKYCVerified ? 'bg-success/20' : 'bg-warning/20'}
                    `}>
                      <svg
                        className={`w-6 h-6 ${isKYCVerified ? 'text-success' : 'text-warning'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-1">
                        {isKYCVerified ? 'Identity Verified' : 'Verify Your Identity'}
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        {isKYCVerified
                          ? 'Your account is verified. You can create listings and trade safely.'
                          : 'Complete KYC verification to start selling on the marketplace.'}
                      </p>
                      {!isKYCVerified && (
                        <Link to="/kyc">
                          <Button size="sm" glow>
                            Start Verification
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
