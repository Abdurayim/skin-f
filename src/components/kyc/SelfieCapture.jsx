import { useState, useRef } from 'react'
import Button from '../common/Button'
import { useLanguage } from '../../hooks/useLanguage'

export default function SelfieCapture({ value, onChange, error }) {
  const { t } = useLanguage()
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [fileError, setFileError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileError('')

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    const isImageMime = file.type.startsWith('image/')
    const isAllowedExt = allowedExtensions.includes(ext)

    // Some browsers report empty MIME or application/octet-stream for HEIC
    if (!isImageMime && !isAllowedExt) {
      setFileError('Please upload an image file (JPG, PNG, HEIC, etc.)')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File is too large. Maximum size is 10MB.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)
    onChange(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-text-primary">
              {t('kyc.selfieTitle')}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {t('kyc.selfieDesc')}
            </p>
          </div>
        </div>

        {preview || value ? (
          <div className="mt-4 relative">
            <img
              src={preview || (value instanceof File ? URL.createObjectURL(value) : value)}
              alt="Selfie preview"
              className="w-full max-h-64 object-contain rounded-lg border border-border"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-error rounded-full text-white hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
            >
              <svg className="mx-auto h-12 w-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="mt-2 text-sm text-text-secondary">
                {t('kyc.takeOrUploadSelfie')}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {t('kyc.maxFileSize')}
              </p>
            </button>
          </div>
        )}
      </div>

      {fileError && (
        <p className="text-sm text-error flex items-center gap-1.5 mt-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {fileError}
        </p>
      )}
      {!fileError && error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}
