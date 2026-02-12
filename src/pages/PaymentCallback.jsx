import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Button from '../components/common/Button'
import Card, { CardContent } from '../components/common/Card'
import { useApi } from '../hooks/useApi'
import { ENDPOINTS } from '../config/api'

export default function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { get } = useApi()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const error = searchParams.get('error')
    const statusParam = searchParams.get('status')

    if (error) {
      setStatus('error')
      return
    }

    if (statusParam === 'pending') {
      setStatus('pending')
      return
    }

    // Verify subscription status with backend instead of trusting URL params
    verifyWithBackend()
  }, [searchParams])

  const verifyWithBackend = async () => {
    try {
      const { data } = await get(ENDPOINTS.SUBSCRIPTION_STATUS)
      if (data?.data?.hasActiveSubscription) {
        setStatus('success')
      } else if (data?.data?.subscriptionStatus === 'pending') {
        setStatus('pending')
      } else {
        // Payment may still be processing via webhook — wait and retry once
        await new Promise(resolve => setTimeout(resolve, 3000))
        const { data: retryData } = await get(ENDPOINTS.SUBSCRIPTION_STATUS)
        if (retryData?.data?.hasActiveSubscription) {
          setStatus('success')
        } else {
          setStatus('pending')
        }
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-12">
        <Card>
          <CardContent>
            {status === 'loading' && (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-text-secondary">Verifying payment...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text mb-2">Payment Successful!</h2>
                <p className="text-text-secondary mb-6">
                  Your subscription has been activated.
                </p>
                <div className="space-x-3">
                  <Button onClick={() => navigate('/subscription')}>
                    View Subscription
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/')}>
                    Go Home
                  </Button>
                </div>
              </div>
            )}

            {status === 'pending' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text mb-2">Payment Processing</h2>
                <p className="text-text-secondary mb-6">
                  Your payment is being processed. This usually takes a few moments.
                </p>
                <div className="space-x-3">
                  <Button onClick={() => navigate('/subscription')}>
                    Check Status
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/')}>
                    Go Home
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text mb-2">Payment Failed</h2>
                <p className="text-text-secondary mb-6">
                  Something went wrong with your payment. Please try again.
                </p>
                <div className="space-x-3">
                  <Button onClick={() => navigate('/subscription')}>
                    Try Again
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/')}>
                    Go Home
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
