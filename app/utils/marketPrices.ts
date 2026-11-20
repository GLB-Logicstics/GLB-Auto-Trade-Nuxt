import type { CatalogItem, LocalCar, MarketPrice } from '~/types'

const catalogCountry: Record<string, string> = { az: 'aze', ge: 'geo' }

function key(country: string, make: string, model: string, year: number | string) {
  return `${country}|${make}|${model}|${year}`.toUpperCase()
}

export function applyMarketPrices(prices: MarketPrice[], catalog: CatalogItem[], cars: LocalCar[]) {
  if (!prices.length) return
  const map = new Map(prices.map((item) => [key(item.country, item.make, item.model, item.year), Number(item.price)]))

  for (const item of catalog) {
    for (const country of ['az', 'ge']) {
      const price = map.get(key(catalogCountry[country]!, item.make, item.model, item.year))
      if (price) item.marketPrices[country] = price
    }
  }

  for (const car of cars) {
    const price = map.get(key(car.country, car.make, car.model, car.year))
    if (price) car.marketPrice = price
  }
}
