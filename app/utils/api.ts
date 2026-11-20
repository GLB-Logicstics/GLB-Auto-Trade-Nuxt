import { useAuthStore } from '~/stores/auth'

export function apiFetch<T>(path: string, options: Parameters<typeof $fetch>[1] = {}) {
  const token = useAuthStore().token
  return $fetch<T>(path, {
    ...options,
    baseURL: useRuntimeConfig().public.apiBase,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  } as Parameters<typeof $fetch>[1]) as Promise<T>
}

export function apiMessage(error: unknown, fallback = 'Xəta baş verdi') {
  const data = (error as { data?: { message?: string } })?.data
  return (data && data.message) || fallback
}

export function trackClick(carId: number, type: 'whatsapp' | 'phone') {
  apiFetch('/public/clicks', { method: 'POST', body: { carId, type } }).catch(() => {})
}
