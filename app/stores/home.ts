import { defineStore } from 'pinia'
import { countries } from '~/data/filters'
import { useSiteStore } from '~/stores/site'
import { useCarsStore } from '~/stores/cars'
import { useKoreaStore } from '~/stores/korea'
import { isUpcoming, useLotsStore } from '~/stores/lots'
import type { Brand, CarSection, HeroSlide, LocalCar, Option } from '~/types'

export const useHomeStore = defineStore('home', {
  state: () => ({
    heroSlides: [] as HeroSlide[],
    brands: [] as Brand[],
    countries,
    localCountry: 'aze',
    localCity: '',
  }),

  getters: {
    topSections(): CarSection[] {
      const lots = useLotsStore().items

      return [
        {
          id: 'upcoming',
          type: 'auction',
          title: 'Yaxın 10 gündə',
          highlight: 'Hərraclar',
          subtitle: 'Copart, IAAI və Manheim hərraclarında tezliklə satışa çıxacaq avtomobillər',
          moreLink: '/auction-lots?upcoming=1',
          items: lots.filter(isUpcoming),
        },
        {
          id: 'popular',
          type: 'auction',
          title: 'Populyar',
          highlight: 'Avtomobillər',
          subtitle: 'Amerikadan ən çox sifariş edilən avtomobillər',
          moreLink: '/auction-lots',
          items: lots.filter((lot) => lot.popular),
        },
      ]
    },

    bottomSections(): CarSection[] {
      const lots = useLotsStore().items

      return [
        {
          id: 'hybrid',
          type: 'auction',
          title: 'Hibrid',
          highlight: 'Avtomobillər',
          subtitle: 'Az yanacaq, çox yol — qənaətli və səssiz sürüş.',
          moreLink: '/auction-lots?fuels=Hibrid',
          items: lots.filter((lot) => lot.fuel === 'Hibrid'),
        },
        {
          id: 'korea',
          type: 'korea',
          title: 'Koreyadan',
          highlight: 'Avtomobillər',
          subtitle: 'Qiymət, çatdırılma və gömrük daxil yekun məbləğ',
          moreLink: '/korea-cars',
          items: useKoreaStore().items,
        },
      ]
    },

    localCityOptions(state): Option[] {
      return useSiteStore().cityOptions(state.localCountry)
    },

    localCars(state): LocalCar[] {
      return useCarsStore().items.filter((car) => {
        if (car.country !== state.localCountry) return false
        if (state.localCity && car.city !== state.localCity) return false
        return true
      })
    },

    localMoreLink(state): string {
      const city = state.localCity ? `&city=${state.localCity}` : ''
      return `/search?country=${state.localCountry}${city}`
    },
  },

  actions: {
    setLocalCountry(value: string) {
      this.localCountry = value
      this.localCity = ''
    },
  },
})
