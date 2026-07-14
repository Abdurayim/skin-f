import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { adminFetch } from '../../utils/adminAuth'
import { formatDate } from '../../utils/formatters'

/**
 * Fetches a cheque image via the authenticated admin endpoint
 * and displays it as a blob URL.
 */
function ChequeImage({ chequePath, className }) {
  const [src, setSrc] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!chequePath) return

    let objectUrl = null
    const fetchImage = async () => {
      try {
        const filename = chequePath.split('/').pop()
        const response = await adminFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_TOPUP_CHEQUE(filename)}`)
        if (!response.ok) {
          setError(true)
          return
        }
        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      } catch {
        setError(true)
      }
    }

    fetchImage()

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [chequePath])

  if (error || !chequePath) {
    return (
      <div className={`flex items-center justify-center bg-surface-hover text-text-secondary text-sm ${className}`}>
        Failed to load cheque
      </div>
    )
  }

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-surface-hover ${className}`}>
        <Loader size="sm" />
      </div>
    )
  }

  return <img src={src} alt="Cheque" className={className} />
}

export default function TopUps() {
  const { t } = useLanguage()
  const [topups, setTopups] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [banner, setBanner] = useState('')

  const fetchTopups = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page })
      if (statusFilter) params.append('status', statusFilter)
      const response = await adminFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_TOPUPS}?${params}`)
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        const list = data.data?.topups || []
        setTopups(Array.isArray(list) ? list : [])
      }
    } catch {
      // fetch failed silently
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchTopups()
  }, [fetchTopups])

  const handleReview = async (approve) => {
    if (!selected) return
    setActionLoading(true)
    setError('')
    try {
      const endpoint = approve
        ? ENDPOINTS.ADMIN_TOPUP_APPROVE(selected.id)
        : ENDPOINTS.ADMIN_TOPUP_REJECT(selected.id)
      const response = await adminFetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(approve ? { note } : { reason: note }),
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        const who = selected.user?.displayName || t('admin.user')
        setBanner(approve
          ? `✅ ${who}: +${selected.amount?.toLocaleString()} UZS`
          : `❌ ${who}: rejected`)
        setTimeout(() => setBanner(''), 4000)
        setSelected(null)
        setNote('')
        fetchTopups()
      } else {
        setError(data?.message || `Failed (${response.status})`)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const statusVariants = { pending: 'warning', approved: 'success', rejected: 'error' }

  return (
    <AdminLayout>
      {banner && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
          {banner}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-text-primary">{t('admin.topups')}</h1>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="pending">{t('balance.pending')}</option>
          <option value="approved">{t('balance.approved')}</option>
          <option value="rejected">{t('balance.rejected')}</option>
          <option value="">{t('admin.allStatuses')}</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.user')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.amount')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.currentBalance')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.status')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.requestedOn')}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center"><Loader size="md" /></td>
                </tr>
              ) : topups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                    {t('admin.noTopups')}
                  </td>
                </tr>
              ) : (
                topups.map(topup => (
                  <tr key={topup.id} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <p className="text-text-primary font-medium">{topup.user?.displayName || '-'}</p>
                      <p className="text-text-secondary text-sm">{topup.user?.email || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-text-primary font-semibold">
                      {topup.amount?.toLocaleString()} UZS
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {topup.user?.balance?.toLocaleString() ?? '-'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[topup.status] || 'default'}>
                        {t(`balance.${topup.status}`) || topup.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{formatDate(topup.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Button size="sm" onClick={() => { setSelected(topup); setNote(''); setError('') }}>
                        {t('admin.review')}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {topups.length > 0 && (
          <div className="px-6 py-4 border-t border-border flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              {t('common.previous')}
            </button>
            <span className="text-text-secondary text-sm">{t('common.page')} {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={topups.length < 20}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => { setSelected(null); setError('') }}
        title={`${t('admin.topups')} — ${selected?.amount?.toLocaleString() || ''} UZS`}
      >
        {selected && (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                {error}
              </div>
            )}

            <div className="p-3 bg-surface-hover rounded-lg">
              <p className="text-text-primary font-medium">{selected.user?.displayName || '-'}</p>
              <p className="text-text-secondary text-sm">{selected.user?.email || '-'}</p>
              <p className="text-text-secondary text-xs mt-1">
                {t('admin.currentBalance')}: {selected.user?.balance?.toLocaleString() ?? '-'} UZS
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">{t('admin.chequeTitle')}</h4>
              <ChequeImage
                chequePath={selected.chequePath}
                className="w-full max-h-96 object-contain rounded-lg border border-border"
              />
            </div>

            {selected.status === 'pending' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {t('admin.reviewNote')}
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="danger" fullWidth loading={actionLoading} onClick={() => handleReview(false)}>
                    {t('admin.reject')}
                  </Button>
                  <Button variant="primary" fullWidth loading={actionLoading} onClick={() => handleReview(true)}>
                    {t('admin.approve')}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
