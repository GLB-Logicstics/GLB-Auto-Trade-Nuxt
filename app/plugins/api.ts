import { useCarsStore } from '~/stores/cars'
import { useCatalogStore } from '~/stores/catalog'
import { useContentStore } from '~/stores/content'
import { useHomeStore } from '~/stores/home'
import { useKoreaStore } from '~/stores/korea'
import { useLotsStore } from '~/stores/lots'
import { usePartsStore } from '~/stores/parts'
import { useSiteStore } from '~/stores/site'
import { setShippingPrices, setTariffs } from '~/utils/tariffs'
import type { Bootstrap } from '~/types'

export default defineNuxtPlugin(async () => {
  const apiBase = useRuntimeConfig().public.apiBase
  const { data } = await useAsyncData('bootstrap', () => $fetch<Bootstrap>('/public/bootstrap', { baseURL: apiBase }))

  const value = data.value
  if (!value) return

  const settings = value.settings

  useLotsStore().$patch({ items: value.lots, priceHistory: settings.price_history || {} })
  useCarsStore().$patch({ items: value.cars })
  useKoreaStore().$patch({ items: value.korea_cars })
  usePartsStore().$patch({ items: value.parts })
  useCatalogStore().$patch({ items: value.catalog })
  useHomeStore().$patch({ heroSlides: value.hero_slides, brands: value.brands })
  useContentStore().$patch({ services: value.services, infoPages: value.pages })
  if (settings.tracking_sample) useContentStore().$patch({ trackingSample: settings.tracking_sample })

  if (settings.site) {
    const { socialLinks, ...info } = settings.site
    useSiteStore().$patch({ info, socialLinks, notifications: value.news })
  }

  if (settings.tariffs) setTariffs(settings.tariffs)
  setShippingPrices(value.shipping)
})
