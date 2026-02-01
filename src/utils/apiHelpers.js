/**
 * Unwraps API response data from standardized backend format
 * Backend always returns: { success, message, data }
 * This helper extracts the actual data payload
 */
export const unwrapResponse = (response) => {
  if (!response) return null

  // If response has a 'data' property, unwrap it
  if (response.data !== undefined) {
    return response.data
  }

  // Otherwise return as-is
  return response
}

/**
 * Safely access nested response data
 * Usage: getResponseData(response, 'post', '_id')
 */
export const getResponseData = (response, ...path) => {
  let current = unwrapResponse(response)

  for (const key of path) {
    if (current?.[key] === undefined) return null
    current = current[key]
  }

  return current
}

/**
 * Check if API response indicates success
 */
export const isSuccessResponse = (response) => {
  if (!response) return false
  return response.success !== false
}
