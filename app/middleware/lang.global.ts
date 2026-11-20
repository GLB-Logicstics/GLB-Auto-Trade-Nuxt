import { useI18nStore } from '~/stores/i18n'

export default defineNuxtRouteMiddleware((to) => {
  const i18n = useI18nStore()
  const code = typeof to.params.lang === 'string' ? to.params.lang : ''

  if (!code) {
    i18n.lang = i18n.defaultLang
    return
  }

  if (!i18n.hasLanguage(code)) {
    return abortNavigation(createError({ statusCode: 404, statusMessage: 'Page not found' }))
  }

  if (code === i18n.defaultLang) {
    return navigateTo(i18n.pathFor(to.fullPath, code), { redirectCode: 301 })
  }

  i18n.lang = code
})
