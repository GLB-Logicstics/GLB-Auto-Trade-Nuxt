<template>
  <div v-if="lot">
    <div class="container lot-page">
      <Breadcrumbs :items="breadcrumbs" />

      <div class="lot-page__head">
        <div>
          <h1 class="lot-page__title">{{ lot.title }}</h1>
          <p class="lot-page__meta">
            <span>Lot #{{ lot.lotNumber }}</span>
            <span>{{ $t('Yer:') }} <b>{{ lot.location }}</b></span>
            <span>{{ $t('Hərrac tarixi:') }} {{ formatDate(lot.saleDate) }}</span>
          </p>
        </div>

        <button type="button" class="lot-page__favourite" :class="{ 'is-active': isFavourite }" @click="toggle(favouriteId)">
          <i :class="['bi', isFavourite ? 'bi-heart-fill' : 'bi-heart']" />
          {{ isFavourite ? $t('Seçilmişlərdədir') : $t('Seçilmişlərə əlavə et') }}
        </button>
      </div>

      <div class="lot-page__top">
        <LotGallery :images="lot.images" :title="lot.title" :status="status" />

        <div class="card lot-page__box">
          <h2 class="lot-page__box-title">
            <i class="bi bi-card-list" />
            {{ $t('Lot #{number} detalları', { number: lot.lotNumber }) }}
          </h2>
          <dl class="lot-page__list">
            <div><dt>{{ $t('VIN:') }}</dt><dd>{{ lot.vin }}</dd></div>
            <div><dt>{{ $t('Yürüş:') }}</dt><dd>{{ formatMiles(lot.odometer, lot.odometerType) }}</dd></div>
            <div><dt>{{ $t('Sənəd:') }}</dt><dd>{{ lot.document }}</dd></div>
            <div><dt>{{ $t('Əsas zədə:') }}</dt><dd>{{ lot.primaryDamage }}</dd></div>
            <div><dt>{{ $t('Əlavə zədə:') }}</dt><dd>{{ lot.secondaryDamage }}</dd></div>
            <div><dt>{{ $t('Ban növü:') }}</dt><dd>{{ lot.bodyType }}</dd></div>
            <div><dt>{{ $t('Rəng:') }}</dt><dd>{{ lot.color }}</dd></div>
            <div><dt>{{ $t('Mühərrik:') }}</dt><dd>{{ lot.engine }}</dd></div>
            <div><dt>{{ $t('Sürət qutusu:') }}</dt><dd>{{ lot.transmission }}</dd></div>
            <div><dt>{{ $t('Ötürücü:') }}</dt><dd>{{ lot.drive }}</dd></div>
            <div><dt>{{ $t('Yanacaq:') }}</dt><dd>{{ lot.fuel }}</dd></div>
            <div><dt>{{ $t('Açarlar:') }}</dt><dd>{{ lot.hasKeys ? $t('Var') : $t('Yoxdur') }}</dd></div>
            <div><dt>{{ $t('Vəziyyət:') }}</dt><dd>{{ lot.condition }}</dd></div>
          </dl>
        </div>
      </div>

      <div class="lot-page__middle">
        <LotCalculator :lot="lot" />

        <div class="card lot-page__box">
          <h2 class="lot-page__box-title">
            <i class="bi bi-receipt" />
            {{ $t('Satış məlumatı') }}
          </h2>
          <dl class="lot-page__list">
            <div><dt>{{ $t('Auksion:') }}</dt><dd>{{ lot.auction }}</dd></div>
            <div><dt>{{ $t('Auksion növü:') }}</dt><dd>{{ auctionTypeLabel }}</dd></div>
            <div><dt>{{ $t('Hazırkı təklif:') }}</dt><dd>{{ formatUsd(lot.currentBid) }}</dd></div>
            <div><dt>{{ $t('Minimal rezerv:') }}</dt><dd>{{ status.reserve }}</dd></div>
            <div>
              <dt class="lot-page__green">{{ $t('İndi al:') }}</dt>
              <dd class="lot-page__green">{{ lot.buyNowPrice ? formatUsd(lot.buyNowPrice) : '—' }}</dd>
            </div>
            <div><dt>{{ $t('Yer:') }}</dt><dd>{{ lot.location }}</dd></div>
            <div><dt>{{ $t('Hərrac tarixi:') }}</dt><dd class="lot-page__blue">{{ formatDate(lot.saleDate) }}</dd></div>
            <div><dt class="lot-page__red">{{ $t('Qalan vaxt:') }}</dt><dd class="lot-page__red">{{ timeLeft }}</dd></div>
            <div><dt>{{ $t('Satış statusu:') }}</dt><dd>{{ $t(status.label) }}</dd></div>
            <div><dt>{{ $t('Təx. bazar dəyəri:') }}</dt><dd>{{ formatUsd(lot.retailValue) }}</dd></div>
          </dl>
        </div>
      </div>

      <div v-if="lot.video" class="card lot-page__video">
        <h2 class="lot-page__box-title">
          <i class="bi bi-play-circle" />
          {{ $t('Video') }}
        </h2>
        <video :src="lot.video" controls preload="none" />
      </div>

      <PriceHistory :lot="lot" class="lot-page__history" />

      <div class="card lot-page__about">
        <h2 class="lot-page__box-title">
          <i class="bi bi-info-circle" />
          {{ $t('Əlavə məlumat') }}
        </h2>
        <div class="lot-page__about-text">
          <p>
            {{ $t('{title} avtomobili {date} tarixində {auction} hərracına çıxarılacaq.', { title: lot.title, date: formatDate(lot.saleDate), auction: lot.auction }) }} Avtomobil hazırda {{ lot.location }} ərazisindədir.
          </p>
          <p>
            {{ $t('Kalkulyatorda təklif etmək istədiyiniz məbləği yazın və çatdırılma ölkəsini seçin — hərrac rüsumu, daşınma və gömrük xərcləri ilə birlikdə yekun qiyməti dərhal görəcəksiniz.') }}
          </p>
          <p>
            {{ $t('Hərracda iştirak etmək üçün bizimlə əlaqə saxlayın. Mütəxəssislərimiz bütün mərhələlər üzrə sizə kömək edəcək.') }}
          </p>
        </div>
      </div>
    </div>

    <CarSection v-if="similarSection.items.length" :section="similarSection" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { auctionTypes, optionLabel, saleStatuses } from '~/data/filters'
