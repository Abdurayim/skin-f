import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { formatDate } from '../../utils/formatters'
import { getImageUrl } from '../../config/api'

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
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_KYC_PENDING}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        const requests = data.data?.users || data.data?.verifications || data.data?.requests || data.data || []
        setKycRequests(Array.isArray(requests) ? requests : [])
      }
    } catch {
      // KYC requests fetch failed silently
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (action) => {
    if (!selectedKyc) return

    const kycId = selectedKyc._id || selectedKyc.id
    setReviewLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const endpoint = action === 'approved'
        ? ENDPOINTS.ADMIN_KYC_APPROVE(kycId)
        : ENDPOINTS.ADMIN_KYC_REJECT(kycId)

      const body = action === 'rejected'
        ? JSON.stringify({ reason: rejectionReason })
        : undefined

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body
      })

      if (response.ok) {
        setKycRequests(kycRequests.filter(k => (k._id || k.id) !== kycId))
        setSelectedKyc(null)
        setRejectionReason('')
      }
    } catch {
      // KYC review failed silently
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
                key={kyc._id || kyc.id}
                className="flex items-center gap-4 p-4 bg-surface-hover rounded-lg"
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {kyc.displayName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium">
                    {kyc.displayName || t('common.user')}
                  </p>
                  <p className="text-text-secondary text-sm">{kyc.email}</p>
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
                {(() => {
                  const doc = selectedKyc.kycDocuments?.find(d => d.type === 'id_card' || d.type === 'passport')
                  return doc ? (
                    <img
                      src={getImageUrl(doc.filePath)}
                      alt="Document"
                      className="w-full rounded-lg border border-border"
                    />
                  ) : (
                    <div className="w-full h-48 rounded-lg border border-border bg-surface-hover flex items-center justify-center text-text-secondary">
                      No document uploaded
                    </div>
                  )
                })()}
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  {t('kyc.selfieTitle')}
                </h4>
                {(() => {
                  const selfie = selectedKyc.kycDocuments?.find(d => d.type === 'selfie')
                  return selfie ? (
                    <img
                      src={getImageUrl(selfie.filePath)}
                      alt="Selfie"
                      className="w-full rounded-lg border border-border"
                    />
                  ) : (
                    <div className="w-full h-48 rounded-lg border border-border bg-surface-hover flex items-center justify-center text-text-secondary">
                      No selfie uploaded
                    </div>
                  )
                })()}
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
