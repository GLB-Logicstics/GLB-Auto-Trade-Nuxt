import { useI18nStore } from '~/stores/i18n'

export default defineNuxtPlugin(() => {
  const i18n = useI18nStore()

  useHead({ htmlAttrs: { lang: () => i18n.lang } })

  return {
    provide: {
      t: (text: string, params?: Record<string, string | number>) => i18n.t(text, params),
      tr: <T extends object>(item: T | null | undefined, field: keyof T & string) => i18n.tr(item, field) as any,
      lp: <T>(to: T) => i18n.localePath(to),
    },
  }
})
