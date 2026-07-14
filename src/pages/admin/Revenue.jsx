import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'
import { adminFetch } from '../../utils/adminAuth'
import { formatDate } from '../../utils/formatters'

function som(n) {
  return `${(n ?? 0).toLocaleString()} UZS`
}

export default function Revenue() {
  const { t } = useLanguage()
  const [revenue, setRevenue] = useState(null)
  const [recentTopups, setRecentTopups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await adminFetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_REVENUE}`)
        const data = await response.json().catch(() => ({}))
        if (response.ok && data.data) {
          setRevenue(data.data.revenue || null)
          setRecentTopups(Array.isArray(data.data.recentTopups) ? data.data.recentTopups : [])
        }
      } catch {
        // fetch failed silently
      } finally {
        setLoading(false)
      }
    }
    fetchRevenue()
  }, [])

  const cards = revenue ? [
    { label: t('admin.totalRevenue'), value: som(revenue.totalApproved), sub: `${revenue.approvedCount} ${t('admin.approvedRequests')}`, accent: 'border-success/40' },
    { label: t('admin.monthRevenue'), value: som(revenue.monthApproved), accent: 'border-primary/40' },
    { label: t('admin.todayRevenue'), value: som(revenue.todayApproved), accent: 'border-primary/40' },
    { label: t('admin.pendingRevenue'), value: som(revenue.pendingAmount), sub: `${revenue.pendingCount}`, accent: 'border-warning/40' },
    { label: t('admin.outstandingBalance'), value: som(revenue.outstandingBalance), accent: 'border-border' },
    { label: t('admin.consumedRevenue'), value: som(revenue.consumedRevenue), accent: 'border-border' },
  ] : []

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold text-text-primary mb-6">{t('admin.revenue')}</h1>

      {loading ? (
        <div className="flex justify-center py-16"><Loader size="lg" /></div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {cards.map((card, i) => (
              <div key={i} className={`bg-surface border ${card.accent} rounded-xl p-5`}>
                <p className="text-text-secondary text-sm">{card.label}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{card.value}</p>
                {card.sub && <p className="text-xs text-text-secondary mt-1">{card.sub}</p>}
              </div>
            ))}
          </div>

          {/* Recent verified top-ups */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-text-primary">{t('admin.recentTopups')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">{t('admin.user')}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">{t('admin.amount')}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">{t('admin.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTopups.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-text-secondary">
                        {t('admin.noTopups')}
                      </td>
                    </tr>
                  ) : (
                    recentTopups.map((topup) => (
                      <tr key={topup.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                        <td className="px-6 py-3">
                          <p className="text-text-primary text-sm font-medium">{topup.user?.displayName || '-'}</p>
                          <p className="text-text-secondary text-xs">{topup.user?.email || '-'}</p>
                        </td>
                        <td className="px-6 py-3 text-success font-semibold text-sm">+{som(topup.amount)}</td>
                        <td className="px-6 py-3 text-text-secondary text-sm">{formatDate(topup.reviewedAt || topup.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
