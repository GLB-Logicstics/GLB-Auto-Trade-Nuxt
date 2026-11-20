<template>
  <div v-if="news" class="container">
    <PageHeader
      :title="$tr(news, 'title')"
      :subtitle="news.date"
      :crumbs="[{ label: $t('Xəbərlər'), to: '/information' }, { label: $tr(news, 'title') }]"
    />

    <article class="card news-page">
      <p v-for="(text, index) in $tr(news, 'text')" :key="index">{{ text }}</p>
      <NuxtLink :to="$lp('/information')" class="link-arrow">
        <i class="bi bi-arrow-left" />
        {{ $t('Bütün xəbərlər') }}
      </NuxtLink>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { useSiteStore } from '~/stores/site'
import type { Notification } from '~/types'

export default defineComponent({
  name: 'NewsDetailPage',

  setup() {
    const route = useRoute()
    const news = useSiteStore().newsById(Number(route.params.id))

    if (!news) {
      throw createError({ statusCode: 404, statusMessage: 'Xəbər tapılmadı', fatal: true })
    }

    useSeoMeta({ title: `${news.title} — GLB Logistics`, description: news.text[0] })
  },

  computed: {
    ...mapState(useSiteStore, ['newsById']),

    news(): Notification | undefined {
      return this.newsById(Number(this.$route.params.id))
    },
  },
})
</script>

<style lang="scss" scoped>
.news-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 820px;
  padding: 24px;
  line-height: 1.7;

  @include up(md) {
    padding: 32px;
  }
}
</style>
