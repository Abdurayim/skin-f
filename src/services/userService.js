import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const userService = {
  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER_PROFILE}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async updateProfile(data, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER_UPDATE_PROFILE}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  async getUser(id, token = null) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER_BY_ID(id)}`, {
      headers
    })
    return response.json()
  },

  async uploadKYCDocument(formData, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.KYC_UPLOAD}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return response.json()
  },

  async verifyKYC(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.KYC_VERIFY}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async getKYCStatus(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.KYC_STATUS}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  }
}
