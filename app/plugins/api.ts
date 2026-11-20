import { useCarsStore } from '~/stores/cars'
import { useCatalogStore } from '~/stores/catalog'
import { useContentStore } from '~/stores/content'
import { useHomeStore } from '~/stores/home'
import { useI18nStore } from '~/stores/i18n'
import { useKoreaStore } from '~/stores/korea'
import { useLotsStore } from '~/stores/lots'
import { usePartsStore } from '~/stores/parts'
import { useSiteStore } from '~/stores/site'
import { applyMarketPrices } from '~/utils/marketPrices'
import { setShippingPrices, setTariffs } from '~/utils/tariffs'
import type { Bootstrap } from '~/types'

export default defineNuxtPlugin(async () => {
  const apiBase = useRuntimeConfig().public.apiBase
  const { data } = await useAsyncData('bootstrap', () => $fetch<Bootstrap>('/public/bootstrap', { baseURL: apiBase }))

  const value = data.value
  if (!value) return

  const settings = value.settings
  applyMarketPrices(value.marketPrices || [], value.catalog, value.cars)

  useLotsStore().$patch({ items: value.lots, priceHistory: settings.price_history || {} })
  useCarsStore().$patch({ items: value.cars })
  useKoreaStore().$patch({ items: value.korea_cars })
  usePartsStore().$patch({ items: value.parts, types: value.part_types || [] })
  useCatalogStore().$patch({ items: value.catalog })
  useHomeStore().$patch({ heroSlides: value.hero_slides, brands: value.brands })
  useContentStore().$patch({ services: value.services, infoPages: value.pages })
  if (settings.tracking_sample) useContentStore().$patch({ trackingSample: settings.tracking_sample })

  if (settings.site) {
    const { socialLinks, ...info } = settings.site
    useSiteStore().$patch({ info, socialLinks, notifications: value.news })
  }

  if (settings.locations) useSiteStore().$patch({ locations: settings.locations })
  if (settings.menus) {
    const { main, footer, info } = settings.menus
    useSiteStore().$patch({ mainNav: main || [], footerLinks: footer || [], infoLinks: info || [] })
  }

  if (value.languages && value.languages.length) {
    const defaultLang = (value.languages.find((item) => item.isDefault) || value.languages[0]!).code
    useI18nStore().$patch({
      defaultLang,
      lang: defaultLang,
      languages: value.languages.map((item) => ({ code: item.code, name: item.name, label: item.code.toUpperCase() })),
      dictionary: value.translations || {},
    })
  }

  if (settings.tariffs) setTariffs(settings.tariffs)
  setShippingPrices(value.shipping)
})
