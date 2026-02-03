export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://targetschool.uz:8001/api'
export const BACKEND_URL = API_BASE_URL.replace('/api', '')

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${BACKEND_URL}/${imagePath}`
}

export const ENDPOINTS = {
  // Auth
  AUTH_VERIFY_TOKEN: '/v1/auth/verify-token',
  AUTH_REFRESH_TOKEN: '/v1/auth/refresh-token',
  AUTH_LOGOUT: '/v1/auth/logout',
  AUTH_LOGOUT_ALL: '/v1/auth/logout-all',
  AUTH_ME: '/v1/auth/me',

  // Users
  USERS: '/v1/users',
  USER_PROFILE: '/v1/auth/me',
  USER_UPDATE_PROFILE: '/v1/users/profile',
  USER_UPDATE_AVATAR: '/v1/users/profile/avatar',
  USER_UPDATE_LOCATION: '/v1/users/location',
  USER_NEARBY: '/v1/users/nearby',
  USER_DELETE_ACCOUNT: '/v1/users/account',
  USER_BY_ID: (id) => `/v1/users/${id}`,
  USER_POSTS: (id) => `/v1/users/${id}/posts`,

  // KYC
  KYC_UPLOAD: '/v1/auth/kyc/upload',
  KYC_VERIFY: '/v1/auth/kyc/verify',
  KYC_STATUS: '/v1/auth/kyc/status',

  // Posts
  POSTS: '/v1/posts',
  POST_BY_ID: (id) => `/v1/posts/${id}`,
  MY_POSTS: '/v1/posts/my',
  POST_CREATE: '/v1/posts',
  POST_UPDATE: (id) => `/v1/posts/${id}`,
  POST_DELETE: (id) => `/v1/posts/${id}`,
  POST_UPDATE_STATUS: (id) => `/v1/posts/${id}/status`,

  // Games
  GAMES: '/v1/games',
  GAME_BY_ID: (id) => `/v1/games/${id}`,

  // Messages
  CONVERSATIONS: '/v1/messages/conversations',
  CONVERSATION_BY_ID: (id) => `/v1/messages/conversations/${id}`,
  MESSAGES: (conversationId) => `/v1/messages/conversations/${conversationId}/messages`,
  SEND_MESSAGE: '/v1/messages',

  // Admin
  ADMIN_LOGIN: '/v1/admin/login',
  ADMIN_USERS: '/v1/admin/users',
  ADMIN_USER_STATUS: (id) => `/v1/admin/users/${id}/status`,
  ADMIN_KYC: '/v1/admin/kyc',
  ADMIN_KYC_REVIEW: (id) => `/v1/admin/kyc/${id}/review`,
  ADMIN_POSTS: '/v1/admin/posts',
  ADMIN_POST_DELETE: (id) => `/v1/admin/posts/${id}`,
  ADMIN_STATS: '/v1/admin/stats',
  ADMIN_GAMES: '/v1/admin/games',
  ADMIN_GAME_CREATE: '/v1/admin/games',
  ADMIN_GAME_UPDATE: (id) => `/v1/admin/games/${id}`,
  ADMIN_GAME_DELETE: (id) => `/v1/admin/games/${id}`
}
