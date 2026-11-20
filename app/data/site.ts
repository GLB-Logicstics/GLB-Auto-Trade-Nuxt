import type { BottomNavItem, NavItem, NavLink } from '~/types'

export const mainNav: NavItem[] = [
  { label: 'Əsas səhifə', to: '/' },
  {
    label: 'Auksion',
    children: [
      { label: 'Aktiv lotlar', to: '/auction-lots' },
      { label: 'Yaxın 10 gündə', to: '/auction-lots?upcoming=1' },
      { label: 'İndi al (Buy Now)', to: '/auction-lots?buyNow=1' },
      { label: 'Hibrid avtomobillər', to: '/auction-lots?fuels=Hibrid' },
    ],
  },
  {
    label: 'Satışda',
    children: [
      { label: 'Azərbaycanda', to: '/search?country=aze' },
      { label: 'Gürcüstanda', to: '/search?country=geo' },
      { label: 'Koreyadan', to: '/korea-cars' },
    ],
  },
  {
    label: 'Kalkulyator',
    children: [
      { label: 'Hərrac kalkulyatoru', to: '/auction-calculator' },
      { label: 'Gömrük kalkulyatoru', to: '/customs-calculator' },
      { label: 'Daşınma kalkulyatoru', to: '/shipping-calculator' },
      { label: 'Avtomobil kataloqu', to: '/catalog' },
    ],
  },
  { label: 'Ehtiyat hissələri', to: '/parts' },
  {
    label: 'Xidmətlər',
    children: [
      { label: 'Bütün xidmətlər', to: '/services' },
      { label: 'Avtomobil izləmə', to: '/tracking' },
      { label: 'Diler ol', to: '/dealers' },
    ],
  },
  {
    label: 'Digər',
    children: [
      { label: 'Haqqımızda', to: '/about' },
      { label: 'Əlaqə', to: '/contact' },
      { label: 'Xəbərlər', to: '/information' },
      { label: 'Risklər barədə', to: '/risks' },
    ],
  },
]

export const footerLinks: NavLink[] = [
  { label: 'Hərrac lotları', to: '/auction-lots' },
  { label: 'Satışda olan avtomobillər', to: '/search?country=aze' },
  { label: 'Koreyadan avtomobillər', to: '/korea-cars' },
  { label: 'Ehtiyat hissələri', to: '/parts' },
  { label: 'Hərrac kalkulyatoru', to: '/auction-calculator' },
  { label: 'Xidmətlər', to: '/services' },
]

export const infoLinks: NavLink[] = [
  { label: 'Haqqımızda', to: '/about' },
  { label: 'Əlaqə', to: '/contact' },
  { label: 'Diler ol', to: '/dealers' },
  { label: 'Risklər barədə xəbərdarlıq', to: '/risks' },
  { label: 'İstifadə şərtləri', to: '/terms' },
  { label: 'Məxfilik siyasəti', to: '/privacy' },
]

export const bottomNav: BottomNavItem[] = [
  { label: 'Əsas Səhifə', icon: 'bi-house', to: '/' },
  { label: 'Kalkulyator', icon: 'bi-calculator', to: '/auction-calculator' },
  { label: 'Axtarış', icon: 'bi-search', action: 'search' },
  { label: 'Xəbərlər', icon: 'bi-bell', to: '/information' },
  { label: 'Profil', icon: 'bi-person', to: '/profile' },
]
