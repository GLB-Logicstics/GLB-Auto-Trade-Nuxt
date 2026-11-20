<template>
  <AuthCard
    :title="$t('Qeydiyyat')"
    :text="$t('Hesab yaradın — seçilmişləriniz və müraciətləriniz bir yerdə saxlanılsın.')"
    icon="bi-person-plus"
  >
    <div v-if="!registrationOpen" class="auth-closed">
      <p>{{ $t('Hesabları GLB Logistics komandası yaradır. Bizə yazın — e-poçt və şifrənizi göndərək.') }}</p>
      <a :href="contact.whatsapp" class="btn btn--accent btn--block" target="_blank" rel="noopener">
        <i class="bi bi-whatsapp" />
        {{ $t('WhatsApp ilə yaz') }}
      </a>
      <NuxtLink :to="$lp('/login')" class="btn btn--outline btn--block">{{ $t('Daxil ol') }}</NuxtLink>
    </div>

    <form v-else class="auth-form" novalidate @submit.prevent="submit">
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
        <input v-model="agree" type="checkbox">
        <span> <NuxtLink :to="$lp('/terms')">{{ $t('İstifadə şərtləri') }}</NuxtLink> {{ $t('ilə razıyam') }} </span>
      </label>

      <p v-if="serverError" class="form-error">{{ $t(serverError) }}</p>

      <button type="submit" class="btn btn--accent btn--block" :disabled="!agree || sending">
        {{ sending ? $t('Göndərilir...') : $t('Qeydiyyatdan keç') }}
      </button>

      <p class="auth-form__switch">
        {{ $t('Hesabınız var?') }}
        <NuxtLink :to="$lp('/login')">{{ $t('Daxil olun') }}</NuxtLink>
      </p>
    </form>
  </AuthCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useSiteStore } from '~/stores/site'

export default defineComponent({
  name: 'RegisterPage',

  setup() {
    useSeoMeta({ title: 'Qeydiyyat — GLB Logistics', robots: 'noindex' })
  },

  data() {
    return {
      form: { name: '', email: '', phone: '' },
      password: '',
      agree: false,
      errors: { name: '', email: '', password: '' },
      serverError: '',
      sending: false,
    }
  },

  computed: {
    ...mapState(useSiteStore, ['contact', 'info']),

    registrationOpen(): boolean {
      return !!this.info.registrationOpen
    },
  },

  methods: {
    ...mapActions(useAuthStore, ['register']),

    async submit() {
      this.errors.name = this.form.name.length >= 2 ? '' : 'Adınızı yazın'
      this.errors.email = /\S+@\S+\.\S+/.test(this.form.email) ? '' : 'E-poçt ünvanını düzgün yazın'
      this.errors.password = this.password.length >= 6 ? '' : 'Şifrə ən azı 6 simvol olmalıdır'
      if (this.errors.name || this.errors.email || this.errors.password) return

      this.sending = true
      this.serverError = await this.register({ ...this.form, company: '', password: this.password })
      this.sending = false
      if (!this.serverError) this.$router.push(this.$lp('/profile'))
    },
  },
})
</script>

<style lang="scss" scoped>
.auth-closed {
  display: flex;
  flex-direction: column;
  gap: 12px;

  p {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: $text;
    text-align: center;
  }
}
</style>
