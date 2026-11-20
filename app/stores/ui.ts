import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    mobileMenuOpen: false,
    searchOpen: false,
  }),

  actions: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },

    openSearch() {
      this.mobileMenuOpen = false
      this.searchOpen = true
    },

    closeSearch() {
      this.searchOpen = false
    },

    closeAll() {
      this.mobileMenuOpen = false
      this.searchOpen = false
    },
  },
})
