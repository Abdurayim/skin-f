import { useState, useRef, useEffect } from 'react'
import Button from '../common/Button'
import { useLanguage } from '../../hooks/useLanguage'
import useSound from '../../hooks/useSound'

export default function OTPInput({ onSubmit, onResend, loading, error, phone }) {
  const { t } = useLanguage()
  const { play } = useSound()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value) {
      play('pop')
      if (index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      onSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    play('success')
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)

    if (pastedData.length === 6) {
      onSubmit(pastedData)
    }
  }

  const handleResend = () => {
    play('click')
    onResend()
    setResendTimer(60)
  }

  const isComplete = otp.every(d => d)

  return (
    <div className="space-y-6">
      {/* Phone Display */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-hover">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-text-primary font-medium">{phone}</span>
        </div>
        <p className="text-text-secondary text-sm mt-2">
          {t('auth.codeSentTo')}
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => play('hover')}
            className={`
              w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold
              bg-surface border-2 rounded-xl
              text-text-primary
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30
              transition-all duration-300
              ${digit ? 'border-primary/50 glow-red-subtle' : 'border-border'}
              ${error ? 'border-error focus:border-error focus:ring-error/30' : ''}
            `}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-center gap-2 text-error animate-fade-in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Verify Button */}
      <Button
        type="button"
        fullWidth
        glow={isComplete}
        loading={loading}
        disabled={!isComplete}
        onClick={() => onSubmit(otp.join(''))}
        size="lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        {t('auth.verify')}
      </Button>

      {/* Resend Timer */}
      <div className="text-center">
        {resendTimer > 0 ? (
          <div className="flex items-center justify-center gap-2 text-text-secondary">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">
              {t('auth.resendIn')} <span className="text-primary font-medium">{resendTimer}s</span>
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('auth.resendCode')}
          </button>
        )}
      </div>
    </div>
  )
}
