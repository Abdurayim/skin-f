import { useState, useEffect } from 'react'
import Input, { Textarea } from '../common/Input'
import Button from '../common/Button'
import { useLanguage } from '../../hooks/useLanguage'
import useSound from '../../hooks/useSound'

export default function ProfileForm({ profile, onSubmit, loading }) {
  const { t } = useLanguage()
  const { play } = useSound()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || ''
      })
    }
  }, [profile])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required')
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail')
    }

    if (Object.keys(newErrors).length > 0) {
      play('error')
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label={t('profile.name')}
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <Input
        type="email"
        label={t('profile.email')}
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        hint={t('profile.emailHint')}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      />

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {t('profile.bio')}
        </label>
        <Textarea
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={4}
          maxLength={500}
          placeholder={t('profile.bioPlaceholder')}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-text-secondary">
            Tell others about yourself
          </p>
          <p className={`text-xs ${formData.bio.length > 450 ? 'text-warning' : 'text-text-secondary'}`}>
            {formData.bio.length}/500
          </p>
        </div>
      </div>

      <Button type="submit" fullWidth glow loading={loading} size="lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {t('common.save')}
      </Button>
    </form>
  )
}
