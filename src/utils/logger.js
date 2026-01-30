/**
 * API Logger for debugging backend connections
 * Set ENABLE_API_LOGS to true in .env or localStorage to enable logging
 */

const isDevelopment = import.meta.env.DEV
const ENABLE_LOGS = isDevelopment || localStorage.getItem('ENABLE_API_LOGS') === 'true'

// Color codes for console
const colors = {
  request: '#00d9ff',    // cyan
  success: '#00ff88',    // green
  error: '#ff3366',      // red
  warning: '#ffa500',    // orange
  info: '#a3a3a3',       // gray
  time: '#00ff88'        // green
}

const styles = {
  request: `color: ${colors.request}; font-weight: bold;`,
  success: `color: ${colors.success}; font-weight: bold;`,
  error: `color: ${colors.error}; font-weight: bold;`,
  warning: `color: ${colors.warning}; font-weight: bold;`,
  info: `color: ${colors.info};`,
  time: `color: ${colors.time}; font-weight: bold;`,
  label: 'font-weight: bold;',
  data: 'color: #a3a3a3;'
}

class APILogger {
  constructor() {
    this.requests = new Map()
  }

  /**
   * Log API request
   */
  logRequest(method, url, options = {}) {
    if (!ENABLE_LOGS) return

    const requestId = `${method}-${url}-${Date.now()}`
    const timestamp = new Date().toLocaleTimeString()

    this.requests.set(requestId, {
      method,
      url,
      startTime: performance.now(),
      timestamp
    })

    console.group(`%c→ ${method} %c${url}`, styles.request, styles.info)
    console.log(`%c⏱️ Time: %c${timestamp}`, styles.label, styles.time)

    if (options.headers) {
      console.log('%c📋 Headers:', styles.label, options.headers)
    }

    if (options.body) {
      try {
        const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body
        console.log('%c📦 Body:', styles.label, body)
      } catch {
        console.log('%c📦 Body:', styles.label, options.body)
      }
    }

    console.groupEnd()

    return requestId
  }

  /**
   * Log successful API response
   */
  logResponse(requestId, status, data) {
    if (!ENABLE_LOGS) return

    const request = this.requests.get(requestId)
    if (!request) return

    const duration = (performance.now() - request.startTime).toFixed(2)

    console.group(`%c✓ ${status} %c${request.method} ${request.url} %c(${duration}ms)`, styles.success, styles.info, styles.time)

    if (data) {
      console.log('%c📥 Response:', styles.label, data)
    }

    console.groupEnd()

    this.requests.delete(requestId)
  }

  /**
   * Log API error
   */
  logError(requestId, error, status = null) {
    if (!ENABLE_LOGS) return

    const request = this.requests.get(requestId)
    const duration = request ? (performance.now() - request.startTime).toFixed(2) : 'N/A'

    const url = request ? request.url : 'Unknown URL'
    const method = request ? request.method : 'Unknown Method'

    console.group(`%c✗ ${status || 'ERROR'} %c${method} ${url} %c(${duration}ms)`, styles.error, styles.info, styles.time)

    console.log('%c❌ Error:', styles.error, error)

    if (error.message) {
      console.log('%c💬 Message:', styles.label, error.message)
    }

    if (error.stack) {
      console.log('%c📚 Stack:', styles.label, error.stack)
    }

    console.groupEnd()

    if (request) {
      this.requests.delete(requestId)
    }
  }

  /**
   * Log connection failure
   */
  logConnectionError(url, error) {
    if (!ENABLE_LOGS) return

    console.group(`%c⚠️ CONNECTION FAILED %c${url}`, styles.error, styles.info)
    console.log('%c🔌 Connection Error:', styles.error, error.message || error)
    console.log('%c💡 Possible causes:', styles.warning)
    console.log('  • Backend server is not running')
    console.log('  • Incorrect API_BASE_URL in config')
    console.log('  • CORS issues')
    console.log('  • Network connectivity problems')
    console.log(`%c🔧 Current API URL: %c${url}`, styles.label, styles.info)
    console.groupEnd()
  }

  /**
   * Log general info
   */
  info(message, ...args) {
    if (!ENABLE_LOGS) return
    console.log(`%cℹ️ ${message}`, styles.info, ...args)
  }

  /**
   * Log warning
   */
  warn(message, ...args) {
    if (!ENABLE_LOGS) return
    console.warn(`%c⚠️ ${message}`, styles.warning, ...args)
  }

  /**
   * Clear all logs
   */
  clear() {
    this.requests.clear()
    if (ENABLE_LOGS) {
      console.clear()
    }
  }

  /**
   * Get all pending requests
   */
  getPendingRequests() {
    return Array.from(this.requests.values())
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled) {
    localStorage.setItem('ENABLE_API_LOGS', enabled.toString())
    window.location.reload()
  }
}

// Export singleton instance
export const apiLogger = new APILogger()

// Expose to window for debugging
if (isDevelopment) {
  window.apiLogger = apiLogger
  window.enableApiLogs = () => apiLogger.setEnabled(true)
  window.disableApiLogs = () => apiLogger.setEnabled(false)

  console.log(
    '%c🔍 API Logger Available',
    'background: #0a0e1a; color: #00d9ff; font-size: 14px; padding: 8px; border-radius: 4px; font-weight: bold;'
  )
  console.log('%cUse window.enableApiLogs() to enable detailed API logging', 'color: #a3a3a3;')
  console.log('%cUse window.disableApiLogs() to disable logging', 'color: #a3a3a3;')
}

export default apiLogger
