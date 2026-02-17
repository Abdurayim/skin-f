import { useState, useEffect } from 'react'
import Input, { Textarea } from '../common/Input'
import Button from '../common/Button'
import ImageUpload from '../common/ImageUpload'
import GameSelector from '../games/GameSelector'
import { useLanguage } from '../../hooks/useLanguage'
import { validatePost } from '../../utils/validators'
import useSound from '../../hooks/useSound'

export default function PostForm({ initialData, onSubmit, loading }) {
  const { t } = useLanguage()
  const { play } = useSound()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    type: 'skin',
    gameId: '',
    images: [],
    ...initialData
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleTypeSelect = (type) => {
    play('pop')
    handleChange('type', type)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validation = validatePost(formData)
    if (!validation.valid) {
      play('error')
      setErrors(validation.errors)
      return
    }

    onSubmit(formData)
  }

  const postTypes = [
    { value: 'skin', label: t('post.types.skin'), icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { value: 'account', label: t('post.types.account'), icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { value: 'item', label: t('post.types.item'), icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' }
  ]

  const currencies = [
    { value: 'USD', label: 'USD', symbol: '$' },
    { value: 'RUB', label: 'RUB', symbol: '₽' },
    { value: 'UZS', label: 'UZS', symbol: "so'm" }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label={t('post.title')}
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
        placeholder={t('post.titlePlaceholder')}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        }
      />

      {/* Description */}
      <Textarea
        label={t('post.description')}
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        rows={4}
        placeholder={t('post.descriptionPlaceholder')}
      />

      {/* Game Selector */}
      <GameSelector
        value={formData.gameId}
        onChange={(value) => handleChange('gameId', value)}
        error={errors.gameId}
      />

      {/* Post Type */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          {t('post.type')} <span className="text-error">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {postTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleTypeSelect(type.value)}
              className={`
                relative flex flex-col items-center gap-2 px-4 py-4 rounded-xl border text-sm font-medium transition-all duration-300
                ${formData.type === type.value
                  ? 'bg-primary/10 border-primary text-primary glow-red-subtle'
                  : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-primary/30'
                }
              `}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
              </svg>
              {type.label}
              {formData.type === type.value && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label={t('post.price')}
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          error={errors.price}
          required
          placeholder="0.00"
          min="0"
          step="0.01"
          icon={
            <span className="text-sm font-medium">
              {currencies.find(c => c.value === formData.currency)?.symbol || '$'}
            </span>
          }
        />
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {t('post.currency')}
          </label>
          <select
            value={formData.currency}
            onChange={(e) => {
              play('pop')
              handleChange('currency', e.target.value)
            }}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label} ({currency.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images */}
      <ImageUpload
        label={t('post.images')}
        value={formData.images}
        onChange={(images) => handleChange('images', images)}
        error={errors.images}
        maxFiles={5}
      />

      {/* Submit Button */}
      <Button type="submit" fullWidth glow loading={loading} size="lg">
        {initialData ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('common.save')}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('post.create')}
          </>
        )}
      </Button>
    </form>
  )
}
