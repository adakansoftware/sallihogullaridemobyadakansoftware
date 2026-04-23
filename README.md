# Salihogullari Corporate Platform

Kurumsal web sitesi ve yönetim paneli içeren, Next.js 16 tabanlı teslimata hazır proje.

## Özet

- Public rotalar: `/`, `/about`, `/services`, `/projects`, `/projects/[slug]`, `/fleet`, `/contact`
- Admin rotaları: `/admin/login`, `/admin`, `/admin/projects`, `/admin/messages`, `/admin/settings`
- Veri katmanı: `data/` altında JSON dosyaları
- Medya: `public/uploads`
- Kimlik doğrulama: ortam değişkeni tabanlı admin oturumu ve güvenli cookie

## Kurulum

1. Bağımlılıkları yükleyin:

```powershell
npm install
```

2. Ortam değişkenlerini hazırlayın:

```powershell
Copy-Item .env.example .env
```

3. `.env` içindeki admin ve site değerlerini güncelleyin.

4. Geliştirme sunucusunu başlatın:

```powershell
npm run dev
```

## Komutlar

```powershell
npm run dev
npm run test
npm run lint
npm run build
```

## Üretim Notları

- `NEXT_PUBLIC_SITE_URL` veya `APP_ORIGIN` doğru production alan adına ayarlanmalıdır.
- `ADMIN_SESSION_SECRET` rastgele ve güçlü bir değer olmalıdır.
- `data/` ve `public/uploads/` yazılabilir olmalıdır.
- Bu proje tek-instance dosya tabanlı persistence kullanır; yatay ölçekleme için veritabanı geçişi planlanmalıdır.

## Handoff

Detaylı operasyon ve teslim notları için şu dosyalara bakın:

- [README_ADMIN.md](C:\Users\adaka\Desktop\sali_admin_full\README_ADMIN.md)
- [CLIENT_HANDOFF.md](C:\Users\adaka\Desktop\sali_admin_full\CLIENT_HANDOFF.md)
- [DELIVERY_CHECKLIST.md](C:\Users\adaka\Desktop\sali_admin_full\DELIVERY_CHECKLIST.md)
