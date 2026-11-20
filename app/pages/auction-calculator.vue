<template>
  <div class="container">
    <PageHeader
      :title="$t('Hərrac kalkulyatoru')"
      :subtitle="$t('Hərracdan Azərbaycana və ya Gürcüstana qədər bütün xərcləri bir yerdə hesablayın.')"
      :crumbs="[{ label: $t('Hərrac kalkulyatoru') }]"
    />

    <CalculatorTabs />

    <div class="two-col">
      <form class="card" @submit.prevent>
        <h2 class="panel__title">
          <i class="bi bi-calculator" />
          {{ $t('Avtomobil və hərrac məlumatları') }}
        </h2>

        <div class="panel__body">
          <div class="form-grid">
            <div class="form-field">
              <span>{{ $t('Auksion') }}</span>
              <BaseSelect v-model="form.auction" :options="auctions" :clearable="false" />
            </div>

            <div class="form-field">
              <span>{{ $t('Hərrac meydançası') }}</span>
              <BaseSelect v-model="form.location" :options="locationOptions" :placeholder="$t('Şəhər seçin')" searchable />
            </div>

            <label class="form-field">
              <span>{{ $t('Təklif məbləği (USD)') }}</span>
              <input v-model="form.bid" type="number" min="0" class="form-input" placeholder="0">
            </label>

            <div class="form-field">
              <span>{{ $t('Sənəd növü') }}</span>
              <BaseSelect v-model="form.document" :options="documentOptions" :clearable="false" />
            </div>

            <label class="form-field">
              <span>{{ $t('Mühərrik həcmi (sm³)') }}</span>
              <input v-model="form.engineCc" type="number" min="0" class="form-input" placeholder="2000">
            </label>

            <div class="form-field">
              <span>{{ $t('Buraxılış ili') }}</span>
              <BaseSelect v-model="form.year" :options="years" :clearable="false" />
            </div>

            <div class="form-field">
              <span>{{ $t('Yanacaq növü') }}</span>
              <BaseSelect v-model="form.fuel" :options="fuelOptions" :clearable="false" />
            </div>

            <div class="form-field">
              <span>{{ $t('Çatdırılma ölkəsi') }}</span>
              <BaseSelect v-model="form.country" :options="countries" :clearable="false" />
            </div>

            <div class="form-field is-wide">
              <span>{{ $t('Əlavə xərclər') }}</span>
              <label v-for="item in extraCosts" :key="item.id" class="checkbox">
                <input v-model="form.extras" type="checkbox" :value="item.id">
                {{ $t(item.label) }} (+${{ item.price }})
              </label>
            </div>
          </div>

          <button type="button" class="btn btn--outline" @click="reset">{{ $t('Sıfırla') }}</button>
        </div>
      </form>

      <div class="card auction-calc__result">
        <CostResult :result="result" :country="form.country" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { countries, documentOptions, fuelOptions } from '~/data/calculator'
import { shippingPrices, tariffs } from '~/utils/tariffs'
import { auctions, years } from '~/data/filters'
import { estimate, type DocumentType, type EstimateResult } from '~/utils/estimate'
import type { Option } from '~/types'

function emptyForm() {
  return {
    auction: 'Copart',
    location: '',
    bid: '',
    document: 'clean' as DocumentType,
    engineCc: '2000',
    year: String(new Date().getFullYear() - 3),
    fuel: 'Benzin',
    country: 'az',
    extras: [] as string[],
  }
}

export default defineComponent({
  name: 'AuctionCalculatorPage',

  setup() {
    const t = useNuxtApp().$t
    useSeoMeta({
      title: () => t('Hərrac kalkulyatoru — GLB Logistics'),
      description: () =>
        t('Copart, IAAI və Manheim hərraclarından avtomobilin Azərbaycana və Gürcüstana gətirilmə xərcini hesablayın.'),
    })
  },

  data() {
    return {
      form: emptyForm(),
      auctions,
      years,
      countries,
      documentOptions,
      extraCosts: tariffs.extraCosts,
      fuelOptions,
    }
  },

  computed: {
    locationOptions(): Option[] {
      return Object.keys(shippingPrices[this.form.auction] || {}).map((name) => ({ label: name, value: name }))
    },

    result(): EstimateResult {
      return estimate({
        bid: Number(this.form.bid) || 0,
        document: this.form.document,
        auction: this.form.auction,
        location: this.form.location,
        country: this.form.country,
        engineCc: Number(this.form.engineCc) || 0,
        fuel: this.form.fuel,
        year: Number(this.form.year),
        extras: this.form.extras,
      })
    },
  },

  watch: {
    'form.auction'() {
      this.form.location = ''
    },
  },

  methods: {
    reset() {
      this.form = emptyForm()
    },
  },
})
</script>

<style lang="scss" scoped>
.auction-calc__result {
  padding: 16px;

  @include up(lg) {
    position: sticky;
    top: 96px;
  }
}
</style>
