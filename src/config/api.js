export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export const BACKEND_URL = API_BASE_URL.replace('/api', '')

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${BACKEND_URL}/${imagePath}`
}

export const ENDPOINTS = {
  // Auth
  AUTH_GOOGLE: '/v1/auth/google',
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
  CONVERSATION_START: '/v1/messages/conversations/start',
  CONVERSATION_BY_ID: (id) => `/v1/messages/conversations/${id}`,
  SEND_MESSAGE: '/v1/messages/send',
  MARK_READ: (conversationId) => `/v1/messages/read/${conversationId}`,

  // Admin
  ADMIN_LOGIN: '/v1/admin/login',
  ADMIN_USERS: '/v1/admin/users',
  ADMIN_USER_STATUS: (id) => `/v1/admin/users/${id}/status`,
  ADMIN_KYC_PENDING: '/v1/admin/kyc/pending',
  ADMIN_KYC_APPROVE: (id) => `/v1/admin/kyc/${id}/approve`,
  ADMIN_KYC_REJECT: (id) => `/v1/admin/kyc/${id}/reject`,
  ADMIN_POSTS: '/v1/admin/posts',
  ADMIN_POST_DELETE: (id) => `/v1/admin/posts/${id}`,
  ADMIN_STATS: '/v1/admin/stats',
  ADMIN_GAMES: '/v1/admin/games',
  ADMIN_GAME_CREATE: '/v1/admin/games',
  ADMIN_GAME_UPDATE: (id) => `/v1/admin/games/${id}`,
  ADMIN_GAME_DELETE: (id) => `/v1/admin/games/${id}`,
  ADMIN_USER_DETAIL: (id) => `/v1/admin/users/${id}`,
  ADMIN_LOGS: '/v1/admin/logs',
  ADMIN_SUBSCRIPTIONS: '/v1/admin/subscriptions',
  ADMIN_SUBSCRIPTION_STATS: '/v1/admin/subscriptions/stats',
  ADMIN_SUBSCRIPTION_GRANT: '/v1/admin/subscriptions/grant',
  ADMIN_SUBSCRIPTION_REVOKE: (id) => `/v1/admin/subscriptions/${id}/revoke`,
  ADMIN_TRANSACTIONS: '/v1/admin/transactions',
  ADMIN_REPORTS: '/v1/admin/reports',
  ADMIN_REPORT_STATS: '/v1/admin/reports/stats',
  ADMIN_REPORT_BY_ID: (id) => `/v1/admin/reports/${id}`,
  ADMIN_REPORT_STATUS: (id) => `/v1/admin/reports/${id}/status`,
  ADMIN_REPORT_RESOLVE: (id) => `/v1/admin/reports/${id}/resolve`,
  ADMIN_REPORT_DISMISS: (id) => `/v1/admin/reports/${id}/dismiss`,

  // Subscriptions
  SUBSCRIPTION_STATUS: '/v1/subscriptions/status',
  SUBSCRIPTION_INITIATE: '/v1/subscriptions/initiate',
  SUBSCRIPTION_HISTORY: '/v1/subscriptions/history',
  SUBSCRIPTION_CANCEL: '/v1/subscriptions/cancel',

  // Payments
  TRANSACTIONS: '/v1/payments/transactions',
  TRANSACTION_BY_ID: (id) => `/v1/payments/transactions/${id}`
}
