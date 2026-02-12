import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Button from '../components/common/Button'
import Alert from '../components/common/Alert'
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'
import Badge from '../components/common/Badge'
import { useApi } from '../hooks/useApi'
import { ENDPOINTS } from '../config/api'

export default function Subscription() {
  const navigate = useNavigate()
  const { get, post, loading } = useApi()

  const [status, setStatus] = useState(null)
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState({ type: '', text: '' })
  const [initiating, setInitiating] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchStatus()
    fetchHistory()
  }, [])

  const fetchStatus = async () => {
    const { data, error } = await get(ENDPOINTS.SUBSCRIPTION_STATUS)
    if (data?.data) {
      setStatus(data.data)
    } else if (error) {
      setMessage({ type: 'error', text: error })
    }
  }

  const fetchHistory = async () => {
    const { data } = await get(ENDPOINTS.SUBSCRIPTION_HISTORY)
    if (data?.data) {
      setHistory(Array.isArray(data.data) ? data.data : data.data.subscriptions || [])
    }
  }

  const handleSubscribe = async () => {
    setInitiating(true)
    const { data, error } = await post(ENDPOINTS.SUBSCRIPTION_INITIATE, { currency: 'UZS' })
    setInitiating(false)

    if (data?.data?.paymentUrl) {
      window.location.href = data.data.paymentUrl
    } else if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Subscription initiated successfully!' })
      fetchStatus()
    }
  }

  const handleCancel = async () => {
    setCancelling(true)
    const { data, error } = await post(ENDPOINTS.SUBSCRIPTION_CANCEL)
    setCancelling(false)

    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Auto-renewal cancelled.' })
      fetchStatus()
    }
  }

  const getStatusBadge = (sub) => {
    if (!sub) return null
    const map = {
      active: 'success',
      expired: 'error',
      cancelled: 'warning',
      pending: 'info'
    }
    return <Badge variant={map[sub.status] || 'default'}>{sub.status}</Badge>
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-6">Subscription</h1>

        {message.text && (
          <Alert
            type={message.type}
            message={message.text}
            className="mb-4"
            onClose={() => setMessage({ type: '', text: '' })}
          />
        )}

        {/* Current Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !status ? (
              <p className="text-text-secondary">Loading...</p>
            ) : status?.hasActiveSubscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-text">Premium Subscription</p>
                    <p className="text-text-secondary text-sm">
                      Expires: {formatDate(status.subscriptionExpiresAt || status.subscription?.endDate)}
                    </p>
                    {status.subscription?.daysRemaining != null && (
                      <p className="text-text-secondary text-xs">
                        {status.subscription.daysRemaining} days remaining
                      </p>
                    )}
                  </div>
                  {getStatusBadge({ status: status.subscriptionStatus })}
                </div>
                {status.subscription?.autoRenew && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleCancel}
                    loading={cancelling}
                  >
                    Cancel Auto-Renewal
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mb-4">
                  <svg className="mx-auto w-16 h-16 text-primary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <p className="text-text-secondary mb-4">
                  {status?.subscriptionStatus === 'expired' || status?.subscriptionStatus === 'grace_period'
                    ? 'Your subscription has expired.'
                    : 'You don\'t have an active subscription.'}
                </p>
                <Button onClick={handleSubscribe} loading={initiating}>
                  Subscribe Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-text">
                        {formatDate(item.startDate)} — {formatDate(item.endDate)}
                      </p>
                      {item.amount && (
                        <p className="text-xs text-text-secondary">
                          {item.amount.toLocaleString()} UZS
                        </p>
                      )}
                    </div>
                    {getStatusBadge(item)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
