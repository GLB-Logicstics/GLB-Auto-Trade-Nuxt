import { defineStore } from 'pinia'
import type { Language } from '~/types'

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    lang: 'az',
    defaultLang: 'az',
    languages: [{ code: 'az', label: 'AZ', name: 'Azərbaycan' }] as Language[],
    dictionary: {} as Record<string, Record<string, string>>,
  }),

  actions: {
    t(text: string, params?: Record<string, string | number>) {
      if (!text) return ''
      const table = this.dictionary[this.lang]
      let value = (table && table[text]) || text
      if (params) {
        for (const key in params) value = value.split(`{${key}}`).join(String(params[key]))
      }
      return value
    },

    tr<T extends object>(item: T | null | undefined, field: keyof T & string) {
      if (!item) return ''
      const base = (item as Record<string, unknown>)[field]
      if (this.lang === this.defaultLang) return base
      const i18n = (item as { i18n?: Record<string, Record<string, unknown>> }).i18n
      const value = i18n && i18n[this.lang] && i18n[this.lang][field]
      if (Array.isArray(value) ? value.length : value) return value
      return base
    },

    setLanguage(code: string) {
      if (this.languages.some((item) => item.code === code)) this.lang = code
    },
  },
})
