import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { formatDate } from '../../utils/formatters'

export default function Reports() {
  const { t } = useLanguage()
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [resolveForm, setResolveForm] = useState({ action: 'dismiss', notes: '' })
  const [dismissReason, setDismissReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [modalMode, setModalMode] = useState(null) // 'resolve' | 'dismiss'

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchReports()
  }, [page, statusFilter])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_REPORT_STATS}`, {
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

  const fetchReports = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const params = new URLSearchParams({ page })
      if (statusFilter) params.append('status', statusFilter)
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_REPORTS}?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        const list = data.data?.reports || data.data || []
        setReports(Array.isArray(list) ? list : [])
      }
    } catch {
      // Reports fetch failed silently
    } finally {
      setLoading(false)
    }
  }

  const handleOpenResolve = (report) => {
    setSelectedReport(report)
    setResolveForm({ action: 'dismiss', notes: '' })
    setModalMode('resolve')
  }

  const handleOpenDismiss = (report) => {
    setSelectedReport(report)
    setDismissReason('')
    setModalMode('dismiss')
  }

  const handleResolve = async () => {
    if (!selectedReport) return
    const reportId = selectedReport._id || selectedReport.id
    setActionLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_REPORT_RESOLVE(reportId)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: resolveForm.action, notes: resolveForm.notes })
      })
      if (response.ok) {
        setSelectedReport(null)
        setModalMode(null)
        fetchReports()
        fetchStats()
      }
    } catch {
      // Resolve failed silently
    } finally {
      setActionLoading(false)
    }
  }

  const handleDismiss = async () => {
    if (!selectedReport) return
    const reportId = selectedReport._id || selectedReport.id
    setActionLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_REPORT_DISMISS(reportId)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: dismissReason })
      })
      if (response.ok) {
        setSelectedReport(null)
        setModalMode(null)
        fetchReports()
        fetchStats()
      }
    } catch {
      // Dismiss failed silently
    } finally {
      setActionLoading(false)
    }
  }

  const statusVariants = {
    pending: 'warning',
    under_review: 'info',
    resolved: 'success',
    dismissed: 'default'
  }

  const priorityVariants = {
    low: 'default',
    medium: 'warning',
    high: 'error',
    critical: 'error'
  }

  const categoryVariants = {
    scam: 'error',
    fake_item: 'error',
    inappropriate_content: 'warning',
    duplicate_post: 'default',
    incorrect_pricing: 'warning',
    harassment: 'error',
    spam: 'warning',
    fraud: 'error',
    impersonation: 'error',
    offensive_profile: 'warning',
    other: 'default'
  }

  const statCards = [
    { label: t('admin.pendingReports'), value: stats?.pending || stats?.pendingCount || 0, variant: 'warning' },
    { label: t('admin.underReview'), value: stats?.underReview || stats?.under_review || stats?.underReviewCount || 0, variant: 'info' },
    { label: t('admin.resolved'), value: stats?.resolved || stats?.resolvedCount || 0, variant: 'success' },
    { label: t('admin.dismissed'), value: stats?.dismissed || stats?.dismissedCount || 0, variant: 'default' }
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

      {/* Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">{t('admin.allStatuses')}</option>
          <option value="pending">{t('admin.pendingReports')}</option>
          <option value="under_review">{t('admin.underReview')}</option>
          <option value="resolved">{t('admin.resolved')}</option>
          <option value="dismissed">{t('admin.dismissed')}</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.reporter')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.reportType')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.category')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.priority')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.status')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.date')}</th>
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
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-secondary">
                    {t('admin.noReports')}
                  </td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report._id || report.id} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <p className="text-text-primary font-medium">
                        {report.reporterId?.displayName || report.reporter?.displayName || t('common.user')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="info">{report.type || '-'}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={categoryVariants[report.category] || 'default'}>
                        {report.category || '-'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={priorityVariants[report.priority] || 'default'}>
                        {report.priority || '-'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[report.status] || 'default'}>
                        {report.status || '-'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {(report.status === 'pending' || report.status === 'under_review') && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenResolve(report)}
                            className="p-2 rounded-lg text-success hover:bg-success/10 transition-colors"
                            title={t('admin.resolveReport')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenDismiss(report)}
                            className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors"
                            title={t('admin.dismissReport')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {reports.length > 0 && (
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
              disabled={reports.length < 20}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      <Modal
        isOpen={modalMode === 'resolve' && !!selectedReport}
        onClose={() => { setSelectedReport(null); setModalMode(null) }}
        title={t('admin.resolveReport')}
      >
        {selectedReport && modalMode === 'resolve' && (
          <div className="space-y-4">
            <div className="p-4 bg-surface-hover rounded-lg space-y-2">
              <div className="flex gap-2">
                <Badge variant="info">{selectedReport.type}</Badge>
                <Badge variant={categoryVariants[selectedReport.category] || 'default'}>{selectedReport.category}</Badge>
                <Badge variant={priorityVariants[selectedReport.priority] || 'default'}>{selectedReport.priority}</Badge>
              </div>
              {selectedReport.description && (
                <p className="text-text-secondary text-sm">{selectedReport.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t('admin.action')} *
              </label>
              <select
                value={resolveForm.action}
                onChange={(e) => setResolveForm({ ...resolveForm, action: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="dismiss">Dismiss</option>
                <option value="delete_post">Delete Post</option>
                <option value="warn_user">Warn User</option>
                <option value="suspend_user">Suspend User</option>
                <option value="ban_user">Ban User</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t('admin.notes')}
              </label>
              <textarea
                value={resolveForm.notes}
                onChange={(e) => setResolveForm({ ...resolveForm, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" fullWidth onClick={() => { setSelectedReport(null); setModalMode(null) }}>
                {t('common.cancel')}
              </Button>
              <Button variant="primary" fullWidth loading={actionLoading} onClick={handleResolve}>
                {t('admin.resolveReport')}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Dismiss Modal */}
      <Modal
        isOpen={modalMode === 'dismiss' && !!selectedReport}
        onClose={() => { setSelectedReport(null); setModalMode(null) }}
        title={t('admin.dismissReport')}
      >
        {selectedReport && modalMode === 'dismiss' && (
          <div className="space-y-4">
            <div className="p-4 bg-surface-hover rounded-lg">
              <div className="flex gap-2 mb-2">
                <Badge variant="info">{selectedReport.type}</Badge>
                <Badge variant={categoryVariants[selectedReport.category] || 'default'}>{selectedReport.category}</Badge>
              </div>
              {selectedReport.description && (
                <p className="text-text-secondary text-sm">{selectedReport.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t('admin.reason')}
              </label>
              <textarea
                value={dismissReason}
                onChange={(e) => setDismissReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" fullWidth onClick={() => { setSelectedReport(null); setModalMode(null) }}>
                {t('common.cancel')}
              </Button>
              <Button variant="danger" fullWidth loading={actionLoading} onClick={handleDismiss}>
                {t('admin.dismissReport')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
