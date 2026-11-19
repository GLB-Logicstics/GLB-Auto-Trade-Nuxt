import type { Tariffs } from '~/types'

export const tariffs: Tariffs = {
  aznRate: 1.7,
  gelToUsd: 0,
  potiBakuPrice: 0,
  gateFee: { clean: 0, nonClean: 0 },
  fedexFee: 0,
  serviceFee: 0,
  highBidFrom: 15000,
  copartCleanFees: [],
  copartNonCleanFees: [],
  copartHighBidPercent: { clean: 0, nonClean: 0 },
  liveBidFees: [],
  unknownDocFees: [],
  unknownDocHighBid: { percent: 0, fixed: 0 },
  geFixedFees: 0,
  extraCosts: [],
  koreaShipping: {},
}

export const shippingPrices: Record<string, Record<string, number>> = {}

export function setTariffs(value: Partial<Tariffs>) {
  Object.assign(tariffs, value)
}

export function setShippingPrices(value: Record<string, Record<string, number>>) {
  for (const key of Object.keys(shippingPrices)) delete shippingPrices[key]
  Object.assign(shippingPrices, value)
}
