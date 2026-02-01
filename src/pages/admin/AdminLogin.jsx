import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card'
import { useLanguage } from '../../hooks/useLanguage'
import { API_BASE_URL, ENDPOINTS } from '../../config/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // Backend returns: { data: { admin: {...}, tokens: {...} } }
        const tokens = data.data?.tokens || data.tokens
        const adminInfo = data.data?.admin || data.admin

        if (tokens?.accessToken) {
          localStorage.setItem('admin_token', tokens.accessToken)
          localStorage.setItem('admin_refresh_token', tokens.refreshToken)
          if (adminInfo) {
            localStorage.setItem('admin_info', JSON.stringify(adminInfo))
          }
          navigate('/admin/dashboard')
        } else {
          setError('Invalid response format from server')
        }
      } else {
        setError(data.message || t('errors.loginFailed'))
      }
    } catch (err) {
      setError(t('errors.networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md" padding="lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <CardTitle className="text-center">{t('admin.login')}</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert type="error" message={error} className="mb-4" />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Admin Email"
              placeholder="admin@skintrader.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Button type="submit" fullWidth loading={loading}>
              {t('nav.login')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
