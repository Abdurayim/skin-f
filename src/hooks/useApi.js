import { useState, useCallback, useRef, useEffect } from 'react'
import { API_BASE_URL } from '../config/api'
import { apiLogger } from '../utils/logger'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      // Abort any pending requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const request = useCallback(async (endpoint, options = {}) => {
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController()

    if (isMountedRef.current) {
      setLoading(true)
      setError(null)
    }

    const fullUrl = `${API_BASE_URL}${endpoint}`
    const method = options.method || 'GET'
    let requestId = null

    try {
      const accessToken = localStorage.getItem('accessToken')
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      }

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
      }

      const config = {
        ...options,
        headers,
        signal: abortControllerRef.current.signal
      }

      if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body)
      }

      if (options.body instanceof FormData) {
        delete headers['Content-Type']
      }

      // Log the request
      requestId = apiLogger.logRequest(method, fullUrl, config)

      const response = await fetch(fullUrl, config)
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const errorMsg = data?.message || `Request failed with status ${response.status}`
        apiLogger.logError(requestId, { message: errorMsg }, response.status)
        throw new Error(errorMsg)
      }

      // Log successful response
      apiLogger.logResponse(requestId, response.status, data)

      return { data, error: null }
    } catch (err) {
      // Don't log or set state if request was aborted
      if (err.name === 'AbortError') {
        return { data: null, error: 'Request cancelled' }
      }

      // Check if it's a network/connection error
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        apiLogger.logConnectionError(fullUrl, err)
      } else if (requestId) {
        apiLogger.logError(requestId, err)
      } else {
        apiLogger.logError(null, err)
      }

      if (isMountedRef.current) {
        setError(err.message)
      }
      return { data: null, error: err.message }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  const get = useCallback((endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'GET' })
  }, [request])

  const post = useCallback((endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'POST', body })
  }, [request])

  const put = useCallback((endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'PUT', body })
  }, [request])

  const patch = useCallback((endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'PATCH', body })
  }, [request])

  const del = useCallback((endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'DELETE' })
  }, [request])

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    del,
    request
  }
}
