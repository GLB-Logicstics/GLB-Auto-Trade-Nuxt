import { defineStore } from 'pinia'
import { bottomNav, footerLinks, infoLinks, languages, mainNav } from '~/data/site'
import type { Notification, SiteInfo, SocialLink } from '~/types'

function emptySiteInfo(): SiteInfo {
  return {
    name: 'GLB Logistics',
    logo: 'images/logo.png',
    logoDark: 'images/logo-dark.png',
    about: '',
    contact: { phone: '', phoneDisplay: '', whatsapp: '', email: '', address: '', workingHours: '' },
  }
}

export const useSiteStore = defineStore('site', {
  state: () => ({
    info: emptySiteInfo(),
    mainNav,
    footerLinks,
    infoLinks,
    socialLinks: [] as SocialLink[],
    languages,
    bottomNav,
    notifications: [] as Notification[],
  }),

  getters: {
    contact: (state) => state.info.contact,
    phoneHref: (state) => `tel:${state.info.contact.phone}`,
    emailHref: (state) => `mailto:${state.info.contact.email}`,
    whatsappHref: (state) => (text: string) => `${state.info.contact.whatsapp}?text=${encodeURIComponent(text)}`,
    newsById: (state) => (id: number) => state.notifications.find((item) => item.id === id),
    copyright: (state) => `© ${new Date().getFullYear()} ${state.info.name}. Bütün hüquqlar qorunur.`,
  },
})
