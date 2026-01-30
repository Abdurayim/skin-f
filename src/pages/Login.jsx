import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import PhoneInput from '../components/auth/PhoneInput'
import OTPInput from '../components/auth/OTPInput'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import useSound from '../hooks/useSound'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { requestOTP, confirmOTP, error } = useAuth()
  const { t } = useLanguage()
  const { play } = useSound()

  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const handlePhoneSubmit = async (phoneNumber) => {
    setLoading(true)
    const success = await requestOTP(phoneNumber)
    setLoading(false)

    if (success) {
      play('success')
      setPhone(phoneNumber)
      setStep('otp')
    } else {
      play('error')
    }
  }

  const handleOTPSubmit = async (otp) => {
    setLoading(true)
    const result = await confirmOTP(otp)
    setLoading(false)

    if (result.success) {
      play('success')
      if (result.isNewUser) {
        navigate('/profile', { state: { isNew: true } })
      } else {
        navigate(from, { replace: true })
      }
    } else {
      play('error')
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    const success = await requestOTP(phone)
    setLoading(false)
    if (success) {
      play('notification')
    }
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
                {step === 'phone' ? t('auth.login') : t('auth.verifyCode')}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 'phone'
                  ? t('auth.loginDesc')
                  : t('auth.verifyDesc')
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {step === 'phone' ? (
                <PhoneInput
                  onSubmit={handlePhoneSubmit}
                  loading={loading}
                  error={error}
                />
              ) : (
                <OTPInput
                  phone={phone}
                  onSubmit={handleOTPSubmit}
                  onResend={handleResendOTP}
                  loading={loading}
                  error={error}
                />
              )}

              {step === 'otp' && (
                <button
                  onClick={() => {
                    play('click')
                    setStep('phone')
                  }}
                  className="mt-6 w-full text-center text-sm text-text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('auth.changePhone')}
                </button>
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

        <div id="recaptcha-container" />
      </div>
    </Layout>
  )
}
