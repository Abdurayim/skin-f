import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { formatDate } from '../../utils/formatters'

export default function KYCReview() {
  const { t } = useLanguage()
  const [kycRequests, setKycRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedKyc, setSelectedKyc] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchKycRequests()
  }, [])

  const fetchKycRequests = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_KYC}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setKycRequests(data)
      }
    } catch (err) {
      console.error('Failed to fetch KYC requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (status) => {
    if (!selectedKyc) return

    setReviewLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_KYC_REVIEW(selectedKyc.id)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          rejection_reason: status === 'rejected' ? rejectionReason : null
        })
      })

      if (response.ok) {
        setKycRequests(kycRequests.filter(k => k.id !== selectedKyc.id))
        setSelectedKyc(null)
        setRejectionReason('')
      }
    } catch (err) {
      console.error('Failed to review KYC:', err)
    } finally {
      setReviewLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : kycRequests.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-text-secondary">{t('admin.noPendingKyc')}</p>
          </div>
        ) : (
          <div className="grid gap-4 p-6">
            {kycRequests.map(kyc => (
              <div
                key={kyc.id}
                className="flex items-center gap-4 p-4 bg-surface-hover rounded-lg"
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {kyc.user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium">
                    {kyc.user?.name || t('common.user')}
                  </p>
                  <p className="text-text-secondary text-sm">{kyc.user?.phone}</p>
                  <p className="text-text-secondary text-xs mt-1">
                    {t('admin.submittedOn')} {formatDate(kyc.createdAt)}
                  </p>
                </div>
                <Button onClick={() => setSelectedKyc(kyc)}>
                  {t('admin.review')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedKyc}
        onClose={() => {
          setSelectedKyc(null)
          setRejectionReason('')
        }}
        title={t('admin.kycReview')}
        size="xl"
      >
        {selectedKyc && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  {t('kyc.documentTitle')}
                </h4>
                <img
                  src={selectedKyc.document_url}
                  alt="Document"
                  className="w-full rounded-lg border border-border"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  {t('kyc.selfieTitle')}
                </h4>
                <img
                  src={selectedKyc.selfie_url}
                  alt="Selfie"
                  className="w-full rounded-lg border border-border"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t('admin.rejectionReason')}
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder={t('admin.rejectionReasonPlaceholder')}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="danger"
                fullWidth
                onClick={() => handleReview('rejected')}
                loading={reviewLoading}
                disabled={!rejectionReason.trim()}
              >
                {t('admin.reject')}
              </Button>
              <Button
                variant="success"
                fullWidth
                onClick={() => handleReview('approved')}
                loading={reviewLoading}
              >
                {t('admin.approve')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
