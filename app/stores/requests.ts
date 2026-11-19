import { defineStore } from 'pinia'
import type { RequestItem } from '~/types'

export const useRequestsStore = defineStore('requests', {
  state: () => ({
    items: [] as RequestItem[],
  }),

  actions: {
    async send(request: Omit<RequestItem, 'id' | 'date'>) {
      try {
        await $fetch('/public/requests', {
          baseURL: useRuntimeConfig().public.apiBase,
          method: 'POST',
          body: request,
        })
      } catch {
        return false
      }

      this.items = [{ ...request, id: Date.now(), date: new Date().toLocaleDateString('az-AZ') }, ...this.items]
      return true
    },
  },
})
