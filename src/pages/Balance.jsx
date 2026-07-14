import { useState, useEffect, useRef, useCallback } from 'react'
import Layout from '../components/layout/Layout'
import Button from '../components/common/Button'
import Alert from '../components/common/Alert'
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card'
import Badge from '../components/common/Badge'
import { useLanguage } from '../hooks/useLanguage'
import { useApi } from '../hooks/useApi'
import { ENDPOINTS } from '../config/api'
import { formatDate } from '../utils/formatters'

export default function Balance() {
  const { t } = useLanguage()
  const { get, post, loading } = useApi()
  const fileInputRef = useRef(null)

  const [balance, setBalance] = useState(null)
  const [cardNumber, setCardNumber] = useState('')
  const [history, setHistory] = useState([])
  const [amount, setAmount] = useState('')
  const [cheque, setCheque] = useState(null)
  const [chequePreview, setChequePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [copied, setCopied] = useState(false)

  const fetchBalance = useCallback(async () => {
    const { data } = await get(ENDPOINTS.BALANCE)
    if (data?.data) {
      setBalance(data.data.balance ?? 0)
      setCardNumber(data.data.cardNumber || '')
    }
  }, [get])

  const fetchHistory = useCallback(async () => {
    const { data } = await get(ENDPOINTS.BALANCE_TOPUPS)
    if (data?.data) {
      const list = data.data.topups || []
      setHistory(Array.isArray(list) ? list : [])
    }
  }, [get])

  useEffect(() => {
    fetchBalance()
    fetchHistory()
  }, [fetchBalance, fetchHistory])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — user can select manually
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File is too large. Maximum size is 10MB.' })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setCheque(file)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => setChequePreview(ev.target.result)
      reader.readAsDataURL(file)
    } else {
      setChequePreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    const amountNum = parseInt(amount, 10)
    if (!amountNum || amountNum < 2000) {
      setMessage({ type: 'error', text: `${t('balance.amount')}: min 2000` })
      return
    }
    if (!cheque) {
      setMessage({ type: 'error', text: t('balance.chequeDesc') })
      return
    }

    setSubmitting(true)
    const formData = new FormData()
    formData.append('amount', String(amountNum))
    formData.append('cheque', cheque)

    const { data, error } = await post(ENDPOINTS.BALANCE_TOPUP, formData)
    setSubmitting(false)

    if (data?.success) {
      setMessage({ type: 'success', text: t('balance.submitted') })
      setAmount('')
      setCheque(null)
      setChequePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchHistory()
    } else {
      setMessage({ type: 'error', text: error || data?.message || 'Failed to submit request' })
    }
  }

  const statusVariant = { pending: 'warning', approved: 'success', rejected: 'error' }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full glow-red" />
          {t('balance.title')}
        </h1>
        <p className="text-text-secondary mb-6">{t('balance.postCost')}</p>

        {message.text && (
          <Alert
            type={message.type}
            message={message.text}
            className="mb-4"
            onClose={() => setMessage({ type: '', text: '' })}
          />
        )}

        {/* Current balance */}
        <Card className="mb-6">
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <p className="text-text-secondary">{t('balance.current')}</p>
              <p className="text-3xl font-bold text-text-primary">
                {balance === null ? '…' : balance.toLocaleString()} <span className="text-base font-normal text-text-secondary">{t('balance.som')}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How to top up */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('balance.howTo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-text-secondary mb-6">
              {[t('balance.step1'), t('balance.step2'), t('balance.step3'), t('balance.step4')].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-semibold">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>

            {/* Card number */}
            <div className="bg-surface-hover border border-border rounded-xl p-4 mb-6">
              <p className="text-xs text-text-secondary mb-1">{t('balance.cardTitle')}</p>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xl sm:text-2xl font-mono font-bold text-text-primary tracking-wider">
                  {cardNumber || '…'}
                </p>
                <Button size="sm" variant="secondary" onClick={handleCopy}>
                  {copied ? t('balance.copied') : t('balance.copy')}
                </Button>
              </div>
            </div>

            {/* Top-up form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {t('balance.amount')} *
                </label>
                <input
                  type="number"
                  min="2000"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t('balance.amountPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {t('balance.cheque')} *
                </label>
                <p className="text-xs text-text-secondary mb-2">{t('balance.chequeDesc')}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer"
                />
                {chequePreview && (
                  <img src={chequePreview} alt="Cheque preview" className="mt-3 max-h-48 rounded-lg border border-border" />
                )}
              </div>

              <Button type="submit" glow loading={submitting || loading} disabled={!amount || !cheque}>
                {t('balance.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>{t('balance.history')}</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-text-secondary text-sm py-4 text-center">{t('balance.noHistory')}</p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-surface-hover rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {item.amount?.toLocaleString()} {t('balance.som')}
                      </p>
                      <p className="text-xs text-text-secondary">{formatDate(item.createdAt)}</p>
                      {item.status === 'rejected' && item.reviewNote && (
                        <p className="text-xs text-error mt-1">{item.reviewNote}</p>
                      )}
                    </div>
                    <Badge variant={statusVariant[item.status] || 'default'}>
                      {t(`balance.${item.status}`) || item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
