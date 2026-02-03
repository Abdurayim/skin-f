import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { formatDate } from '../../utils/formatters'

export default function Users() {
  const { t } = useLanguage()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('admin_token')
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_USERS}?page=${page}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        if (response.ok) {
          setUsers(data.users || data)
        }
      } catch {
        // Users fetch failed silently
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [page])

  const kycStatusVariants = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    none: 'default'
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
                  {t('admin.phone')}
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader size="md" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                    {t('admin.noUsers')}
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-medium">
                              {user.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">
                            {user.name || t('common.user')}
                          </p>
                          <p className="text-text-secondary text-sm">{user.email || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={kycStatusVariants[user.kyc_status || 'none']}>
                        {t(`kyc.status.${user.kyc_status || 'none'}`)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {user.posts_count || 0}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {formatDate(user.createdAt)}
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
    </AdminLayout>
  )
}
