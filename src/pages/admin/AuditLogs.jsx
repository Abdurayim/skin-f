import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { adminFetch } from '../../utils/adminAuth'
import { formatDate } from '../../utils/formatters'

const ACTION_VARIANTS = {
  user_banned: 'error',
  user_unbanned: 'success',
  user_suspended: 'warning',
  user_deleted: 'error',
  user_warned: 'warning',
  kyc_approved: 'success',
  kyc_rejected: 'error',
  post_deleted: 'error',
  post_flagged: 'warning',
  subscription_granted: 'success',
  subscription_revoked: 'error',
  report_resolved: 'success',
  report_dismissed: 'default',
  admin_created: 'info',
  admin_updated: 'info',
  admin_deleted: 'error',
  game_created: 'success',
  game_updated: 'info',
  game_deleted: 'error',
  admin_login: 'info',
  admin_logout: 'default'
}

const ACTION_OPTIONS = [
  'user_banned',
  'user_suspended',
  'user_unbanned',
  'kyc_approved',
  'kyc_rejected',
  'post_deleted',
  'subscription_granted',
  'subscription_revoked',
  'report_resolved',
  'report_dismissed',
  'game_created',
  'game_updated',
  'admin_login'
]

export default function AuditLogs() {
  const { t } = useLanguage()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [page, actionFilter])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: '50' })
      if (actionFilter) params.append('action', actionFilter)
      const response = await adminFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_LOGS}?${params}`)
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        const list = data.data?.logs || data.data || []
        setLogs(Array.isArray(list) ? list : [])
      }
    } catch {
      // Logs fetch failed silently
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      {/* Filter */}
      <div className="mb-6">
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">{t('admin.allActions')}</option>
          {ACTION_OPTIONS.map(action => (
            <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.adminName')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.actionType')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.targetType')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.details')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.ipAddress')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">{t('admin.date')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader size="md" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                    {t('admin.noLogs')}
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log._id || log.id} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <p className="text-text-primary font-medium">
                        {log.adminId?.name || log.admin?.name || 'System'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={ACTION_VARIANTS[log.action] || 'default'}>
                        {(log.action || '-').replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {log.targetType || log.target?.type || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-text-secondary text-sm max-w-xs truncate">
                        {log.details || log.description || log.metadata?.reason || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm font-mono">
                      {log.ipAddress || log.ip || '-'}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {logs.length > 0 && (
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
              disabled={logs.length < 50}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
