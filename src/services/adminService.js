import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const adminService = {
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    return response.json()
  },

  async getStats(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_STATS}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async getUsers(params = {}, token) {
    const queryString = new URLSearchParams(params).toString()

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_USERS}?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async getKYCRequests(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_KYC}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async reviewKYC(id, status, rejectionReason, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_KYC_REVIEW(id)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        rejection_reason: rejectionReason
      })
    })
    return response.json()
  },

  async getPosts(params = {}, token) {
    const queryString = new URLSearchParams(params).toString()

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_POSTS}?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async removePost(id, token) {
    const response = await fetch(`${API_BASE_URL}/admin/posts/${id}/remove`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async restorePost(id, token) {
    const response = await fetch(`${API_BASE_URL}/admin/posts/${id}/restore`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  }
}
