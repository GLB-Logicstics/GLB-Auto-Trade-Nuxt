<template>
  <AuthCard
    v-if="!user"
    :title="$t('Profil')"
    :text="$t('Profilinizi görmək üçün daxil olun və ya qeydiyyatdan keçin.')"
    icon="bi-person"
  >
    <NuxtLink to="/login" class="btn btn--accent btn--block">{{ $t('Daxil ol') }}</NuxtLink>
    <NuxtLink to="/register" class="btn btn--outline btn--block">{{ $t('Qeydiyyat') }}</NuxtLink>
  </AuthCard>

  <div v-else class="container">
    <PageHeader
      :title="$t('Salam, {name}!', { name: firstName })"
      :subtitle="$t('Hesab məlumatlarınız və müraciətləriniz.')"
      :crumbs="[{ label: $t('Profil') }]"
    />

    <div class="two-col">
      <div class="profile-page__main">
        <div class="card">
          <h2 class="panel__title">
            <i class="bi bi-person-vcard" />
            {{ $t('Hesab məlumatları') }}
          </h2>
          <div class="panel__body">
            <dl class="info-list">
              <div>
                <dt>{{ $t('Ad') }}</dt>
                <dd>{{ user.name }}</dd>
              </div>
              <div>
                <dt>{{ $t('E-poçt') }}</dt>
                <dd>{{ user.email }}</dd>
              </div>
              <div>
                <dt>{{ $t('Telefon') }}</dt>
                <dd>{{ user.phone || '—' }}</dd>
              </div>
              <div v-if="user.company">
                <dt>{{ $t('Şirkət') }}</dt>
                <dd>{{ user.company }}</dd>
              </div>
            </dl>
            <button type="button" class="btn btn--outline btn--sm" @click="signOut">
              <i class="bi bi-box-arrow-right" />
              {{ $t('Çıxış') }}
            </button>
          </div>
        </div>

        <div class="card">
          <h2 class="panel__title">
            <i class="bi bi-send" />
            {{ $t('Müraciətlərim') }}
          </h2>
          <div class="panel__body">
            <p v-if="loading" class="profile-page__empty">{{ $t('Yüklənir...') }}</p>
            <p v-else-if="!requests.length" class="profile-page__empty">{{ $t('Hələ müraciət göndərməmisiniz.') }}</p>
            <ul v-else class="profile-page__requests">
              <li v-for="item in requests" :key="item.id">
                <strong>{{ item.subject }}</strong>
                <span>{{ formatDate(item.created_at) }} · {{ $t(statusLabel(item.status)) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="profile-page__main">
        <div v-if="isDealer" class="card">
          <h2 class="panel__title">
            <i class="bi bi-shop" />
            {{ $t('Diler kabineti') }}
          </h2>
          <div class="panel__body">
            <p v-if="user.dealerStatus === 'pending'" class="profile-page__notice">
              {{ $t('Diler hesabınız yoxlanılır. Təsdiqdən sonra avtomobil əlavə edə biləcəksiniz.') }}
            </p>
            <p v-else-if="user.dealerStatus === 'rejected'" class="profile-page__notice is-error">
              {{ $t('Diler müraciətiniz təsdiqlənmədi. Ətraflı məlumat üçün bizimlə əlaqə saxlayın.') }}
            </p>
            <NuxtLink v-else to="/cabinet" class="profile-page__link">
              <i class="bi bi-car-front" />
              {{ $t('Avtomobillərim') }}
              <i class="bi bi-arrow-right" />
            </NuxtLink>
          </div>
        </div>

        <div class="card">
          <h2 class="panel__title">
            <i class="bi bi-grid" />
            {{ $t('Qısa keçidlər') }}
          </h2>
          <div class="panel__body">
            <NuxtLink to="/favourite" class="profile-page__link">
              <i class="bi bi-heart" />
              {{ $t('Seçilmişlər') }}
              <b>{{ ids.length }}</b>
            </NuxtLink>
            <NuxtLink to="/auction-calculator" class="profile-page__link">
              <i class="bi bi-calculator" />
              {{ $t('Hərrac kalkulyatoru') }}
            </NuxtLink>
            <NuxtLink to="/tracking" class="profile-page__link">
              <i class="bi bi-geo" />
              {{ $t('Avtomobil izləmə') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useFavouritesStore } from '~/stores/favourites'
import { requestStatuses, useRequestsStore } from '~/stores/requests'
import { formatDate } from '~/utils/format'

export default defineComponent({
  name: 'ProfilePage',

  setup() {
    useSeoMeta({ title: 'Profil — GLB Logistics', robots: 'noindex' })
  },

  computed: {
    ...mapState(useAuthStore, ['user', 'firstName', 'isDealer']),
    ...mapState(useFavouritesStore, ['ids']),
    ...mapState(useRequestsStore, { requests: 'items', loading: 'loading' }),
  },

  mounted() {
    if (!this.user) return
    this.refresh()
    this.load()
  },

  methods: {
    ...mapActions(useAuthStore, ['logout', 'refresh']),
    ...mapActions(useRequestsStore, ['load']),

    statusLabel(status: string) {
      return requestStatuses[status] || status
    },

    formatDate(value: string) {
      return formatDate(value.slice(0, 16).replace('T', ' '))
    },

    signOut() {
      this.logout()
      this.$router.push('/')
    },
  },
})
</script>

<style lang="scss" scoped>
.profile-page {
  &__main {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__empty {
    font-size: 0.875rem;
    color: $text-soft;
  }

  &__requests li {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 0;
    font-size: 0.875rem;
    border-bottom: 1px solid $line-soft;

    span {
      font-size: 0.75rem;
      color: $muted;
    }
  }

  &__notice {
    padding: 12px;
    font-size: 0.875rem;
    color: $ink;
    background-color: $surface;
    border-radius: $radius;

    &.is-error {
      color: $danger;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    font-weight: 500;
    color: $ink;
    border: 1px solid $line;
    border-radius: $radius;
    transition: border-color $transition;

    &:hover {
      border-color: $accent;
    }

    i {
      color: $accent;
    }

    b {
      margin-left: auto;
      color: $accent-text;
    }
  }
}
</style>
