# Salihoğulları Hafriyat - Delivery Notes

Bu proje, premium public web deneyimi ile ayrı kimlik doğrulama akışına sahip admin panelini aynı içerik omurgası üzerinde çalıştırır.

## Mimari Özet

- Public rotalar: `/`, `/about`, `/services`, `/projects`, `/projects/[slug]`, `/fleet`, `/contact`
- Ayrı admin girişi: `/admin/login`
- Korunan admin paneli: `/admin`, `/admin/projects`, `/admin/messages`, `/admin/settings`
- Veri kaynakları: `data/projects.json`, `data/messages.json`, `data/settings.json`
- Yüklenen dosyalar: `public/uploads`

## Güvenlik Beklentileri

- Admin erişimi yalnızca `.env` içindeki `ADMIN_EMAIL` ve `ADMIN_PASSWORD` ile yapılır.
- `ADMIN_SESSION_SECRET` zorunludur ve en az 32 karakter olmalıdır.
- `APP_ORIGIN` canlı alan adınızı tanımlamak için önerilir.
- Zayıf şifre veya kod içine sabitlenmiş credential kullanmayın.

## Kurulum

```bash
npm install
copy .env.example .env
npm run lint
npm run build
npm run dev
```

## Gerekli Ortam Değişkenleri

```env
ADMIN_EMAIL=admin@salihogullari.com
ADMIN_PASSWORD=use-a-strong-password-here
ADMIN_SESSION_SECRET=use-a-long-random-secret-here
APP_ORIGIN=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Auth Akışı

1. Kullanıcı `/admin/login` sayfasına gelir.
2. Geçerli e-posta ve şifre ile giriş doğrulanır.
3. Session cookie oluşturulur.
4. Kullanıcı korunan admin paneline yönlendirilir.
5. Yetkisiz erişimler temiz şekilde `/admin/login` sayfasına döner.

## Medya Akışı

- Dosyalar önce güvenli upload katmanından geçer.
- Projeye bağlanamayan yüklemeler temizlenir.
- Yönetilen medya yalnızca `/uploads/` altından servis edilir.
- Kapak görseli ve galeri kayıtları proje verisiyle birlikte takip edilir.
- Silinen kayıtların dosyaları yalnızca başka bir referans kalmadığında temizlenir.

## Notlar

- Public proje sayfaları admin tarafında yönetilen proje verilerinden beslenir.
- Upload endpoint'i yalnızca admin oturumu altında çalışır.
- Üretim öncesinde `APP_ORIGIN`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD` ve `ADMIN_SESSION_SECRET` değerlerini canlı ortama uygun şekilde ayarlayın.
