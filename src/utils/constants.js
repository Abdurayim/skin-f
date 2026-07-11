export const POST_TYPES = [
  { value: 'skin', label: 'Skin' },
  { value: 'profile', label: 'Profile' }
]

export const CURRENCIES = [
  { value: 'UZS', label: 'UZS', symbol: 'UZS' },
  { value: 'USD', label: 'USD ($)', symbol: '$' }
]

export const POST_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold'
}

export const KYC_STATUS = {
  NONE: 'not_submitted',
  PENDING: 'pending',
  APPROVED: 'verified',
  REJECTED: 'rejected'
}

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' }
]

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_IMAGES = 5
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  ADMIN_PAGE_SIZE: 20
}