import { useFavouritesStore } from '~/stores/favourites'
import { useLotsStore } from '~/stores/lots'
import { formatDate, formatMiles, formatUsd } from '~/utils/format'
import type { CarSection, Lot, SaleStatus } from '~/types'

export default defineComponent({
  name: 'AuctionLotPage',

  setup() {
    const route = useRoute()
    const lot = useLotsStore().lotBySlug(String(route.params.slug))

    if (!lot) {
      throw createError({ statusCode: 404, statusMessage: 'Lot tapılmadı', fatal: true })
    }

    const t = useNuxtApp().$t
    useSeoMeta({
      title: () => t('{0} — Amerikadan gətirmə qiyməti | GLB Logistics', { 0: lot.title }),
      description: () => t('{0}, lot #{1}. Yürüş, zədə, hərrac tarixi və Azərbaycana qədər yekun qiymət.', { 0: lot.title, 1: lot.lotNumber }),
    })
  },

  data() {
    return {
      timeLeft: '—',
      timer: 0,
    }
  },

  computed: {
    ...mapState(useLotsStore, ['lotBySlug', 'similarLots']),
    ...mapState(useFavouritesStore, ['ids']),

    lot(): Lot | undefined {
      return this.lotBySlug(String(this.$route.params.slug))
    },

    status(): SaleStatus {
      return saleStatuses[this.lot!.status] || saleStatuses.minBid!
    },

    auctionTypeLabel(): string {
      return optionLabel(auctionTypes, this.lot!.auctionType)
    },

    favouriteId(): string {
      return `lot-${this.lot!.id}`
    },

    isFavourite(): boolean {
      return this.ids.includes(this.favouriteId)
    },

    breadcrumbs() {
      const lot = this.lot!
      return [
        { label: 'Əsas səhifə', to: '/' },
        { label: 'Hərrac lotları', to: '/auction-lots' },
        { label: lot.make, to: `/auction-lots?makes=${lot.make}` },
        { label: lot.model, to: `/auction-lots?makes=${lot.make}&models=${lot.model}` },
        { label: lot.title },
      ]
    },

    similarSection(): CarSection {
      return {
        id: 'similar',
        type: 'auction',
        title: 'Oxşar',
        highlight: 'Avtomobillər',
        subtitle: 'Seçdiyiniz avtomobilə uyğun digər lotlar',
        moreLink: `/auction-lots?makes=${this.lot!.make}`,
        items: this.similarLots(this.lot!),
      }
    },
  },

  mounted() {
    this.updateTimeLeft()
    this.timer = window.setInterval(this.updateTimeLeft, 60000)
  },

  beforeUnmount() {
    window.clearInterval(this.timer)
  },

  methods: {
    ...mapActions(useFavouritesStore, ['toggle']),
    formatDate,
    formatMiles,
    formatUsd,

    updateTimeLeft() {
      const end = new Date(this.lot!.saleDate.replace(' ', 'T') + ':00Z').getTime()
      const diff = end - Date.now()

      if (diff <= 0) {
        this.timeLeft = this.$t('Hərrac bitib')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const days = Math.floor(minutes / 1440)
      const hours = Math.floor((minutes % 1440) / 60)
      const mins = minutes % 60
      this.timeLeft = days > 0 ? this.$t('{days} gün {hours} saat', { days, hours }) : this.$t('{hours} saat {mins} dəq', { hours, mins })
    },
  },
})
</script>

<style lang="scss" scoped>
.lot-page__history,
.lot-page__video {
  margin-bottom: 20px;
}

.lot-page__video video {
  display: block;
  width: 100%;
  max-height: 480px;
  background-color: $dark;
  border-radius: 0 0 $radius-md $radius-md;
}

.lot-page {
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;

    @include up(md) {
      font-size: 2rem;
    }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    margin-top: 6px;
    font-size: 0.875rem;
    color: $text-soft;

    b {
      font-weight: 500;
      color: $accent-text;
    }
  }

  &__favourite {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 42px;
    padding: 0 16px;
    font-size: 0.9375rem;
    font-weight: 500;
    color: $ink;
    background-color: $white;
    border: 1px solid $line;
    border-radius: $radius;
    transition: border-color $transition, color $transition;

    i {
      color: $danger;
    }

    &:hover,
    &.is-active {
      border-color: $danger;
    }
  }

  &__top,
  &__middle {
    display: grid;
    gap: 20px;
    margin-bottom: 20px;

    @include up(lg) {
      grid-template-columns: 1.4fr 1fr;
      align-items: start;
    }
  }

  &__box-title {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    font-family: $font-body;
    font-size: 1.125rem;
    font-weight: 600;
    border-bottom: 1px solid $line;

    i {
      color: $accent;
    }
  }

  &__list {
    padding: 4px 20px 8px;

    div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 11px 0;
      font-size: 0.875rem;
      border-bottom: 1px solid $line-soft;

      &:last-child {
        border-bottom: 0;
      }
    }

    dt {
      flex-shrink: 0;
      color: $text-soft;
    }

    dd {
      font-weight: 600;
      color: $ink;
      text-align: right;
      word-break: break-word;
    }
  }

  &__green {
    color: $accent-text !important;
  }

  &__blue {
    color: $logo-blue !important;
  }

  &__red {
    color: $danger !important;
  }

  &__about-text {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    font-size: 0.9375rem;
    line-height: 1.7;
  }
}
</style>