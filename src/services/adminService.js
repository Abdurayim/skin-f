import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const adminService = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    return response.json().catch(() => ({}))
  },

  async getStats(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_STATS}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  },

  async getUsers(params = {}, token) {
    const queryString = new URLSearchParams(params).toString()

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_USERS}?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  },

  async getKYCRequests(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_KYC_PENDING}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  },

  async approveKYC(id, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_KYC_APPROVE(id)}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  },

  async rejectKYC(id, reason, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_KYC_REJECT(id)}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    })
    return response.json().catch(() => ({}))
  },

  async getPosts(params = {}, token) {
    const queryString = new URLSearchParams(params).toString()

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_POSTS}?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  },

  async deletePost(id, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_POST_DELETE(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  }
}
