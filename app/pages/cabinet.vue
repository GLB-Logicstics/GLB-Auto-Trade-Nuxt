<template>
  <AuthCard
    v-if="!dealerApproved"
    :title="$t('Diler kabineti')"
    :text="$t('Bu bölmə yalnız təsdiqlənmiş dilerlər üçündür.')"
    icon="bi-shop"
  >
    <NuxtLink :to="loggedIn ? '/profile' : '/login'" class="btn btn--accent btn--block">
      {{ loggedIn ? $t('Profilə keç') : $t('Daxil ol') }}
    </NuxtLink>
  </AuthCard>

  <div v-else class="container">
    <PageHeader
      :title="$t('Diler kabineti')"
      :subtitle="$t('Avtomobillərinizi əlavə edin, baxış və WhatsApp kliklərini izləyin.')"
      :crumbs="[{ label: $t('Profil'), to: '/profile' }, { label: $t('Diler kabineti') }]"
    />

    <div class="cabinet__stats">
      <div class="card cabinet__stat">
        <span>{{ $t('Avtomobillər') }}</span>
        <strong>{{ cars.length }}</strong>
      </div>
      <div class="card cabinet__stat">
        <span>{{ $t('Saytda görünür') }}</span>
        <strong>{{ activeCount }}</strong>
      </div>
      <div class="card cabinet__stat">
        <span>{{ $t('Kliklər (30 gün)') }}</span>
        <strong>{{ monthClicks }}</strong>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <h2 class="panel__title">
          <i class="bi bi-car-front" />
          {{ $t('Avtomobillərim') }}
        </h2>
        <div class="panel__body">
          <p v-if="loading" class="cabinet__empty">{{ $t('Yüklənir...') }}</p>
          <p v-else-if="!cars.length" class="cabinet__empty">{{ $t('Hələ avtomobil əlavə etməmisiniz.') }}</p>
          <ul v-else class="cabinet__list">
            <li v-for="car in cars" :key="car.id" :class="{ 'is-editing': editId === car.id }">
              <img :src="car.data.image || placeholder" :alt="car.data.title" width="96" height="72">
              <div class="cabinet__info">
                <strong>{{ car.data.year }} {{ car.data.title }}</strong>
                <span>{{ formatUsd(car.data.price || 0) }} · {{ car.data.city }}</span>
                <span :class="['cabinet__status', car.isActive ? 'is-active' : 'is-pending']">
                  {{ car.isActive ? $t('Saytda görünür') : $t('Yoxlamadadır') }}
                </span>
                <span class="cabinet__clicks">
                  <i class="bi bi-whatsapp" />
                  {{ $t('{total} klik, son 30 gündə {month}', { total: car.clicks, month: car.clicksMonth }) }}
                </span>
              </div>
              <div class="cabinet__actions">
                <button type="button" :aria-label="$t('Redaktə et')" @click="startEdit(car)"><i class="bi bi-pencil" /></button>
                <button type="button" :aria-label="$t('Sil')" @click="remove(car)"><i class="bi bi-trash" /></button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="card">
        <h2 class="panel__title">
          <i :class="['bi', editId ? 'bi-pencil-square' : 'bi-plus-circle']" />
          {{ editId ? $t('Avtomobili redaktə et') : $t('Yeni avtomobil') }}
        </h2>
        <form class="panel__body" novalidate @submit.prevent="save">
          <div class="form-grid">
            <label class="form-field">
              <span>{{ $t('Marka') }} *</span>
              <input v-model.trim="form.make" type="text" class="form-input" placeholder="BMW">
            </label>
            <label class="form-field">
              <span>{{ $t('Model') }} *</span>
              <input v-model.trim="form.model" type="text" class="form-input" placeholder="X5">
            </label>
            <label class="form-field">
              <span>{{ $t('Versiya') }}</span>
              <input v-model.trim="form.version" type="text" class="form-input" placeholder="sDrive40i">
            </label>
            <label class="form-field">
              <span>{{ $t('İl') }} *</span>
              <input v-model.number="form.year" type="number" class="form-input" min="1990" max="2027">
            </label>
            <label class="form-field">
              <span>{{ $t('Qiymət (USD)') }} *</span>
              <input v-model.number="form.price" type="number" class="form-input" min="0">
            </label>
            <label class="form-field">
              <span>{{ $t('Yürüş (km)') }}</span>
              <input v-model.number="form.odometer" type="number" class="form-input" min="0">
            </label>
            <div class="form-field">
              <span>{{ $t('Yanacaq') }}</span>
              <BaseSelect v-model="form.fuel" :options="fuels" :clearable="false" />
            </div>
            <div class="form-field">
              <span>{{ $t('Sürət qutusu') }}</span>
              <BaseSelect v-model="form.transmission" :options="transmissions" :clearable="false" />
            </div>
            <div class="form-field">
              <span>{{ $t('Ötürücü') }}</span>
              <BaseSelect v-model="form.drive" :options="drives" :clearable="false" />
            </div>
            <label class="form-field">
              <span>{{ $t('Ban növü') }}</span>
              <input v-model.trim="form.bodyType" type="text" class="form-input" placeholder="SUV">
            </label>
            <label class="form-field">
              <span>{{ $t('Rəng') }}</span>
              <input v-model.trim="form.color" type="text" class="form-input">
            </label>
            <label class="form-field">
              <span>{{ $t('Mühərrik') }}</span>
              <input v-model.trim="form.engine" type="text" class="form-input" placeholder="3.0L">
            </label>
            <label class="form-field">
              <span>{{ $t('Güc (a.g.)') }}</span>
              <input v-model.number="form.power" type="number" class="form-input" min="0">
            </label>
            <label class="form-field">
              <span>VIN</span>
              <input v-model.trim="form.vin" type="text" class="form-input">
            </label>
            <div class="form-field">
              <span>{{ $t('Ölkə') }}</span>
              <BaseSelect :model-value="form.country" :options="countries" :clearable="false" @update:model-value="setCountry" />
            </div>
            <div class="form-field">
              <span>{{ $t('Şəhər') }}</span>
              <BaseSelect v-model="form.city" :options="cityOptions(form.country)" :clearable="false" />
            </div>
            <label class="form-field is-wide">
              <span>{{ $t('Təsvir') }}</span>
              <textarea v-model="description" class="form-input form-textarea" :placeholder="$t('Hər abzas yeni sətirdən')" />
            </label>
            <label class="form-field is-wide">
              <span>{{ $t('Xüsusiyyətlər') }}</span>
              <input v-model="features" type="text" class="form-input" :placeholder="$t('Vergüllə ayırın: Dəri salon, Panoramik lyuk')">
            </label>
            <div class="form-field is-wide">
              <span>{{ $t('Şəkillər') }}</span>
              <div class="cabinet__images">
                <div v-for="(image, index) in form.images" :key="image" class="cabinet__image">
                  <img :src="image" alt="" width="96" height="72">
                  <button type="button" :aria-label="$t('Sil')" @click="form.images.splice(index, 1)"><i class="bi bi-x" /></button>
                </div>
                <label class="cabinet__upload">
                  <i :class="['bi', uploading ? 'bi-hourglass-split' : 'bi-upload']" />
                  <input type="file" accept="image/*" multiple @change="upload">
                </label>
              </div>
            </div>
            <label class="checkbox is-wide">
              <input v-model="form.sold" type="checkbox">
              <span>{{ $t('Satılıb') }}</span>
            </label>
          </div>

          <p v-if="error" class="form-error">{{ $t(error) }}</p>
          <p v-if="saved" class="form-success">
            <i class="bi bi-check-circle" />
            {{ $t('Yadda saxlanıldı. Admin yoxladıqdan sonra avtomobil saytda görünəcək.') }}
          </p>

          <div class="cabinet__buttons">
            <button type="submit" class="btn btn--accent" :disabled="saving">
              {{ saving ? $t('Göndərilir...') : $t('Yadda saxla') }}
            </button>
            <button v-if="editId" type="button" class="btn btn--outline" @click="resetForm">{{ $t('Ləğv et') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { countries } from '~/data/filters'
import { useAuthStore } from '~/stores/auth'
import { useSiteStore } from '~/stores/site'
import { apiFetch, apiMessage } from '~/utils/api'
import { formatUsd, PLACEHOLDER_IMAGE } from '~/utils/format'
import { readFileAsDataUrl } from '~/utils/image'
import type { DealerCar, Option } from '~/types'

function list(values: string[]): Option[] {
  return values.map((value) => ({ label: value, value }))
}

function emptyCar() {
  return {
    make: '',
    model: '',
    version: '',
    year: new Date().getFullYear(),
    price: 0,
    odometer: 0,
    fuel: 'Benzin',
    transmission: 'Avtomat',
    drive: 'Ön',
    bodyType: '',
    color: '',
    engine: '',
    power: 0,
    vin: '',
    country: 'aze',
    city: '',
    images: [] as string[],
    sold: false,
  }
}

export default defineComponent({
  name: 'CabinetPage',

  setup() {
    useSeoMeta({ title: 'Diler kabineti — GLB Logistics', robots: 'noindex' })
  },

  data() {
    return {
      cars: [] as DealerCar[],
      loading: false,
      form: emptyCar(),
      description: '',
      features: '',
      editId: 0,
      saving: false,
      saved: false,
      uploading: false,
      error: '',
      countries,
      fuels: list(['Benzin', 'Dizel', 'Hibrid', 'Elektrik']),
      transmissions: list(['Avtomat', 'Mexaniki', 'Variator', 'Robot']),
      drives: list(['Ön', 'Arxa', 'Tam']),
      placeholder: PLACEHOLDER_IMAGE,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['loggedIn', 'dealerApproved']),
    ...mapState(useSiteStore, ['cityOptions']),

    activeCount(): number {
      return this.cars.filter((car) => car.isActive).length
    },

    monthClicks(): number {
      return this.cars.reduce((sum, car) => sum + car.clicksMonth, 0)
    },
  },

  mounted() {
    if (this.dealerApproved) this.load()
  },

  methods: {
    formatUsd,

    async load() {
      this.loading = true
      try {
        this.cars = await apiFetch<DealerCar[]>('/user/cars')
      } catch (error) {
        this.error = apiMessage(error)
      }
      this.loading = false
    },

    setCountry(value: string) {
      this.form.country = value
      this.form.city = ''
    },

    startEdit(car: DealerCar) {
      const data = car.data
      this.form = { ...emptyCar(), ...data, images: [...(data.images || [])] } as ReturnType<typeof emptyCar>
      this.description = (data.description || []).join('\n')
      this.features = (data.features || []).join(', ')
      this.editId = car.id
      this.saved = false
      this.error = ''
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    resetForm() {
      this.form = emptyCar()
      this.description = ''
      this.features = ''
      this.editId = 0
      this.error = ''
    },

    async upload(event: Event) {
      const input = event.target as HTMLInputElement
      const files = [...(input.files || [])]
      this.uploading = true
      for (const file of files) {
        try {
          const data = await readFileAsDataUrl(file)
          const result = await apiFetch<{ url: string }>('/user/upload', { method: 'POST', body: { name: file.name, data } })
          this.form.images.push(result.url)
        } catch (error) {
          this.error = apiMessage(error)
        }
      }
      this.uploading = false
      input.value = ''
    },

    async save() {
      this.error = ''
      this.saved = false
      if (!this.form.make || !this.form.model || !this.form.year || !this.form.price) {
        this.error = 'Marka, model, il və qiyməti yazın'
        return
      }

      const data = {
        ...this.form,
        title: [this.form.make, this.form.model, this.form.version].filter(Boolean).join(' '),
        mileage: `${this.form.odometer.toLocaleString('en-US')} km`,
        location: [this.form.city, countries.find((item) => item.value === this.form.country)?.label].filter(Boolean).join(', '),
        image: this.form.images[0] || '',
        description: this.description.split('\n').map((line) => line.trim()).filter(Boolean),
        features: this.features.split(',').map((item) => item.trim()).filter(Boolean),
      }

      this.saving = true
      try {
        if (this.editId) await apiFetch(`/user/cars/${this.editId}`, { method: 'PUT', body: { data } })
        else await apiFetch('/user/cars', { method: 'POST', body: { data } })
        this.saved = true
        this.resetForm()
        await this.load()
      } catch (error) {
        this.error = apiMessage(error)
      }
      this.saving = false
    },

    async remove(car: DealerCar) {
      if (!window.confirm(this.$t('Bu avtomobil silinsin?'))) return
      try {
        await apiFetch(`/user/cars/${car.id}`, { method: 'DELETE' })
        this.cars = this.cars.filter((item) => item.id !== car.id)
        if (this.editId === car.id) this.resetForm()
      } catch (error) {
        this.error = apiMessage(error)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.cabinet {
  &__stats {
    display: grid;
    gap: 16px;
    margin-bottom: 20px;

    @include up(sm) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px 20px;

    span {
      font-size: 0.875rem;
      color: $text-soft;
    }

    strong {
      font-size: 1.5rem;
      color: $ink;
    }
  }

  &__empty {
    font-size: 0.875rem;
    color: $text-soft;
  }

  &__list li {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid $line-soft;

    &.is-editing {
      background-color: $accent-soft;
    }

    img {
      flex-shrink: 0;
      width: 96px;
      height: 72px;
      object-fit: cover;
      border-radius: $radius-sm;
    }
  }

  &__info {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    font-size: 0.875rem;

    strong {
      color: $ink;
    }

    span {
      color: $text-soft;
    }
  }

  &__status {
    align-self: flex-start;
    padding: 2px 8px;
    font-size: 0.75rem;
    border-radius: $radius-sm;

    &.is-active {
      color: $accent-text;
      background-color: $accent-soft;
    }

    &.is-pending {
      color: $danger;
      background-color: $danger-soft;
    }
  }

  &__clicks i {
    color: $accent;
  }

  &__actions {
    display: flex;
    gap: 6px;

    button {
      width: 36px;
      height: 36px;
      color: $text;
      border: 1px solid $line;
      border-radius: $radius;

      &:hover {
        color: $accent-text;
        border-color: $accent;
      }
    }
  }

  &__images {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__image {
    position: relative;

    img {
      width: 96px;
      height: 72px;
      object-fit: cover;
      border-radius: $radius-sm;
    }

    button {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 22px;
      height: 22px;
      color: $white;
      background-color: rgba(22, 32, 44, 0.7);
      border-radius: 50%;
    }
  }

  &__upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 72px;
    font-size: 20px;
    color: $accent-text;
    cursor: pointer;
    border: 1px dashed $accent;
    border-radius: $radius-sm;

    input {
      display: none;
    }
  }

  &__buttons {
    display: flex;
    gap: 10px;
  }
}
</style>
