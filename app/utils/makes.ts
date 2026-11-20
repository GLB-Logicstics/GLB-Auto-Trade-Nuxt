import type { Make } from '~/types'

export function collectMakes(...lists: { make: string; model: string }[][]): Make[] {
  const map = new Map<string, Set<string>>()
  for (const list of lists) {
    for (const item of list) {
      if (!item.make) continue
      if (!map.has(item.make)) map.set(item.make, new Set())
      if (item.model) map.get(item.make)!.add(item.model)
    }
  }
  return [...map.keys()].sort().map((name) => ({ name, models: [...map.get(name)!].sort() }))
}
