import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import KYCStatus from '../components/kyc/KYCStatus'
import DocumentUpload from '../components/kyc/DocumentUpload'
import SelfieCapture from '../components/kyc/SelfieCapture'
import Button from '../components/common/Button'
import Alert from '../components/common/Alert'
import { useLanguage } from '../hooks/useLanguage'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import useSound from '../hooks/useSound'
import { ENDPOINTS } from '../config/api'

export default function KYC() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { profile, refreshProfile } = useAuth()
  const { post, loading, error } = useApi()
  const { play } = useSound()

  const [step, setStep] = useState(1)
  const [document, setDocument] = useState(null)
  const [selfie, setSelfie] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitStep, setSubmitStep] = useState(null) // 'uploading_id' | 'uploading_selfie' | 'verifying'

  const kycStatus = profile?.kycStatus || 'not_submitted'

  const handleSubmit = async () => {
    setErrors({})

    const newErrors = {}
    if (!document) newErrors.document = t('validation.required')
    if (!selfie) newErrors.selfie = t('validation.required')

    if (Object.keys(newErrors).length > 0) {
      play('error')
      setErrors(newErrors)
      return
    }

    const token = localStorage.getItem('accessToken')
    if (!token) {
      play('error')
      setErrors({ submit: 'Please log in again to continue' })
      return
    }

    try {
      // Upload ID document
      setSubmitStep('uploading_id')
      const docFormData = new FormData()
      docFormData.append('document', document)
      docFormData.append('documentType', 'id_card')

      const { data: docData, error: docError } = await post(ENDPOINTS.KYC_UPLOAD, docFormData)

      if (!docData?.success || docError) {
        setErrors({ submit: docError || docData?.message || 'Failed to upload ID document' })
        play('error')
        setSubmitStep(null)
        return
      }

      // Upload selfie
      setSubmitStep('uploading_selfie')
      const selfieFormData = new FormData()
      selfieFormData.append('document', selfie)
      selfieFormData.append('documentType', 'selfie')

      const { data: selfieData, error: selfieError } = await post(ENDPOINTS.KYC_UPLOAD, selfieFormData)

      if (!selfieData?.success || selfieError) {
        setErrors({ submit: selfieError || selfieData?.message || 'Failed to upload selfie' })
        play('error')
        setSubmitStep(null)
        return
      }

      // Trigger KYC verification
      setSubmitStep('verifying')
      const { data: verifyData, error: verifyError } = await post(ENDPOINTS.KYC_VERIFY, {})

      if (verifyError || !verifyData?.success) {
        setErrors({ submit: verifyError || verifyData?.message || 'Verification failed' })
        play('error')
        setSubmitStep(null)
        return
      }

      // Check if auto-verified or pending manual review
      if (verifyData.data?.verified) {
        play('success')
        await refreshProfile()
        const redirectTo = sessionStorage.getItem('kyc_return_path') || '/create-post'
        sessionStorage.removeItem('kyc_return_path')
        navigate(redirectTo)
      } else {
        // Face comparison failed — pending manual review
        play('success')
        await refreshProfile()
        // Component will re-render to show "pending" screen
      }
    } catch (err) {
      setErrors({ submit: err.message || 'An unexpected error occurred' })
      play('error')
    } finally {
      setSubmitStep(null)
    }
  }

  const goToStep = (s) => {
    play('pop')
    setStep(s)
  }

  // Approved status
  if (kycStatus === 'verified') {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-success/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-24 h-24 mx-auto rounded-full bg-success/20 flex items-center justify-center ring-4 ring-success/30">
                <svg className="w-12 h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              You're Verified!
            </h1>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
              Your identity has been verified. You can now create listings and trade on the marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button glow size="lg" onClick={() => navigate('/create-post')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('kyc.startSelling')}
              </Button>
              <Link to="/posts">
                <Button variant="secondary" size="lg">
                  Browse Listings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Pending status
  if (kycStatus === 'pending') {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-warning/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-24 h-24 mx-auto rounded-full bg-warning/20 flex items-center justify-center ring-4 ring-warning/30">
                <svg className="w-12 h-12 text-warning animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Verification in Progress
            </h1>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
              We're reviewing your documents. This usually takes 24-48 hours. We'll notify you once it's complete.
            </p>

            <div className="bg-surface border border-border rounded-2xl p-6 max-w-sm mx-auto mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-text-primary">Status: Pending Review</p>
                  <p className="text-sm text-text-secondary">Submitted recently</p>
                </div>
              </div>
            </div>

            <Link to="/posts">
              <Button variant="secondary" size="lg">
                Browse Listings While You Wait
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // KYC Form
  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3 mb-2">
            <span className="w-2 h-8 bg-primary rounded-full glow-red" />
            {t('kyc.title')}
          </h1>
          <p className="text-text-secondary">
            {t('kyc.subtitle')}
          </p>
        </div>

        {/* Rejected Alert */}
        {kycStatus === 'rejected' && (
          <Alert
            type="error"
            title={t('kyc.rejected')}
            message={profile?.kycRejectionReason || t('kyc.rejectedDesc')}
            className="mb-6 animate-fade-in"
          />
        )}

        {errors.submit && (
          <Alert type="error" message={errors.submit} className="mb-6 animate-fade-in" />
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8 animate-fade-in">
          {[
            { num: 1, label: 'Document' },
            { num: 2, label: 'Selfie' }
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <button
                onClick={() => s.num < step && goToStep(s.num)}
                disabled={s.num > step}
                className={`
                  flex flex-col items-center transition-all duration-300
                  ${s.num <= step ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${step === s.num
                      ? 'bg-primary text-white glow-red-subtle scale-110'
                      : step > s.num
                        ? 'bg-success text-white'
                        : 'bg-surface border-2 border-border text-text-secondary'
                    }
                  `}
                >
                  {step > s.num ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.num
                  )}
                </div>
                <span className={`
                  mt-2 text-xs font-medium transition-colors
                  ${step >= s.num ? 'text-text-primary' : 'text-text-secondary'}
                `}>
                  {s.label}
                </span>
              </button>
              {i < 1 && (
                <div className={`
                  w-16 sm:w-24 h-1 mx-2 sm:mx-4 rounded-full transition-colors duration-500
                  ${step > s.num ? 'bg-success' : 'bg-border'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8 animate-fade-in-up">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Upload ID Document</h2>
                <p className="text-sm text-text-secondary">
                  Upload a clear photo of your passport, driver's license, or national ID card.
                </p>
              </div>

              <DocumentUpload
                value={document}
                onChange={setDocument}
                error={errors.document}
              />

              <div className="bg-surface-hover rounded-xl p-4">
                <h4 className="text-sm font-medium text-text-primary mb-2">Requirements:</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Document must be valid and not expired
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    All text must be clearly readable
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No glare or shadows on photo
                  </li>
                </ul>
              </div>

              <Button
                fullWidth
                glow
                size="lg"
                onClick={() => {
                  if (!document) {
                    play('error')
                    setErrors({ document: t('validation.required') })
                    return
                  }
                  play('success')
                  setErrors({})
                  setStep(2)
                }}
              >
                {t('common.continue')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Take a Selfie</h2>
                <p className="text-sm text-text-secondary">
                  Take a clear selfie to verify your identity matches the document.
                </p>
              </div>

              <SelfieCapture
                value={selfie}
                onChange={setSelfie}
                error={errors.selfie}
              />

              <div className="bg-surface-hover rounded-xl p-4">
                <h4 className="text-sm font-medium text-text-primary mb-2">Tips for a good selfie:</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Face the camera directly
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Good lighting, no shadows on face
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Remove glasses and hats
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  size="lg"
                  onClick={() => goToStep(1)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('common.back')}
                </Button>
                <Button
                  fullWidth
                  glow
                  size="lg"
                  loading={loading || !!submitStep}
                  onClick={handleSubmit}
                >
                  {submitStep === 'uploading_id' ? 'Uploading ID...'
                    : submitStep === 'uploading_selfie' ? 'Uploading Selfie...'
                    : submitStep === 'verifying' ? 'Verifying...'
                    : t('kyc.submit')}
                  {!submitStep && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-start gap-3 text-sm text-text-secondary animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p>
            Your documents are encrypted and securely stored. We only use them to verify your identity and will never share them with third parties.
          </p>
        </div>
      </div>
    </Layout>
  )
}
