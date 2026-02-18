import { API_BASE_URL, ENDPOINTS } from '../config/api'

let isRefreshing = false
let refreshPromise = null

async function refreshAdminToken() {
  if (isRefreshing) return refreshPromise

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem('admin_refresh_token')
      if (!refreshToken) return false

      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_REFRESH_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })

      const data = await response.json().catch(() => null)

      if (response.ok && data?.data?.tokens) {
        localStorage.setItem('admin_token', data.data.tokens.accessToken)
        localStorage.setItem('admin_refresh_token', data.data.tokens.refreshToken)
        return true
      }

      return false
    } catch {
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

function clearAdminSession() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_refresh_token')
  localStorage.removeItem('admin_info')
}

/**
 * Fetch wrapper for admin API calls.
 * Automatically refreshes the access token on 401 and retries once.
 * Redirects to /admin/login if refresh fails.
 */
export async function adminFetch(url, options = {}) {
  const token = localStorage.getItem('admin_token')
  const headers = {
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    const refreshed = await refreshAdminToken()
    if (refreshed) {
      const newToken = localStorage.getItem('admin_token')
      const retryHeaders = { ...headers, 'Authorization': `Bearer ${newToken}` }
      return fetch(url, { ...options, headers: retryHeaders })
    }

    clearAdminSession()
    window.location.href = '/admin/login'
    return response
  }

  return response
}
