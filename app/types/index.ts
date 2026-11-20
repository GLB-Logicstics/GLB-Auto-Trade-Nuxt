export interface NavLink {
  label: string
  to: string
}

export interface NavItem {
  label: string
  to?: string
  children?: NavLink[]
}

export interface SocialLink {
  name: string
  label: string
  icon: string
  href: string
}

export interface Language {
  code: string
  label: string
  name: string
}

export interface BottomNavItem {
  label: string
  icon: string
  to?: string
  action?: 'search'
}

export interface Notification {
  id: number
  title: string
  date: string
  text: string[]
}

export interface ContactInfo {
  phone: string
  phoneDisplay: string
  whatsapp: string
  email: string
  address: string
  workingHours: string
}

export interface SiteInfo {
  name: string
  logo: string
  logoDark: string
  about: string
  contact: ContactInfo
}

export interface HeroSlide {
  id: number
  title: string
  description: string
}

export interface Brand {
  name: string
  logo: string
}

export interface Make {
  name: string
  models: string[]
}

export interface Option {
  label: string
  value: string
}

export interface SaleStatus {
  label: string
  reserve: string
  color: string
  icon: string
}

export interface Lot {
  id: number
  slug: string
  lotNumber: string
  vin: string
  title: string
  make: string
  model: string
  year: number
  odometer: number
  odometerType: string
  retailValue: number
  status: string
  saleDate: string
  location: string
  auction: string
  auctionType: string
  video: string
  addedAt: string
  document: 'Standart sənəd' | 'Qeyri-standart sənəd' | 'Məlumat yoxdur'
  primaryDamage: string
  secondaryDamage: string
  hasKeys: boolean
  fuel: string
  transmission: string
  drive: string
  color: string
  bodyType: string
  engine: string
  currentBid: number
  buyNowPrice: number
  condition: string
  popular: boolean
  images: string[]
}

export interface LocalCar {
  id: number
  slug: string
  title: string
  version: string
  make: string
  model: string
  year: number
  vin: string
  bodyType: string
  color: string
  image: string
  images: string[]
  sold: boolean
  price: number
  oldPrice: number
  fuel: string
  mileage: string
  odometer: number
  country: string
  city: string
  marketPrice: number
  dealer: Dealer
  engine: string
  power: number
  transmission: string
  drive: string
  location: string
  features: string[]
  description: string[]
}

export interface Dealer {
  name: string
  phone: string
  phoneDisplay: string
}

export interface KoreaCar {
  id: number
  slug: string
  title: string
  make: string
  model: string
  year: number
  image: string
  price: number
  fuel: string
  mileage: string
  engine: string
  engineCc: number
  transmission: string
  location: string
}

export interface CarSection {
  id: string
  type: 'auction' | 'local' | 'korea'
  title: string
  highlight: string
  subtitle: string
  moreLink: string
  items: Lot[] | LocalCar[] | KoreaCar[]
}

export interface Part {
  id: number
  title: string
  make: string
  model: string
  yearFrom: number
  yearTo: number
  type: string
  condition: string
  price: number
  location: string
}

export interface PartType {
  label: string
  value: string
  icon: string
}

export interface CatalogItem {
  make: string
  model: string
  year: number
  engineCc: number
  fuel: string
  location: string
  auctionPrice: number
  marketPrices: Record<string, number>
}

export interface Service {
  slug: string
  title: string
  icon: string
  short: string
  description: string[]
  steps: string[]
}

export interface InfoSection {
  title: string
  text: string[]
}

export interface InfoPage {
  slug: string
  title: string
  subtitle: string
  sections: InfoSection[]
}

export interface PricePoint {
  label: string
  price: number
}

export interface TrackingStep {
  title: string
  date: string
  done: boolean
}

export interface RequestItem {
  id: number
  subject: string
  name: string
  phone: string
  email?: string
  message: string
  date: string
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: 'user' | 'dealer'
  company: string
  dealerStatus: '' | 'pending' | 'approved' | 'rejected'
}

export interface UserRequest {
  id: number
  subject: string
  message: string
  status: string
  created_at: string
}

export interface DealerCar {
  id: number
  slug: string
  isActive: boolean
  clicks: number
  clicksMonth: number
  data: Partial<LocalCar>
}

export interface CostLine {
  label: string
  value: number
  note?: string
}

export interface ExtraCost {
  id: string
  label: string
  price: number
}

export interface Suggestion {
  title: string
  subtitle: string
  to: string
}

export interface LotFilters {
  q: string
  added: string[]
  auctions: string[]
  auctionTypes: string[]
  locations: string[]
  makes: string[]
  models: string[]
  engines: string[]
  fuels: string[]
  colors: string[]
  damages: string[]
  secondaryDamages: string[]
  transmissions: string[]
  cylinders: string[]
  bodies: string[]
  vehicleTypes: string[]
  drives: string[]
  documents: string[]
  saleFrom: string
  saleTo: string
  yearFrom: string
  yearTo: string
  mileageFrom: string
  mileageTo: string
  priceFrom: string
  priceTo: string
  buyNow: boolean
  runs: boolean
  cleanTitle: boolean
  today: boolean
  tomorrow: boolean
  upcoming: boolean
}

export interface CarFilters {
  country: string
  city: string
  makes: string[]
  models: string[]
  engines: string[]
  transmissions: string[]
  fuels: string[]
  bodies: string[]
  colors: string[]
  drives: string[]
  locations: string[]
  yearFrom: string
  yearTo: string
  mileageFrom: string
  mileageTo: string
  priceFrom: string
  priceTo: string
}
export interface Tariffs {
  aznRate: number
  gelToUsd: number
  potiBakuPrice: number
  gateFee: { clean: number; nonClean: number }
  fedexFee: number
  serviceFee: number
  highBidFrom: number
  copartCleanFees: number[][]
  copartNonCleanFees: number[][]
  copartHighBidPercent: { clean: number; nonClean: number }
  liveBidFees: number[][]
  unknownDocFees: number[][]
  unknownDocHighBid: { percent: number; fixed: number }
  geFixedFees: number
  extraCosts: ExtraCost[]
  koreaShipping: Record<string, number>
}

export interface SiteSettings extends SiteInfo {
  socialLinks: SocialLink[]
}

export interface Bootstrap {
  lots: Lot[]
  cars: LocalCar[]
  korea_cars: KoreaCar[]
  parts: Part[]
  catalog: CatalogItem[]
  services: Service[]
  pages: InfoPage[]
  news: Notification[]
  hero_slides: HeroSlide[]
  brands: Brand[]
  part_types: PartType[]
  shipping: Record<string, Record<string, number>>
  languages: { code: string; name: string; isDefault: boolean }[]
  translations: Record<string, Record<string, string>>
  marketPrices: MarketPrice[]
  settings: {
    menus?: { main: NavItem[]; footer: NavLink[]; info: NavLink[] }
    locations?: Record<string, string[]>
    site?: SiteSettings
    tariffs?: Tariffs
    price_history?: Record<string, PricePoint[]>
    tracking_sample?: { code: string; title: string; steps: TrackingStep[] }
  }
}

export interface MarketPrice {
  country: string
  make: string
  model: string
  year: number
  price: number
}
