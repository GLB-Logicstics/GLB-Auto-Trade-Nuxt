import { defineStore } from 'pinia'
import { collectMakes } from '~/utils/makes'
import type { Make, Option, Part, PartType } from '~/types'

export const usePartsStore = defineStore('parts', {
  state: () => ({
    items: [] as Part[],
    types: [] as PartType[],
    text: '',
    make: '',
    model: '',
    year: '',
    type: '',
  }),

  getters: {
    makes: (state): Make[] => collectMakes(state.items),

    makeOptions(): Option[] {
      return this.makes.map((make) => ({ label: make.name, value: make.name }))
    },

    modelOptions(state): Option[] {
      const make = this.makes.find((item) => item.name === state.make)
      return make ? make.models.map((model) => ({ label: model, value: model })) : []
    },

    typeOptions(state): Option[] {
      return state.types.map((type) => ({ label: type.label, value: type.value }))
    },

    typeOf:
      (state) =>
      (value: string): PartType | undefined =>
        state.types.find((type) => type.value === value),

    filteredParts(state): Part[] {
      const text = state.text.trim().toLowerCase()
      const year = Number(state.year)

      return state.items.filter((part) => {
        if (text && !part.title.toLowerCase().includes(text)) return false
        if (state.make && part.make !== state.make) return false
        if (state.model && part.model !== state.model) return false
        if (state.type && part.type !== state.type) return false
        if (year && (year < part.yearFrom || year > part.yearTo)) return false
        return true
      })
    },
  },

  actions: {
    applyQuery(query: Record<string, unknown>) {
      this.type = query.type ? String(query.type) : ''
    },

    setMake(value: string) {
      this.make = value
      this.model = ''
    },

    reset() {
      this.text = ''
      this.make = ''
      this.model = ''
      this.year = ''
      this.type = ''
    },
  },
})
