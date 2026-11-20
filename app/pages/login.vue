<template>
  <AuthCard
    :title="$t('Daxil ol')"
    :text="$t('Seçilmişlər və müraciətlərinizi görmək üçün hesabınıza daxil olun.')"
    icon="bi-box-arrow-in-right"
  >
    <form class="auth-form" novalidate @submit.prevent="submit">
      <label class="form-field" :class="{ 'has-error': errors.email }">
        <span>{{ $t('E-poçt') }}</span>
        <input v-model.trim="email" type="email" class="form-input" :placeholder="$t('mail@example.com')">
        <small v-if="errors.email" class="form-error">{{ $t(errors.email) }}</small>
      </label>

      <label class="form-field" :class="{ 'has-error': errors.password }">
        <span>{{ $t('Şifrə') }}</span>
        <input v-model="password" type="password" class="form-input" placeholder="••••••">
        <small v-if="errors.password" class="form-error">{{ $t(errors.password) }}</small>
      </label>

      <p v-if="serverError" class="form-error">{{ $t(serverError) }}</p>

      <button type="submit" class="btn btn--accent btn--block" :disabled="sending">
        {{ sending ? $t('Göndərilir...') : $t('Daxil ol') }}
      </button>

      <p class="auth-form__switch">
        {{ $t('Hesabınız yoxdur?') }}
        <NuxtLink to="/register">{{ $t('Qeydiyyatdan keçin') }}</NuxtLink>
      </p>
    </form>
  </AuthCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions } from 'pinia'
import { useAuthStore } from '~/stores/auth'

export default defineComponent({
  name: 'LoginPage',

  setup() {
    useSeoMeta({ title: 'Daxil ol — GLB Logistics', robots: 'noindex' })
  },

  data() {
    return {
      email: '',
      password: '',
      errors: { email: '', password: '' },
      serverError: '',
      sending: false,
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['login']),

    async submit() {
      this.errors.email = /\S+@\S+\.\S+/.test(this.email) ? '' : 'E-poçt ünvanını düzgün yazın'
      this.errors.password = this.password.length >= 6 ? '' : 'Şifrə ən azı 6 simvol olmalıdır'
      if (this.errors.email || this.errors.password) return

      this.sending = true
      this.serverError = await this.login(this.email, this.password)
      this.sending = false
      if (!this.serverError) this.$router.push(String(this.$route.query.redirect || '/profile'))
    },
  },
})
</script>
