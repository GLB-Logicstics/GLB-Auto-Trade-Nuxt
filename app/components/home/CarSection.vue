<template>
  <section class="section">
    <div class="container">
      <SectionHeading :title="section.title" :highlight="section.highlight" :subtitle="section.subtitle" />

      <div v-if="section.type === 'korea'" class="car-section__switch">
        <button
          v-for="item in countries"
          :key="item.value"
          type="button"
          :class="{ 'is-active': country === item.value }"
          @click="country = item.value"
        >
          {{ $t(item.label) }}
        </button>
      </div>

      <div class="car-section__slider">
        <UiSwiper :items="section.items" :options="options" variant="cards" navigation pagination>
          <template #default="{ item }">
            <AuctionCarCard v-if="section.type === 'auction'" :car="item" />
            <KoreaCarCard v-else-if="section.type === 'korea'" :car="item" />
            <LocalCarCard v-else :car="item" />
          </template>
        </UiSwiper>
      </div>

      <div class="car-section__more">
        <NuxtLink :to="section.moreLink" class="btn btn--accent car-section__button">
          {{ $t('Hamısına bax') }}
          <i class="bi bi-arrow-right" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { mapWritableState } from 'pinia'
import { countries } from '~/data/calculator'
import { useKoreaStore } from '~/stores/korea'
import type { CarSection } from '~/types'

export default defineComponent({
  name: 'CarSection',

  props: {
    section: { type: Object as PropType<CarSection>, required: true },
  },

  data() {
    return {
      countries,
      options: {
        slidesPerView: 1.1,
        spaceBetween: 16,
        breakpoints: {
          576: { slidesPerView: 1.5 },
          768: { slidesPerView: 2, spaceBetween: 24 },
          992: { slidesPerView: 3, spaceBetween: 24 },
        },
      },
    }
  },

  computed: {
    ...mapWritableState(useKoreaStore, ['country']),
  },
})
</script>

<style lang="scss" scoped>
.car-section {
  &__slider {
    @include up(lg) {
      max-width: $container-narrow;
      margin: 0 auto;
    }
  }

  &__switch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 320px;
    padding: 4px;
    margin: 0 auto 20px;
    background-color: $white;
    border: 1px solid $line;
    border-radius: $radius;

    button {
      height: 38px;
      font-size: 0.875rem;
      font-weight: 500;
      color: $text-soft;
      border-radius: $radius-sm;

      &.is-active {
        color: $white;
        background-color: $accent;
      }
    }
  }

  &__more {
    display: flex;
    justify-content: center;
    margin-top: 28px;

    @include up(lg) {
      margin-top: 36px;
    }
  }

  &__button {
    width: 100%;
    max-width: 320px;
  }
}
</style>
