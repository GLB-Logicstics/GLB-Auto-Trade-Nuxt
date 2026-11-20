import { useI18nStore } from '~/stores/i18n'

export default defineNuxtPlugin(() => {
  const i18n = useI18nStore()
  const cookie = useCookie<string>('lang', {
    default: () => '',
    maxAge: 60 * 60 * 24 * 365,
  })

  if (cookie.value) i18n.setLanguage(cookie.value)

  i18n.$subscribe(() => {
    cookie.value = i18n.lang
  })

  useHead({ htmlAttrs: { lang: () => i18n.lang } })

  return {
    provide: {
      t: (text: string, params?: Record<string, string | number>) => i18n.t(text, params),
      tr: <T extends object>(item: T | null | undefined, field: keyof T & string) => i18n.tr(item, field) as any,
    },
  }
})
