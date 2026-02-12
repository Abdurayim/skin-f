import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { formatDate } from '../../utils/formatters'

export default function Subscriptions() {
  const { t } = useLanguage()
  const [subscriptions, setSubscriptions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [showGrantModal, setShowGrantModal] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState(null)
  const [grantForm, setGrantForm] = useState({ userId: '', durationDays: 30 })
  const [revokeReason, setRevokeReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchSubscriptions()
  }, [page, statusFilter])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_SUBSCRIPTION_STATS}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        setStats(data.data || data)
      }
    } catch {
      // Stats fetch failed silently
    }
  }

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams({ page })
      if (statusFilter) params.append('status', statusFilter)
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_SUBSCRIPTIONS}?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        const list = data.data?.subscriptions || data.data || []
        setSubscriptions(Array.isArray(list) ? list : [])
      }
    } catch {
      // Subscriptions fetch failed silently
    } finally {
      setLoading(false)
    }
  }

  const handleGrant = async () => {
    if (!grantForm.userId.trim()) return
    setActionLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_SUBSCRIPTION_GRANT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: grantForm.userId.trim(),
          durationDays: parseInt(grantForm.durationDays) || 30
        })
      })
      if (response.ok) {
        setShowGrantModal(false)
        setGrantForm({ userId: '', durationDays: 30 })
        fetchSubscriptions()
        fetchStats()
      }
    } catch {
      // Grant failed silently
    } finally {
      setActionLoading(false)
    }
  }

  const handleRevoke = async () => {
    if (!revokeTarget) return
    const subId = revokeTarget._id || revokeTarget.id
    setActionLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_SUBSCRIPTION_REVOKE(subId)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: revokeReason })
      })
      if (response.ok) {
        setRevokeTarget(null)
        setRevokeReason('')
        fetchSubscriptions()
        fetchStats()
      }
    } catch {
      // Revoke failed silently
    } finally {
      setActionLoading(false)
    }
  }

  const statusVariants = {
    active: 'success',
    expired: 'error',
    grace_period: 'warning',
    pending: 'info',
    cancelled: 'default',
    none: 'default'
  }

  const statCards = [
    { label: t('admin.activeSubscriptions'), value: stats?.active || stats?.activeCount || 0, variant: 'success' },
    { label: t('admin.expiredSubscriptions'), value: stats?.expired || stats?.expiredCount || 0, variant: 'error' },
    { label: t('admin.gracePeriod'), value: stats?.gracePeriod || stats?.gracePeriodCount || 0, variant: 'warning' },
    { label: t('admin.newSubscriptions'), value: stats?.new || stats?.newCount || stats?.pending || 0, variant: 'info' }
  ]

  return (
    <AdminLayout>
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4">
            <p className="text-text-secondary text-sm">{card.label}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">{t('admin.allStatuses')}</option>
          <option value="active">{t('admin.activeSubscriptions')}</option>
          <option value="expired">{t('admin.expiredSubscriptions')}</option>
          <option value="grace_period">{t('admin.gracePeriod')}</option>
          <option value="pending">{t('admin.pendingReports')}</option>
        </select>
        <Button onClick={() => setShowGrantModal(true)}>
          {t('admin.grantSubscription')}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.user')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.plan')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.status')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.startDate')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.endDate')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.autoRenew')}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader size="md" />
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-secondary">
                    {t('admin.noSubscriptions')}
                  </td>
                </tr>
              ) : (
                subscriptions.map(sub => (
                  <tr key={sub._id || sub.id} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <p className="text-text-primary font-medium">
                        {sub.userId?.displayName || sub.user?.displayName || t('common.user')}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {sub.userId?.email || sub.user?.email || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary">{sub.plan || 'monthly'}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[sub.status] || 'default'}>
                        {sub.status || '-'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {formatDate(sub.startDate || sub.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {formatDate(sub.endDate || sub.expiresAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={sub.autoRenew ? 'success' : 'default'} size="sm">
                        {sub.autoRenew ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {sub.status === 'active' && (
                        <button
                          onClick={() => { setRevokeTarget(sub); setRevokeReason('') }}
                          className="p-2 rounded-lg text-error hover:bg-error/10 transition-colors"
                          title={t('admin.revoke')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {subscriptions.length > 0 && (
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
              disabled={subscriptions.length < 20}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>

      {/* Grant Modal */}
      <Modal
        isOpen={showGrantModal}
        onClose={() => setShowGrantModal(false)}
        title={t('admin.grantSubscription')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('admin.userId')} *
            </label>
            <input
              type="text"
              value={grantForm.userId}
              onChange={(e) => setGrantForm({ ...grantForm, userId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="MongoDB ObjectId"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t('admin.durationDays')}
            </label>
            <input
              type="number"
              value={grantForm.durationDays}
              onChange={(e) => setGrantForm({ ...grantForm, durationDays: e.target.value })}
              min={1}
              max={365}
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setShowGrantModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={actionLoading}
              onClick={handleGrant}
              disabled={!grantForm.userId.trim()}
            >
              {t('admin.grant')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Revoke Modal */}
      <Modal
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        title={t('admin.revokeSubscription')}
      >
        {revokeTarget && (
          <div className="space-y-4">
            <div className="p-4 bg-surface-hover rounded-lg">
              <p className="text-text-primary font-medium">
                {revokeTarget.userId?.displayName || revokeTarget.user?.displayName || t('common.user')}
              </p>
              <p className="text-text-secondary text-sm">
                {revokeTarget.userId?.email || revokeTarget.user?.email || '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t('admin.reason')}
              </label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setRevokeTarget(null)}>
                {t('common.cancel')}
              </Button>
              <Button variant="danger" fullWidth loading={actionLoading} onClick={handleRevoke}>
                {t('admin.revoke')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
