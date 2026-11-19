import type { Option } from '~/types'

export const countries: Option[] = [
  { label: 'Azərbaycan', value: 'az' },
  { label: 'Gürcüstan', value: 'ge' },
]

export const fuelOptions: Option[] = [
  { label: 'Benzin', value: 'Benzin' },
  { label: 'Dizel', value: 'Dizel' },
  { label: 'Hibrid', value: 'Hibrid' },
  { label: 'Elektrik', value: 'Elektrik' },
]

export const documentOptions: Option[] = [
  { label: 'Standart sənəd', value: 'clean' },
  { label: 'Qeyri-standart sənəd', value: 'nonClean' },
  { label: 'Məlumat yoxdur', value: 'unknown' },
]
