import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'


const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Invoicing
export async function createInvoice(data: any) {
  const res = await fetch(`${API_BASE}/api/invoice/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return res.json()
}

export async function getInvoice(id: number) {
  const res = await fetch(`${API_URL}/api/invoice/${id}/`)
  return res.json()
}

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/api/auth/token/refresh/`, { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/auth/login'
          }
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api

// ── Typed API methods ─────────────────────────────────────────────────────────
export const authAPI = {
  register: (d: any) => api.post('/auth/register/', d),
  login: (d: any) => api.post('/auth/login/', d),
  logout: (refresh: string) => api.post('/auth/logout/', { refresh }),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (d: any) => api.patch('/auth/profile/', d),
  changePassword: (d: any) => api.post('/auth/change-password/', d),
  forgotPassword: (email: string) => api.post('/auth/forgot-password/', { email }),
  resetPassword: (d: any) => api.post('/auth/reset-password/', d),
}

export const productsAPI = {
  list: (params?: any) => api.get('/products/', { params }),
  detail: (slug: string) => api.get(`/products/${slug}/`),
  featured: () => api.get('/products/featured/'),
  categories: () => api.get('/products/categories/'),
  testimonials: (featured?: boolean) => api.get('/products/testimonials/', { params: featured ? { featured: true } : {} }),
  stats: () => api.get('/products/stats/'),
}

export const ordersAPI = {
  create: (d: any) => api.post('/orders/create/', d),
  verify: (d: any) => api.post('/orders/verify/', d),
  myOrders: () => api.get('/orders/my-orders/'),
}

export const licensesAPI = {
  myLicenses:   ()                              => api.get('/licenses/my/'),
  validate:     (d: any)                        => api.post('/licenses/validate/', d),
  activations:  (licenseId: string)             => api.get(`/licenses/${licenseId}/activations/`),
  deactivate:   (licenseId: string, machineId: string) =>
                  api.post(`/licenses/${licenseId}/deactivate/`, { machine_id: machineId }),
}

export const downloadsAPI = {
  request: (licenseId: string) => api.post('/downloads/request/', { license_id: licenseId }),
  history: () => api.get('/downloads/history/'),
}
