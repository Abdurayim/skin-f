import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { useLanguage } from '../../hooks/useLanguage'
import { validatePhone } from '../../utils/validators'
import useSound from '../../hooks/useSound'

export default function PhoneInput({ onSubmit, loading, error }) {
  const { t } = useLanguage()
  const { play } = useSound()
  const [phone, setPhone] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')

    const validation = validatePhone(phone)
    if (!validation.valid) {
      play('error')
      setValidationError(validation.error)
      return
    }

    onSubmit(validation.formatted)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        type="tel"
        label={t('auth.phoneNumber')}
        placeholder="+998 90 123 45 67"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={validationError || error}
        required
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        }
      />

      <Button type="submit" fullWidth glow loading={loading} size="lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        {t('auth.sendCode')}
      </Button>

      <p className="text-center text-xs text-text-secondary">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  )
}
