import { useAuthStore } from '~/stores/auth'
import type { User } from '~/types'

export default defineNuxtPlugin(() => {
  const options = { default: () => null, maxAge: 60 * 60 * 24 * 30 }
  const tokenCookie = useCookie<string | null>('token', options)
  const userCookie = useCookie<User | null>('user', options)

  const auth = useAuthStore()
  auth.token = tokenCookie.value || ''
  auth.user = auth.token ? userCookie.value || null : null

  auth.$subscribe(() => {
    tokenCookie.value = auth.token || null
    userCookie.value = auth.user
  })

  if (import.meta.client && auth.token) auth.refresh()
})
