<template>
  <div class="container">
    <PageHeader
      :title="$t('Daşınma kalkulyatoru')"
      :subtitle="$t('ABŞ-dakı hərrac meydançasından Poti limanına və Bakıya qədər daşınma qiyməti.')"
      :crumbs="[{ label: $t('Daşınma kalkulyatoru') }]"
    />

    <CalculatorTabs />

    <div class="two-col">
      <div class="card">
        <h2 class="panel__title">
          <i class="bi bi-truck" />
          {{ $t('Marşrut') }}
        </h2>

        <div class="panel__body">
          <div class="form-field">
            <span>{{ $t('Auksion') }}</span>
            <BaseSelect v-model="auction" :options="auctions" :clearable="false" />
          </div>

          <div class="form-field">
            <span>{{ $t('Hərrac meydançası') }}</span>
            <BaseSelect v-model="location" :options="locationOptions" :placeholder="$t('Şəhər seçin')" searchable />
          </div>

          <div class="form-field">
            <span>{{ $t('Çatdırılma ölkəsi') }}</span>
            <BaseSelect v-model="country" :options="countries" :clearable="false" />
          </div>

          <dl class="info-list">
            <div>
              <dt>{{ $t('ABŞ – Poti') }}</dt>
              <dd>{{ usShipping ? formatMoney(usShipping) : '—' }}</dd>
            </div>
            <div v-if="country === 'az'">
              <dt>{{ $t('Poti – Bakı') }}</dt>
              <dd>{{ formatMoney(potiPrice) }}</dd>
            </div>
          </dl>

          <p class="shipping-calc__total">
            <span>{{ $t('Cəmi daşınma') }}</span>
            <strong>{{ usShipping ? formatMoney(total) : $t('Meydança seçin') }}</strong>
          </p>
        </div>
      </div>

      <div class="card">
        <h2 class="panel__title">
          <i class="bi bi-list-ul" />
          {{ $t('{auction} meydançaları (ABŞ – Poti)', { auction }) }}
        </h2>

        <ul class="shipping-calc__list">
          <li
            v-for="item in locationOptions"
            :key="item.value"
            :class="{ 'is-active': item.value === location }"
            @click="location = item.value"
          >
            <span>{{ $t(item.label) }}</span>
            <strong>{{ formatUsd(prices[item.value] || 0) }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { countries } from '~/data/calculator'
import { auctions } from '~/data/filters'
import { shippingPrices, tariffs } from '~/utils/tariffs'
import { formatMoney, formatUsd } from '~/utils/format'
import type { Option } from '~/types'

export default defineComponent({
  name: 'ShippingCalculatorPage',

  setup() {
    const t = useNuxtApp().$t
    useSeoMeta({
      title: () => t('Daşınma kalkulyatoru — GLB Logistics'),
      description: () => t('ABŞ hərrac meydançalarından Poti və Bakıya avtomobil daşınma qiymətləri.'),
    })
  },

  data() {
    return {
      auction: 'Copart',
      location: '',
      country: 'az',
      auctions,
      countries,
      potiPrice: tariffs.potiBakuPrice,
    }
  },

  computed: {
    prices(): Record<string, number> {
      return shippingPrices[this.auction] || {}
    },

    locationOptions(): Option[] {
      return Object.keys(this.prices).map((name) => ({ label: name, value: name }))
    },

    usShipping(): number {
      return this.prices[this.location] || 0
    },

    total(): number {
      return this.usShipping + (this.country === 'az' ? this.potiPrice : 0)
    },
  },

  watch: {
    auction() {
      this.location = ''
    },
  },

  methods: {
    formatMoney,
    formatUsd,
  },
})
</script>

<style lang="scss" scoped>
.shipping-calc {
  &__total {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    font-weight: 700;
    color: $accent-text;
    background-color: $accent-soft;
    border-radius: $radius-sm;
  }

  &__list {
    max-height: 420px;
    padding: 8px;
    overflow-y: auto;

    li {
      display: flex;
      justify-content: space-between;
      padding: 10px 12px;
      font-size: 0.875rem;
      border-radius: $radius-sm;
      cursor: pointer;

      &:hover,
      &.is-active {
        background-color: $accent-soft;
      }
    }

    strong {
      color: $ink;
    }
  }
}
</style>
