import { createContext, useState, useEffect, useCallback } from 'react'
import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const AuthContext = createContext(null)

async function tryRefreshToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return false

  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_REFRESH_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })

    const result = await response.json().catch(() => null)

    if (response.ok && result?.data?.tokens) {
      localStorage.setItem('accessToken', result.data.tokens.accessToken)
      localStorage.setItem('refreshToken', result.data.tokens.refreshToken)
      return true
    }
  } catch {
    // Refresh request failed
  }

  return false
}

function clearAuthTokens() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async (isRetry = false) => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return null

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_ME}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json().catch(() => ({}))
        // Backend returns { success, message, data: { user: {...} } }
        const userData = result.data?.user || result.data || result
        setProfile(userData)
        setUser(userData)
        return userData
      }

      // On 401, attempt token refresh once
      if (response.status === 401 && !isRetry) {
        const refreshed = await tryRefreshToken()
        if (refreshed) {
          return fetchProfile(true)
        }
      }

      // Auth failed — clear stale tokens
      clearAuthTokens()
      setUser(null)
      setProfile(null)
    } catch {
      // Network error — don't clear tokens (might be temporary)
    }

    return null
  }, [])

  // On mount: check if we already have a valid token stored
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      fetchProfile().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [fetchProfile])

  /**
   * Google OAuth login — sends ID token to backend
   * @param {string} credential - Google ID token from GoogleLogin component
   * @returns {{ success: boolean, isNewUser?: boolean, error?: string }}
   */
  const loginWithGoogle = async (credential) => {
    setError(null)
    try {
      const lang = localStorage.getItem('skintrader_language') || 'en'
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_GOOGLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': lang
        },
        body: JSON.stringify({ idToken: credential })
      })

      const result = await response.json().catch(() => ({}))

      if (response.ok) {
        const userData = result.data?.user || result.data
        const tokens = result.data?.tokens || result.tokens

        // Store JWT tokens
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)

        setUser(userData)
        setProfile(userData)

        return { success: true, isNewUser: userData.isNewUser }
      }

      setError(result.message || 'Google authentication failed')
      return { success: false, error: result.message || 'Google authentication failed' }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_LOGOUT}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: localStorage.getItem('refreshToken')
          })
        })
      }
    } catch {
      // Logout API call failed, continue with local cleanup
    } finally {
      clearAuthTokens()
      setUser(null)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    await fetchProfile()
  }

  const value = {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isKYCVerified: profile?.kycStatus === 'verified',
    loginWithGoogle,
    logout,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
