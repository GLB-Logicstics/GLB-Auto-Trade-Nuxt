import { defineStore } from 'pinia'
import { apiFetch, apiMessage } from '~/utils/api'
import type { User } from '~/types'

interface AuthResponse {
  token: string
  user: User
}

export interface RegisterForm {
  name: string
  email: string
  phone: string
  password: string
  company: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: '',
  }),

  getters: {
    loggedIn: (state) => !!state.user,
    firstName: (state) => (state.user ? state.user.name.split(' ')[0] : ''),
    isDealer: (state) => !!state.user && state.user.role === 'dealer',
    dealerApproved: (state) => !!state.user && state.user.role === 'dealer' && state.user.dealerStatus === 'approved',
  },

  actions: {
    setSession(data: AuthResponse) {
      this.token = data.token
      this.user = data.user
    },

    async login(email: string, password: string) {
      try {
        this.setSession(await apiFetch<AuthResponse>('/user/login', { method: 'POST', body: { email, password } }))
        return ''
      } catch (error) {
        return apiMessage(error)
      }
    },

    async register(form: RegisterForm) {
      try {
        this.setSession(await apiFetch<AuthResponse>('/user/register', { method: 'POST', body: form }))
        return ''
      } catch (error) {
        return apiMessage(error)
      }
    },

    async refresh() {
      if (!this.token) return
      try {
        this.user = await apiFetch<User>('/user/me')
      } catch {
        this.logout()
      }
    },

    async updateProfile(form: { name: string; phone: string; company: string }) {
      try {
        const user = await apiFetch<User & { dealerStatus: User['dealerStatus'] }>('/user/me', { method: 'PUT', body: form })
        this.user = { ...this.user!, ...user }
        return ''
      } catch (error) {
        return apiMessage(error)
      }
    },

    async changePassword(current: string, next: string) {
      try {
        await apiFetch('/user/password', { method: 'PUT', body: { current, next } })
        return ''
      } catch (error) {
        return apiMessage(error)
      }
    },

    logout() {
      this.user = null
      this.token = ''
    },
  },
})
