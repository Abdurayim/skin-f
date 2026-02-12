import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import Layout from '../components/layout/Layout'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import useSound from '../hooks/useSound'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginWithGoogle, error } = useAuth()
  const { t } = useLanguage()
  const { play } = useSound()

  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    const result = await loginWithGoogle(credentialResponse.credential)

    if (result.success) {
      play('success')
      if (result.isNewUser) {
        navigate('/profile', { state: { isNew: true } })
      } else {
        navigate(from, { replace: true })
      }
    } else {
      setLoading(false)
      play('error')
    }
  }

  const handleGoogleError = () => {
    play('error')
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-500" />
        </div>

        <div className="w-full max-w-md relative">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in-down">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center glow-red group-hover:glow-red-intense transition-all duration-300">
                <span className="text-white font-bold text-3xl">S</span>
              </div>
            </Link>
          </div>

          <Card glass className="animate-fade-in-up" padding="lg">
            <CardHeader>
              <CardTitle className="text-center">
                {t('auth.login')}
              </CardTitle>
              <CardDescription className="text-center">
                {t('auth.loginDesc')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  size="large"
                  width="360"
                  text="signin_with"
                />
              </div>

              {loading && (
                <div className="mt-4 flex justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in-up delay-200">
            {[
              { icon: '🔒', label: 'Secure' },
              { icon: '⚡', label: 'Fast' },
              { icon: '✓', label: 'Verified' }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-3 rounded-xl bg-surface/50 border border-border/50"
              >
                <div className="text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs text-text-secondary">{feature.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}
