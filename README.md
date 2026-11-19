# GLB Auto Trade — Nuxt 4

```bash
npm install
npm run dev
```

## Səhifələr

| Səhifə | Ünvan |
|---|---|
| Ana səhifə | `/` |
| Hərrac lotları (Copart / IAAI / Manheim, auksion növü, yaxın 10 gün) | `/auction-lots` |
| Lotun daxili səhifəsi (qalereya, kalkulyator, qiymət qrafiki) | `/auction-lots/:slug` |
| Satışda olan avtomobillər (ölkə, şəhər, bazar fərqi) | `/search?country=aze` |
| Satışda olan avtomobil | `/cars/:slug` |
| Koreyadan avtomobillər | `/korea-cars` |
| Ehtiyat hissələri | `/parts` |
| Avtomobil kataloqu | `/catalog` |
| Hərrac / gömrük / daşınma kalkulyatoru | `/auction-calculator`, `/customs-calculator`, `/shipping-calculator` |
| Xidmətlər | `/services`, `/services/:slug` |
| Avtomobil izləmə | `/tracking` |
| Xəbərlər | `/information`, `/information/:id` |
| Diler ol (B2B müraciət) | `/dealers` |
| Haqqımızda, Əlaqə, Risklər, Şərtlər, Məxfilik | `/about`, `/contact`, `/risks`, `/terms`, `/privacy` |
| Daxil ol, Qeydiyyat, Profil | `/login`, `/register`, `/profile` |
| Seçilmişlər (giriş tələb edir) | `/favourite` |

Qalan linklər (məs. `/auction-history`) "Bu səhifə hazırlanır" səhifəsinə gedir.

## Data

Saytın məlumatları backend-dən gəlir (`GLB-Auto-Trade-Backend`, Express + PostgreSQL). Admin paneldən (`GLB-Auto-Trade-Admin`) idarə olunur.

- API ünvanı: `.env` faylında `NUXT_PUBLIC_API_BASE=http://localhost:4000/api`
- Sayt açılanda `app/plugins/api.ts` bir sorğu ilə (`GET /api/public/bootstrap`) bütün məlumatı alır və store-lara yazır.
- Tariflər və daşınma qiymətləri `app/utils/tariffs.ts`-ə yazılır, kalkulyatorlar oradan oxuyur.
- Müraciət formaları `POST /api/public/requests` ilə bazaya yazılır.
- `app/data` qovluğunda yalnız sabit siyahılar qalıb: menyu, filtr seçimləri, ölkələr.

GitHub Pages-də (`npm run generate`) məlumat build zamanı götürülür. Admin paneldə dəyişiklikdən sonra saytı yenidən build etmək lazımdır. Canlı data üçün sayt Node serverdə `npm run build` + `node .output/server/index.mjs` ilə işlədilməlidir.

## Store-lar

| Store | Nə edir |
|---|---|
| `lots` | hərrac filtrləri, sıralama, səhifələmə, URL ilə sinxron |
| `cars` | satışda olan avtomobillər (ölkə, şəhər) |
| `korea`, `parts`, `catalog` | Koreya, ehtiyat hissələri, kataloq |
| `calculator` | lot səhifəsindəki kalkulyator |
| `search` | ana səhifə filtri və header axtarışı |
| `auth`, `favourites`, `requests` | giriş, seçilmişlər, müraciətlər |
| `home`, `site`, `content`, `ui` | ana səhifə, menyu, xidmətlər və info səhifələri |

## Kalkulyator

- Hərrac rüsumu, Poti–Bakı qiyməti, əlavə xərclər, məzənnələr — admin panel → Tariflər (`app/utils/tariffs.ts`)
- ABŞ–Poti daşınma qiymətləri — admin panel → Daşınma
- Azərbaycan gömrüyü — `app/utils/customs.ts`
- Gürcüstan gömrüyü — `app/utils/customsGe.ts`
- Ümumi hesablama — `app/utils/estimate.ts`

## Şəkillər

`public` qovluğundakı şəkillər `$asset('images/...')` ilə verilir — GitHub Pages-də `/GLB-Auto-Trade/` bazası ilə düzgün işləyir.

## Texnologiyalar

Nuxt 4 (Options API), Pinia, SCSS, Swiper 11
