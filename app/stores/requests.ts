import { defineStore } from 'pinia'
import { apiFetch } from '~/utils/api'
import type { RequestItem, UserRequest } from '~/types'

export const requestStatuses: Record<string, string> = {
  new: 'Gözləmədə',
  in_progress: 'İcrada',
  done: 'Tamamlandı',
  cancelled: 'Ləğv edildi',
}

export const useRequestsStore = defineStore('requests', {
  state: () => ({
    items: [] as UserRequest[],
    loading: false,
  }),

  actions: {
    async send(request: Omit<RequestItem, 'id' | 'date'>) {
      try {
        await apiFetch('/public/requests', { method: 'POST', body: request })
        return true
      } catch {
        return false
      }
    },

    async load() {
      this.loading = true
      try {
        this.items = await apiFetch<UserRequest[]>('/user/requests')
      } catch {
        this.items = []
      }
      this.loading = false
    },
  },
})
