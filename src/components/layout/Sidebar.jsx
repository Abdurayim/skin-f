import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import useSound from '../../hooks/useSound'
import Badge from '../common/Badge'

export default function Sidebar({ isOpen, onClose }) {
  const { isAuthenticated, profile, isKYCVerified, logout } = useAuth()
  const { t } = useLanguage()
  const { play } = useSound()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    play('whoosh')
    await logout()
    navigate('/')
    onClose()
  }

  const handleNavigate = (path) => {
    play('click')
    navigate(path)
    onClose()
  }

  const handleClose = () => {
    play('whoosh')
    onClose()
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/create-post', icon: 'M12 4v16m8-8H4', label: t('nav.sell'), auth: true },
    { path: '/messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: t('nav.messages'), auth: true },
    { path: '/my-posts', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: t('nav.myPosts'), auth: true },
    { path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: t('nav.profile'), auth: true },
    { path: '/kyc', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: t('nav.verification'), auth: true, badge: !isKYCVerified }
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden animate-fade-in"
        onClick={handleClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed inset-y-0 right-0 w-72 bg-surface border-l border-border z-50 md:hidden animate-fade-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-text-primary font-bold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full glow-red" />
            Menu
          </span>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Profile Section */}
        {isAuthenticated && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center ring-2 ring-primary/30">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile?.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-bold text-lg">
                      {profile?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                {isKYCVerified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full flex items-center justify-center ring-2 ring-surface">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary truncate">
                  {profile?.name || t('common.user')}
                </p>
                <p className="text-xs text-text-secondary truncate">{profile?.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems
            .filter(item => !item.auth || isAuthenticated)
            .map((item, index) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  animate-fade-in-right
                  ${isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                )}
              </button>
            ))}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t('nav.logout')}
            </button>
          ) : (
            <button
              onClick={() => handleNavigate('/login')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all glow-red-subtle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {t('nav.login')}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
