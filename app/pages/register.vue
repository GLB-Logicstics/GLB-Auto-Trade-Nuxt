<template>
  <AuthCard
    :title="$t('Qeydiyyat')"
    :text="$t('Hesab yaradın — seçilmişləriniz və müraciətləriniz bir yerdə saxlanılsın.')"
    icon="bi-person-plus"
  >
    <form class="auth-form" novalidate @submit.prevent="submit">
      <label class="form-field" :class="{ 'has-error': errors.name }">
        <span>{{ $t('Ad, soyad') }}</span>
        <input v-model.trim="form.name" type="text" class="form-input">
        <small v-if="errors.name" class="form-error">{{ $t(errors.name) }}</small>
      </label>

      <label class="form-field" :class="{ 'has-error': errors.email }">
        <span>{{ $t('E-poçt') }}</span>
        <input v-model.trim="form.email" type="email" class="form-input" :placeholder="$t('mail@example.com')">
        <small v-if="errors.email" class="form-error">{{ $t(errors.email) }}</small>
      </label>

      <label class="form-field">
        <span>{{ $t('Telefon') }}</span>
        <input v-model.trim="form.phone" type="tel" class="form-input" placeholder="+994 50 000 00 00">
      </label>

      <label class="form-field" :class="{ 'has-error': errors.password }">
        <span>{{ $t('Şifrə') }}</span>
        <input v-model="password" type="password" class="form-input" placeholder="••••••">
        <small v-if="errors.password" class="form-error">{{ $t(errors.password) }}</small>
      </label>

      <label class="checkbox">
        <input v-model="dealer" type="checkbox">
        <span>{{ $t('Diler kimi qeydiyyatdan keçirəm') }}</span>
      </label>

      <label v-if="dealer" class="form-field" :class="{ 'has-error': errors.company }">
        <span>{{ $t('Şirkətin adı') }}</span>
        <input v-model.trim="form.company" type="text" class="form-input">
        <small v-if="errors.company" class="form-error">{{ $t(errors.company) }}</small>
      </label>

      <label class="checkbox">
        <input v-model="agree" type="checkbox">
        <span> <NuxtLink to="/terms">{{ $t('İstifadə şərtləri') }}</NuxtLink> {{ $t('ilə razıyam') }} </span>
      </label>

      <p v-if="serverError" class="form-error">{{ $t(serverError) }}</p>

      <button type="submit" class="btn btn--accent btn--block" :disabled="!agree || sending">
        {{ sending ? $t('Göndərilir...') : $t('Qeydiyyatdan keç') }}
      </button>

      <p class="auth-form__switch">
        {{ $t('Hesabınız var?') }}
        <NuxtLink to="/login">{{ $t('Daxil olun') }}</NuxtLink>
      </p>
    </form>
  </AuthCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions } from 'pinia'
import { useAuthStore } from '~/stores/auth'

export default defineComponent({
  name: 'RegisterPage',

  setup() {
    useSeoMeta({ title: 'Qeydiyyat — GLB Logistics', robots: 'noindex' })
  },

  data() {
    return {
      form: { name: '', email: '', phone: '', company: '' },
      dealer: false,
      password: '',
      agree: false,
      errors: { name: '', email: '', password: '', company: '' },
      serverError: '',
      sending: false,
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['register']),

    async submit() {
      this.errors.name = this.form.name.length >= 2 ? '' : 'Adınızı yazın'
      this.errors.email = /\S+@\S+\.\S+/.test(this.form.email) ? '' : 'E-poçt ünvanını düzgün yazın'
      this.errors.password = this.password.length >= 6 ? '' : 'Şifrə ən azı 6 simvol olmalıdır'
      this.errors.company = this.dealer && !this.form.company ? 'Şirkətin adını yazın' : ''
      if (this.errors.name || this.errors.email || this.errors.password || this.errors.company) return

      this.sending = true
      this.serverError = await this.register({
        ...this.form,
        company: this.dealer ? this.form.company : '',
        password: this.password,
      })
      this.sending = false
      if (!this.serverError) this.$router.push('/profile')
    },
  },
})
</script>
