import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Card, { CardTitle } from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'

export default function Dashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_STATS}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const result = await response.json().catch(() => ({}))
        if (response.ok) {
          setStats(result.data?.stats || result.data || result)
        }
      } catch {
        // Stats fetch failed silently
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader size="lg" />
          <p className="text-text-secondary mt-4">Loading dashboard...</p>
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    {
      title: t('admin.totalUsers'),
      value: stats?.users?.total || 0,
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      color: 'blue',
      trend: null
    },
    {
      title: t('admin.totalPosts'),
      value: stats?.posts?.total || 0,
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      color: 'green',
      trend: null
    },
    {
      title: t('admin.pendingKyc'),
      value: stats?.users?.pendingKyc || 0,
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      color: 'warning',
      trend: null
    },
    {
      title: t('admin.activePosts'),
      value: stats?.posts?.active || 0,
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      color: 'primary',
      trend: null
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    green: 'bg-green-500/10 text-green-400 ring-green-500/20',
    warning: 'bg-warning/10 text-warning ring-warning/20',
    primary: 'bg-primary/10 text-primary ring-primary/20'
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full glow-red" />
          Dashboard
        </h1>
        <p className="text-text-secondary mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 animate-fade-in-up group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ring-1 ${colorClasses[stat.color]}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              {stat.trend && (
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-lg">
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-text-secondary text-sm mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-text-primary group-hover:text-primary transition-colors">
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {t('admin.recentUsers')}
            </h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>

          {stats?.recentUsers?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentUsers.map((user, i) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-3 bg-surface-hover rounded-xl hover:bg-primary/5 transition-colors"
                  style={{ animationDelay: `${(i + 5) * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-primary font-bold">
                        {user.displayName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-medium truncate">{user.displayName || t('common.user')}</p>
                    <p className="text-text-secondary text-sm truncate">{user.email}</p>
                  </div>
                  <div className="text-xs text-text-secondary">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-text-secondary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-text-secondary text-sm">{t('admin.noRecentUsers')}</p>
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t('admin.recentPosts')}
            </h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>

          {stats?.recentPosts?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPosts.map((post, i) => (
                <div
                  key={post._id}
                  className="flex items-center gap-3 p-3 bg-surface-hover rounded-xl hover:bg-primary/5 transition-colors"
                  style={{ animationDelay: `${(i + 5) * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    {post.images?.[0] ? (
                      <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-medium truncate">{post.title}</p>
                    <p className="text-primary text-sm font-semibold">${post.price}</p>
                  </div>
                  <span className={`
                    text-xs px-2 py-1 rounded-lg font-medium
                    ${post.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
                  `}>
                    {post.status || 'active'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-text-secondary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-text-secondary text-sm">{t('admin.noRecentPosts')}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
