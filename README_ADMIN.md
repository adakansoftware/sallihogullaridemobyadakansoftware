# Salihogullari Hafriyat - Delivery Notes

Bu proje, premium public web deneyimi ile ayri kimlik dogrulama akisina sahip admin panelini ayni icerik omurgasi uzerinde calistirir.

## Mimari Ozet

- Public rotalar: `/`, `/about`, `/services`, `/projects`, `/projects/[slug]`, `/fleet`, `/contact`
- Ayri admin girisi: `/admin/login`
- Korunan admin paneli: `/admin`, `/admin/projects`, `/admin/messages`, `/admin/settings`
- Veri kaynaklari: `data/projects.json`, `data/messages.json`, `data/settings.json`
- Yuklenen dosyalar: `public/uploads`
- Dosya tabanli yardimcilar: `lib/file-storage.ts`, `lib/store.ts`, `lib/rate-limit.ts`

## Guvenlik Beklentileri

- Admin erisimi yalnizca `.env` icindeki `ADMIN_EMAIL` ve `ADMIN_PASSWORD` ile yapilir.
- `ADMIN_SESSION_SECRET` zorunludur ve en az 32 karakter olmalidir.
- `APP_ORIGIN` canli alan adinizi tanimlamak icin onerilir.
- Zayif sifre veya kod icine sabitlenmis credential kullanmayin.
- Mutasyon rotalari ayni-origin dogrulamasi ve rate limit korumasi altindadir.

## Kurulum

```bash
npm install
copy .env.example .env
npm run lint
npm run test
npm run build
npm run dev
```

## Gerekli Ortam Degiskenleri

```env
ADMIN_EMAIL=admin@salihogullari.com
ADMIN_PASSWORD=use-a-strong-password-here
ADMIN_SESSION_SECRET=use-a-long-random-secret-here
APP_ORIGIN=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Auth Akisi

1. Kullanici `/admin/login` sayfasina gelir.
2. Gecerli e-posta ve sifre ile giris dogrulanir.
3. Session cookie olusturulur.
4. Kullanici korunan admin paneline yonlendirilir.
5. Yetkisiz erisimler temiz sekilde `/admin/login` sayfasina doner.

## Medya Akisi

- Dosyalar once guvenli upload katmanindan gecer.
- MIME, uzanti ve imza dogrulamalari birlikte uygulanir.
- Projeye baglanamayan yuklemeler temizlenir.
- Yonetilen medya yalnizca `/uploads/` altindan servis edilir.
- Kapak gorseli ve galeri kayitlari proje verisiyle birlikte takip edilir.
- Silinen kayitlarin dosyalari yalnizca baska bir referans kalmadiginda temizlenir.

## Uretim Notlari

- `data/` klasoru yazilabilir olmali ve yedek dosyalar (`.bak`) korunmalidir.
- `public/uploads/` klasoru yazilabilir olmali; ters proxy veya platform katmaninda dosya boyutu limitleri proje limitiyle uyumlu tutulmalidir.
- `APP_ORIGIN` ve `NEXT_PUBLIC_SITE_URL` canli alan adiyla eslesmelidir, aksi halde mutasyon istekleri origin kontrolune takilabilir.
- File-based rate limit yuk altinda temel koruma saglar; yatay olceklenmis dagitim gerekiyorsa kalici ortak store dusunulmelidir.

## Notlar

- Public proje sayfalari admin tarafinda yonetilen proje verilerinden beslenir.
- Upload endpoint'i yalnizca admin oturumu altinda calisir.
- Uretim oncesinde `APP_ORIGIN`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD` ve `ADMIN_SESSION_SECRET` degerlerini canli ortama uygun sekilde ayarlayin.
