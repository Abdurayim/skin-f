import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const authService = {
  async logout(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_LOGOUT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  },

  async refreshToken(refreshToken) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_REFRESH_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })
    return response.json().catch(() => ({}))
  }
}
