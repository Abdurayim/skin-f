import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useApi } from '../../hooks/useApi'
import { ENDPOINTS } from '../../config/api'
import { formatDate } from '../../utils/formatters'

/**
 * Renders a notification's message in the current language.
 * The backend stores only { type, data } — templates live in i18n.
 */
function notificationText(t, n) {
  const data = n.data || {}
  const params = {
    amount: typeof data.amount === 'number' ? data.amount.toLocaleString() : data.amount || '',
    cost: typeof data.cost === 'number' ? data.cost.toLocaleString() : data.cost || '',
    title: data.title || '',
    reason: data.reason || '',
  }
  const text = t(`notifications.${n.type}`, params)
  // Unknown type — fall back to the raw type name
  return text === `notifications.${n.type}` ? n.type.replace(/_/g, ' ') : text
}

const TYPE_ICONS = {
  topup_approved: { color: 'text-success', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  topup_rejected: { color: 'text-error', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  kyc_approved: { color: 'text-success', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  kyc_rejected: { color: 'text-error', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  post_published: { color: 'text-primary', d: 'M5 13l4 4L19 7' },
  post_removed: { color: 'text-warning', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
}

export default function NotificationBell() {
  const { t } = useLanguage()
  const { get, patch } = useApi()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const panelRef = useRef(null)

  const fetchNotifications = useCallback(async () => {
    const { data } = await get(`${ENDPOINTS.NOTIFICATIONS}?limit=15`)
    if (data?.data) {
      setNotifications(Array.isArray(data.data.notifications) ? data.data.notifications : [])
      setUnread(data.data.unreadCount || 0)
    }
  }, [get])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const handleOpen = () => {
    setOpen((o) => !o)
    if (!open) fetchNotifications()
  }

  const handleItemClick = async (n) => {
    if (!n.read) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
      setUnread((u) => Math.max(0, u - 1))
      await patch(ENDPOINTS.NOTIFICATION_READ(n.id))
    }
  }

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((x) => ({ ...x, read: true })))
    setUnread(0)
    await patch(ENDPOINTS.NOTIFICATIONS_READ_ALL)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-xl hover:bg-surface transition-colors"
        aria-label={t('notifications.title')}
      >
        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[70vh] overflow-y-auto bg-surface border border-border rounded-2xl shadow-xl z-50 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-surface">
            <h3 className="font-semibold text-text-primary text-sm">{t('notifications.title')}</h3>
            {unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary hover:underline"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-text-secondary text-sm">
              {t('notifications.empty')}
            </p>
          ) : (
            <ul>
              {notifications.map((n) => {
                const icon = TYPE_ICONS[n.type] || TYPE_ICONS.post_published
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => handleItemClick(n)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-border last:border-0 hover:bg-surface-hover transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                    >
                      <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${icon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.d} />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${!n.read ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                          {notificationText(t, n)}
                        </p>
                        {n.data?.reason && (
                          <p className="text-xs text-error mt-0.5">{n.data.reason}</p>
                        )}
                        <p className="text-xs text-text-secondary mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
