<template>
  <div class="cost-result">
    <p class="cost-result__heading">{{ $t('Nəticə') }}</p>

    <p class="cost-result__row">
      <span>{{ $t('Təklif məbləği') }}</span> <strong>{{ formatMoney(result.bid) }}</strong>
    </p>
    <p class="cost-result__row">
      <span>{{ $t('Hərrac rüsumu') }}</span> <strong>{{ formatMoney(result.auctionFee) }}</strong>
    </p>
    <p class="cost-result__row">
      <span>{{ $t('Daşınma (ABŞ – Poti)') }}</span>
      <strong v-if="result.shippingUnknown && result.bid">{{ $t('Əlaqə saxlayın') }}</strong>
      <strong v-else>{{ formatMoney(result.usShipping) }}</strong>
    </p>
    <p v-if="country === 'az'" class="cost-result__row">
      <span>{{ $t('Daşınma (Poti – Bakı)') }}</span>
      <strong>{{ formatMoney(result.potiShipping) }}</strong>
    </p>
    <p class="cost-result__row">
      <span>{{ $t('Gömrük') }} ({{ $t(country === 'az' ? 'Azərbaycan' : 'Gürcüstan') }})</span>
      <strong>
        {{ formatMoney(result.customs) }}
        <small v-if="result.customsLocal">{{ localText }}</small>
      </strong>
    </p>
    <p v-if="result.extras" class="cost-result__row">
      <span>{{ $t('Əlavə xərclər') }}</span>
      <strong>{{ formatMoney(result.extras) }}</strong>
    </p>
    <p class="cost-result__row cost-result__total">
      <span>{{ $t('Yekun qiymət') }}</span> <strong>{{ formatMoney(result.total) }}</strong>
    </p>

    <p class="cost-result__note">{{ $t('Hesablama təxminidir. Dəqiq məbləğ üçün bizimlə əlaqə saxlayın.') }}</p>

    <div class="cost-result__contact">
      <NuxtLink :to="$lp('/contact')" class="btn btn--accent btn--sm">{{ $t('Sorğu göndər') }}</NuxtLink>
      <a :href="contact.whatsapp" class="btn btn--outline btn--sm" target="_blank" rel="noopener">
        <i class="bi bi-whatsapp cost-result__whatsapp" />
        {{ $t('Bizə yazın') }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { mapState } from 'pinia'
import { useSiteStore } from '~/stores/site'
import { formatAzn, formatGel, formatMoney } from '~/utils/format'
import type { EstimateResult } from '~/utils/estimate'

export default defineComponent({
  name: 'CostResult',

  props: {
    result: { type: Object as PropType<EstimateResult>, required: true },
    country: { type: String, default: 'az' },
  },

  computed: {
    ...mapState(useSiteStore, ['contact']),

    localText(): string {
      return this.result.currency === 'GEL' ? formatGel(this.result.customsLocal) : formatAzn(this.result.customsLocal)
    },
  },

  methods: {
    formatMoney,
  },
})
</script>

<style lang="scss" scoped>
.cost-result {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  font-size: 0.875rem;
  background-color: $page-bg;
  border-radius: $radius;

  &__heading {
    font-size: 1rem;
    font-weight: 600;
    color: $ink;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  span {
    color: $text-soft;
  }

  strong {
    color: $ink;
    text-align: right;
  }

  small {
    display: block;
    font-size: 0.75rem;
    font-weight: 400;
    color: $muted;
  }

  &__total {
    padding: 10px 12px;
    margin-top: 4px;
    background-color: $accent-soft;
    border-radius: $radius-sm;

    span,
    strong {
      font-weight: 700;
      color: $accent-text !important;
    }
  }

  &__note {
    font-size: 0.75rem;
    color: $muted;
  }

  &__contact {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 4px;
  }

  &__whatsapp {
    color: #25d366;
  }
}
</style>
