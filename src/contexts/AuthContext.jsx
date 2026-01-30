import { createContext, useState, useEffect, useCallback } from 'react'
import { auth, sendOTP, verifyOTP, getIdToken } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return null

      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER_PROFILE}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const result = await response.json()
        console.log('[Auth] Profile response:', result)
        // Backend returns { success, message, data: { user: {...} } }
        const userData = result.data?.user || result.data || result
        console.log('[Auth] User data:', userData)
        setProfile(userData)
        return userData
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
    return null
  }, [])

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        await fetchProfile()
      } else {
        setUser(null)
        setProfile(null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [fetchProfile])

  const requestOTP = async (phoneNumber) => {
    setError(null)
    try {
      await sendOTP(phoneNumber)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const confirmOTP = async (otp) => {
    setError(null)
    try {
      const firebaseUser = await verifyOTP(otp)
      const firebaseToken = await firebaseUser.getIdToken()

      // Register/login with backend using verify-token endpoint
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_VERIFY_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebaseToken: firebaseToken
        })
      })

      if (response.ok) {
        const result = await response.json()
        const userData = result.data.user
        const tokens = result.data.tokens

        // Store tokens
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)

        setProfile(userData)
        return { success: true, isNewUser: userData.isNewUser }
      } else {
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.message || errorData?.error || `Backend returned ${response.status}`
        console.error('Backend auth error:', response.status, errorData)
        throw new Error(errorMessage)
      }
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
            'Authorization': `Bearer ${accessToken}`
          }
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      if (auth) {
        await signOut(auth)
      }
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
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
    requestOTP,
    confirmOTP,
    logout,
    refreshProfile,
    getIdToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
