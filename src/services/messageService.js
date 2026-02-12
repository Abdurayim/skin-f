import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const messageService = {
  async getConversations(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONVERSATIONS}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  },

  async getConversation(id, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONVERSATION_BY_ID(id)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json().catch(() => ({}))
  },

  async startConversation(userId, postId, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONVERSATION_START}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, postId })
    })
    return response.json().catch(() => ({}))
  },

  async sendMessage(recipientId, content, postId, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_MESSAGE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipientId, content, postId })
    })
    return response.json().catch(() => ({}))
  }
}
