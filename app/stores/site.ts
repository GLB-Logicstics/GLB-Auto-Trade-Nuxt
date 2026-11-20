import { defineStore } from 'pinia'
import { useI18nStore } from '~/stores/i18n'
import { bottomNav, footerLinks, infoLinks, mainNav } from '~/data/site'
import type { Notification, Option, SiteInfo, SocialLink } from '~/types'

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
    bottomNav,
    notifications: [] as Notification[],
    locations: {} as Record<string, string[]>,
  }),

  getters: {
    contact: (state) => state.info.contact,
    cityOptions: (state) => (country: string): Option[] =>
      (state.locations[country] || []).map((city) => ({ label: city, value: city })),
    phoneHref: (state) => `tel:${state.info.contact.phone}`,
    emailHref: (state) => `mailto:${state.info.contact.email}`,
    whatsappHref: (state) => (text: string) => `${state.info.contact.whatsapp}?text=${encodeURIComponent(text)}`,
    newsById: (state) => (id: number) => state.notifications.find((item) => item.id === id),
    copyright: (state) => `© ${new Date().getFullYear()} ${state.info.name}. ${useI18nStore().t('Bütün hüquqlar qorunur.')}`,
  },
})
