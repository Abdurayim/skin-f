import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const authService = {
  async verifyToken(firebaseToken) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_VERIFY_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firebaseToken })
    })
    return response.json()
  },

  async logout(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_LOGOUT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async refreshToken(refreshToken) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_REFRESH_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })
    return response.json()
  }
}
