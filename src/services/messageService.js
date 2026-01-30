import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const messageService = {
  async getConversations(token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONVERSATIONS}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async getConversation(id, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONVERSATION_BY_ID(id)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async createConversation(postId, recipientId, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONVERSATIONS}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_id: postId,
        recipient_id: recipientId
      })
    })
    return response.json()
  },

  async getMessages(conversationId, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.MESSAGES(conversationId)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  async sendMessage(conversationId, content, token) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.MESSAGES(conversationId)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    })
    return response.json()
  }
}
