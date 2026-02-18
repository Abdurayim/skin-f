import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { adminFetch } from '../../utils/adminAuth'
import { formatDate } from '../../utils/formatters'

export default function Users() {
  const { t } = useLanguage()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [statusForm, setStatusForm] = useState({ status: 'active', reason: '' })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await adminFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_USERS}?page=${page}`)
        const data = await response.json().catch(() => ({}))
        if (response.ok) {
          const list = data.data?.users || data.data || []
          setUsers(Array.isArray(list) ? list : [])
        }
      } catch {
        // Users fetch failed silently
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [page])

  const handleOpenManage = (user) => {
    setSelectedUser(user)
    setStatusForm({ status: user.status || 'active', reason: '' })
  }

  const handleUpdateStatus = async () => {
    if (!selectedUser) return
    const userId = selectedUser._id || selectedUser.id
    if (statusForm.status !== 'active' && !statusForm.reason.trim()) return

    setActionLoading(true)
    try {
      const response = await adminFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_USER_STATUS(userId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: statusForm.status, reason: statusForm.reason })
      })

      if (response.ok) {
        setUsers(users.map(u =>
          (u._id || u.id) === userId
            ? { ...u, status: statusForm.status, statusReason: statusForm.reason }
            : u
        ))
        setSelectedUser(null)
      }
    } catch {
      // Status update failed silently
    } finally {
      setActionLoading(false)
    }
  }

  const kycStatusVariants = {
    pending: 'warning',
    verified: 'success',
    rejected: 'error',
    not_submitted: 'default'
  }

  const userStatusVariants = {
    active: 'success',
    suspended: 'warning',
    banned: 'error'
  }

  return (
    <AdminLayout>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.user')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.email')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.userStatus')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.kycStatus')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.posts')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('admin.joined')}
                </th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-secondary">
                    {t('admin.noUsers')}
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id || user.id} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-medium">
                              {user.displayName?.[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">
                            {user.displayName || t('common.user')}
                          </p>
                          <p className="text-text-secondary text-sm">{user.email || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={userStatusVariants[user.status || 'active']}>
                        {t(`admin.status${(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}`)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={kycStatusVariants[user.kycStatus || 'none']}>
                        {t(`kyc.status.${user.kycStatus || 'none'}`)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {user.postsCount || 0}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenManage(user)}
                        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {users.length > 0 && (
          <div className="px-6 py-4 border-t border-border flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              {t('common.previous')}
            </button>
            <span className="text-text-secondary text-sm">
              {t('common.page')} {page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={users.length < 20}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50"
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={t('admin.manageUser')}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-surface-hover rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-bold">
                    {selectedUser.displayName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-text-primary font-medium">{selectedUser.displayName || t('common.user')}</p>
                  <p className="text-text-secondary text-sm">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t('admin.userStatus')}
              </label>
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="active">{t('admin.statusActive')}</option>
                <option value="suspended">{t('admin.statusSuspended')}</option>
                <option value="banned">{t('admin.statusBanned')}</option>
              </select>
            </div>

            {statusForm.status !== 'active' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {t('admin.reason')}
                </label>
                <textarea
                  value={statusForm.reason}
                  onChange={(e) => setStatusForm({ ...statusForm, reason: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder={t('admin.reasonRequired')}
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setSelectedUser(null)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant={statusForm.status === 'banned' ? 'danger' : statusForm.status === 'suspended' ? 'secondary' : 'success'}
                fullWidth
                loading={actionLoading}
                onClick={handleUpdateStatus}
                disabled={statusForm.status !== 'active' && !statusForm.reason.trim()}
              >
                {t('admin.updateStatus')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
