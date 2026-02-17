import { useState, useRef } from 'react'
import Button from '../common/Button'
import { useLanguage } from '../../hooks/useLanguage'

export default function DocumentUpload({ value, onChange, error }) {
  const { t } = useLanguage()
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [fileError, setFileError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileError('')

    if (!file.type.startsWith('image/')) {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-text-primary">
              {t('kyc.documentTitle')}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {t('kyc.documentDesc')}
            </p>
          </div>
        </div>

        {preview || value ? (
          <div className="mt-4 relative">
            <img
              src={preview || (value instanceof File ? URL.createObjectURL(value) : value)}
              alt="Document preview"
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
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
            >
              <svg className="mx-auto h-12 w-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-text-secondary">
                {t('kyc.clickToUpload')}
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
