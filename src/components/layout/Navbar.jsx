import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import useSound from '../../hooks/useSound'
import Dropdown, { DropdownItem, DropdownDivider } from '../common/Dropdown'
import Button from '../common/Button'
import Sidebar from './Sidebar'

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, profile, logout } = useAuth()
  const { t, language, setLanguage, availableLanguages } = useLanguage()
  const { play } = useSound()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    play('click')
    await logout()
    navigate('/')
  }

  const currentLang = availableLanguages.find(l => l.code === language)

  const navLinks = [
    { path: '/create-post', label: t('nav.sell'), auth: true },
    { path: '/messages', label: t('nav.messages'), auth: true }
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-primary/20 shadow-[0_4px_20px_rgba(255,51,102,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
              onMouseEnter={() => play('hover')}
            >
              <div className="relative w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-red-subtle group-hover:glow-red transition-all duration-300">
                <span className="text-white font-bold text-xl">S</span>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-text-primary font-bold text-xl hidden sm:block group-hover:text-primary transition-colors">
                Skin<span className="text-primary">Trader</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.auth && !isAuthenticated) return null
                const isActive = location.pathname === link.path

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                      ${isActive
                        ? 'text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                      }
                    `}
                    onMouseEnter={() => play('hover')}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary glow-red" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Switcher */}
              <Dropdown
                trigger={
                  <button
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-300"
                    onMouseEnter={() => play('hover')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm hidden sm:inline">{currentLang?.nativeName}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                }
              >
                {availableLanguages.map((lang) => (
                  <DropdownItem
                    key={lang.code}
                    onClick={() => {
                      play('click')
                      setLanguage(lang.code)
                    }}
                  >
                    <span className={language === lang.code ? 'text-primary' : ''}>
                      {lang.nativeName}
                    </span>
                  </DropdownItem>
                ))}
              </Dropdown>

              {/* User Menu / Login Button */}
              {isAuthenticated ? (
                <Dropdown
                  align="right"
                  trigger={
                    <button
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface transition-all duration-300 group"
                      onMouseEnter={() => play('hover')}
                    >
                      <div className="relative w-9 h-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden group-hover:glow-red transition-all duration-300">
                        {profile?.avatar ? (
                          <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-semibold">
                            {profile?.name?.[0]?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-text-secondary hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  }
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">{profile?.name || t('common.user')}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{profile?.phone}</p>
                  </div>
                  <DropdownItem
                    onClick={() => { play('click'); navigate('/profile') }}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  >
                    {t('nav.profile')}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => { play('click'); navigate('/my-posts') }}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    }
                  >
                    {t('nav.myPosts')}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => { play('click'); navigate('/kyc') }}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    }
                  >
                    {t('nav.verification')}
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onClick={handleLogout} danger>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('nav.logout')}
                  </DropdownItem>
                </Dropdown>
              ) : (
                <Button onClick={() => navigate('/login')} size="sm" glow>
                  {t('nav.login')}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  play('click')
                  setSidebarOpen(true)
                }}
                className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
