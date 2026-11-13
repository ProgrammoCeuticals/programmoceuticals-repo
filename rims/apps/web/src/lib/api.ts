import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // for HttpOnly refresh token cookie
})

// Request interceptor: attach Bearer token
api.interceptors.request.use((config) => {
  // Read from localStorage directly — zustand persist stores under 'rims-auth'
  try {
    const raw = localStorage.getItem('rims-auth')
    if (raw) {
      const state = JSON.parse(raw) as { state?: { accessToken?: string } }
      const token = state?.state?.accessToken
      if (token) config.headers['Authorization'] = `Bearer ${token}`
    }
  } catch {
    // ignore parse errors
  }
  return config
})

// Response interceptor: handle 401 → refresh → retry
let isRefreshing = false
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!),
  )
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest) originalRequest.headers['Authorization'] = `Bearer ${token}`
          return api(originalRequest!)
        })
      }

      originalRequest!._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<{
          data?: { accessToken?: string }
          accessToken?: string
        }>('/api/v1/auth/refresh', {}, { withCredentials: true })

        const newToken: string = data.data?.accessToken ?? data.accessToken ?? ''

        // Update persisted store
        try {
          const raw = localStorage.getItem('rims-auth')
          if (raw) {
            const parsed = JSON.parse(raw) as { state?: { accessToken?: string } }
            if (parsed.state) parsed.state.accessToken = newToken
            localStorage.setItem('rims-auth', JSON.stringify(parsed))
          }
        } catch {
          // ignore
        }

        processQueue(null, newToken)
        if (originalRequest) originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return api(originalRequest!)
      } catch (refreshError) {
        processQueue(refreshError, null)

        // Clear auth and redirect to login
        try {
          const raw = localStorage.getItem('rims-auth')
          if (raw) {
            const parsed = JSON.parse(raw) as { state?: object }
            parsed.state = {
              user: null,
              accessToken: null,
              permissions: [],
              isAuthenticated: false,
            }
            localStorage.setItem('rims-auth', JSON.stringify(parsed))
          }
        } catch {
          // ignore
        }

        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Unwrap API error envelope
    const apiError = error.response?.data as
      | { error?: { code?: string; message?: string } }
      | undefined
    const message = apiError?.error?.message ?? error.message
    const code = apiError?.error?.code ?? 'UNKNOWN_ERROR'
    const wrappedError = new Error(message) as Error & { code: string }
    wrappedError.code = code
    return Promise.reject(wrappedError)
  },
)

export { api }
export default api
