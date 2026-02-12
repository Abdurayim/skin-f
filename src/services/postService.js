import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const postService = {
  async getPosts(params = {}, token = null) {
    const queryString = new URLSearchParams(params).toString()
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.POSTS}?${queryString}`, {
      headers
    })
    return response.json().catch(() => ({}))
  },

  async getPost(id, token = null) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.POST_BY_ID(id)}`, {
      headers
    })
    return response.json().catch(() => ({}))
  },

  async getMyPosts(params = {}, token) {
    const queryString = new URLSearchParams(params).toString()

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.MY_POSTS}?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  },

  async createPost(formData, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.POSTS}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return response.json().catch(() => ({}))
  },

  async updatePost(id, formData, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.POST_BY_ID(id)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return response.json().catch(() => ({}))
  },

  async deletePost(id, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.POST_BY_ID(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  }
}
