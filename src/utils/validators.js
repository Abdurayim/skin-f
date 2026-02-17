export function validateEmail(email) {
  if (!email) return { valid: true }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email address' }
  }

  return { valid: true }
}

export function validatePost(data) {
  const errors = {}

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters'
  }

  if (data.title && data.title.length > 200) {
    errors.title = 'Title must be less than 200 characters'
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters'
  }

  if (data.description && data.description.length > 2000) {
    errors.description = 'Description must be less than 2000 characters'
  }

  if (!data.gameId) {
    errors.gameId = 'Please select a game'
  }

  if (!data.price || parseFloat(data.price) <= 0) {
    errors.price = 'Please enter a valid price'
  }

  if (parseFloat(data.price) > 1000000) {
    errors.price = 'Price is too high'
  }

  if (!data.type) {
    errors.type = 'Please select a type'
  }

  if (!data.images || data.images.length === 0) {
    errors.images = 'Please upload at least one image'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateProfile(data) {
  const errors = {}

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (data.name && data.name.length > 100) {
    errors.name = 'Name must be less than 100 characters'
  }

  if (data.email) {
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.valid) {
      errors.email = emailValidation.error
    }
  }

  if (data.bio && data.bio.length > 500) {
    errors.bio = 'Bio must be less than 500 characters'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateKYC(data) {
  const errors = {}

  if (!data.document) {
    errors.document = 'Please upload your ID document'
  }

  if (!data.selfie) {
    errors.selfie = 'Please take or upload a selfie'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
