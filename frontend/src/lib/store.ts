import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api'

export interface User {
  id: string; email: string; username: string
  first_name: string; last_name: string; full_name: string
  phone: string; company: string; is_staff: boolean; is_verified: boolean; created_at: string
}

interface AuthState {
  user: User | null; isLoading: boolean; isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
  setUser: (user: User) => void
}

const setCookie = (name: string, value: string, days = 1) => {
  if (typeof document === 'undefined') return
  const e = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; path=/; expires=${e}; SameSite=Lax`
}
const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, isLoading: false, isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authAPI.login({ email, password })
          localStorage.setItem('access_token', data.tokens.access)
          localStorage.setItem('refresh_token', data.tokens.refresh)
          setCookie('access_token', data.tokens.access)
          set({ user: data.user, isAuthenticated: true, isLoading: false })
        } catch (err) { set({ isLoading: false }); throw err }
      },

      register: async (formData) => {
        set({ isLoading: true })
        try {
          const { data } = await authAPI.register(formData)
          localStorage.setItem('access_token', data.tokens.access)
          localStorage.setItem('refresh_token', data.tokens.refresh)
          setCookie('access_token', data.tokens.access)
          set({ user: data.user, isAuthenticated: true, isLoading: false })
        } catch (err) { set({ isLoading: false }); throw err }
      },

      logout: async () => {
        const refresh = localStorage.getItem('refresh_token')
        if (refresh) { try { await authAPI.logout(refresh) } catch {} }
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        deleteCookie('access_token')
        set({ user: null, isAuthenticated: false })
      },

      fetchProfile: async () => {
        try {
          const { data } = await authAPI.profile()
          set({ user: data, isAuthenticated: true })
        } catch { deleteCookie('access_token'); set({ user: null, isAuthenticated: false }) }
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    { name: 'auth-store', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
)
