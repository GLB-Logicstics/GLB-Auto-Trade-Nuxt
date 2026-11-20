import { defineStore } from 'pinia'
import type { InfoPage, Service } from '~/types'

export const useContentStore = defineStore('content', {
  state: () => ({
    services: [] as Service[],
    infoPages: [] as InfoPage[],
  }),

  getters: {
    serviceBySlug: (state) => (slug: string) => state.services.find((service) => service.slug === slug),
    pageBySlug: (state) => (slug: string) => state.infoPages.find((page) => page.slug === slug),
  },
})
