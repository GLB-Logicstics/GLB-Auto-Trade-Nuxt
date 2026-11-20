<template>
  <div class="card request-form">
    <h2 class="request-form__title">
      <i class="bi bi-send" />
      {{ $t(title) }}
    </h2>

    <div v-if="sent" class="request-form__body">
      <p class="form-success">
        <i class="bi bi-check-circle" />
        {{ $t('Müraciətiniz qəbul edildi. Əməkdaşımız qısa zamanda sizinlə əlaqə saxlayacaq.') }}
      </p>
      <a :href="whatsappHref(whatsappText)" class="btn btn--whatsapp" target="_blank" rel="noopener">
        <i class="bi bi-whatsapp" />
        {{ $t('WhatsApp ilə davam et') }}
      </a>
      <button type="button" class="request-form__again" @click="reset">{{ $t('Yeni müraciət') }}</button>
    </div>

    <form v-else class="request-form__body" novalidate @submit.prevent="submit">
      <div class="form-grid">
        <label class="form-field" :class="{ 'has-error': errors.name }">
          <span>{{ $t('Ad, soyad *') }}</span>
          <input v-model.trim="form.name" type="text" class="form-input" :placeholder="$t('Adınız')">
          <small v-if="errors.name" class="form-error">{{ $t(errors.name) }}</small>
        </label>

        <label class="form-field" :class="{ 'has-error': errors.phone }">
          <span>{{ $t('Telefon *') }}</span>
          <input v-model.trim="form.phone" type="tel" class="form-input" placeholder="+994 50 000 00 00">
          <small v-if="errors.phone" class="form-error">{{ $t(errors.phone) }}</small>
        </label>

        <label class="form-field is-wide">
          <span>{{ $t('Mesaj') }}</span>
          <textarea v-model.trim="form.message" class="form-input form-textarea" :placeholder="$t(placeholder)" />
        </label>
      </div>

      <p v-if="failed" class="form-error">{{ $t('Müraciət göndərilmədi. Bir az sonra yenidən cəhd edin və ya WhatsApp ilə yazın.') }}</p>

      <button type="submit" class="btn btn--accent" :disabled="sending">
        <i class="bi bi-send" />
        {{ sending ? $t('Göndərilir...') : $t('Göndər') }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useRequestsStore } from '~/stores/requests'
import { useSiteStore } from '~/stores/site'

export default defineComponent({
  name: 'RequestForm',

  props: {
    subject: { type: String, default: 'Ümumi müraciət' },
    title: { type: String, default: 'Müraciət göndər' },
    placeholder: { type: String, default: 'Sualınızı və ya istəyinizi yazın' },
  },

  data() {
    const user = useAuthStore().user
    return {
      form: { name: user ? user.name : '', phone: user ? user.phone : '', message: '' },
      errors: { name: '', phone: '' },
      sent: false,
      sending: false,
      failed: false,
    }
  },

  computed: {
    ...mapState(useSiteStore, ['whatsappHref']),

    whatsappText(): string {
      return `Salam! ${this.subject}. ${this.form.message}`.trim()
    },
  },

  methods: {
    ...mapActions(useRequestsStore, ['send']),

    async submit() {
      this.errors.name = this.form.name.length < 2 ? 'Adınızı yazın' : ''
      this.errors.phone = this.form.phone.replace(/\D/g, '').length < 9 ? 'Telefon nömrəsini düzgün yazın' : ''
      if (this.errors.name || this.errors.phone) return

      this.sending = true
      const user = useAuthStore().user
      this.sent = await this.send({ subject: this.subject, ...this.form, email: user ? user.email : '' })
      this.failed = !this.sent
      this.sending = false
    },

    reset() {
      this.form = { name: '', phone: '', message: '' }
      this.sent = false
    },
  },
})
</script>

<style lang="scss" scoped>
.request-form {
  &__title {
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

  &__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  &__again {
    font-weight: 500;
    color: $accent-text;
  }
}
</style>
