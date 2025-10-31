# 🕐 MongoDB Otomatik Senkronizasyon Kurulumu

Bu dokümantasyon, MongoDB'deki ürünlerin ve görsellerin otomatik olarak dosya sistemine export edilmesi için gerekli ayarları açıklar.

## 📋 İçindekiler

1. [GitHub Actions (Önerilen)](#github-actions-önerilen)
2. [Vercel Cron Job (Alternatif)](#vercel-cron-job-alternatif)
3. [Manuel Çalıştırma](#manuel-çalıştırma)

---

## ✅ GitHub Actions (Önerilen)

### Neden GitHub Actions?

- ✅ Vercel'de dosya sistemi read-only, GitHub Actions'da yazılabilir
- ✅ Otomatik commit ve push
- ✅ Ücretsiz (public repo için sınırsız)
- ✅ Kolay yönetim ve monitoring

### Kurulum Adımları

#### 1. GitHub Secrets Ayarla

GitHub Repository → **Settings** → **Secrets and variables** → **Actions**

Yeni secret ekle:

```
Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/database
```

#### 2. Workflow Dosyası

`.github/workflows/sync-mongodb.yml` dosyası zaten oluşturuldu.

#### 3. Zamanlama

Varsayılan: **Her gün saat 03:00** (UTC)

Değiştirmek için `.github/workflows/sync-mongodb.yml` dosyasındaki `cron` satırını düzenle:

```yaml
schedule:
  - cron: '0 3 * * *'  # Her gün 03:00
  # - cron: '0 */6 * * *'  # Her 6 saatte bir
  # - cron: '0 0 * * 0'  # Her Pazar 00:00
```

#### 4. Manuel Tetikleme

GitHub Repository → **Actions** → **MongoDB Sync to Files** → **Run workflow**

#### 5. İzleme

**Actions** sekmesinden workflow'ların durumunu izleyebilirsin:
- ✅ Başarılı: Yeşil
- ❌ Hatalı: Kırmızı
- 🟡 Çalışıyor: Sarı

---

## 🔄 Vercel Cron Job (Alternatif)

### Nasıl Çalışır?

Vercel Cron → API Route → GitHub Actions Workflow Tetikler

### Kurulum Adımları

#### 1. Vercel Environment Variables

Vercel Dashboard → Project → **Settings** → **Environment Variables**

Ekle:

```bash
CRON_SECRET=your-random-secret-key-here-12345
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_REPO=tarkandemir/hygieia-shop
```

#### 2. GitHub Personal Access Token Oluştur

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token**
3. Scopes: `repo` ve `workflow` seç
4. Token'ı kopyala ve Vercel'e ekle

#### 3. Vercel'de Cron Job Aktif Et

`vercel.json` dosyası zaten mevcut:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-mongodb",
      "schedule": "0 3 * * *"
    }
  ]
}
```

Deploy et → Vercel otomatik cron job oluşturur.

#### 4. Test Et

Endpoint'i çağır (Postman, curl):

```bash
curl -X GET https://your-domain.vercel.app/api/cron/sync-mongodb \
  -H "Authorization: Bearer your-cron-secret"
```

---

## 🖥️ Manuel Çalıştırma

### Lokal'de Export Yap

```bash
# MongoDB'den JSON'a export
npm run export-mongodb
# veya
node scripts/export-mongodb-to-json.js

# Resimleri dosya sistemine migrate et
npm run migrate-images
# veya
node scripts/migrate-images-to-files.js

# Değişiklikleri commit ve push et
git add data/ public/images/products/
git commit -m "chore: MongoDB manual sync"
git push
```

---

## 📊 Script'ler

### 1. Export MongoDB to JSON

**Dosya:** `scripts/export-mongodb-to-json.js`

**Ne yapar:**
- MongoDB'deki tüm koleksiyonları okur
- `data/` klasörüne JSON dosyaları olarak kaydeder
- products, categories, orders, users, settings, notifications

### 2. Migrate Images to Files

**Dosya:** `scripts/migrate-images-to-files.js`

**Ne yapar:**
- MongoDB'deki base64 görselleri bulur
- `public/images/products/` klasörüne PNG/JPEG olarak kaydeder
- MongoDB'de görselleri path olarak günceller

---

## 🔍 Monitoring

### GitHub Actions Logs

1. Repository → **Actions**
2. Workflow çalışmasına tıkla
3. Her step'in loglarını incele

### Vercel Logs

1. Vercel Dashboard → Project
2. **Deployments** → Son deployment
3. **Functions** → Cron logs

---

## ⚙️ Cron Zamanlama Örnekleri

```yaml
# Her gün saat 03:00 (UTC)
'0 3 * * *'

# Her 6 saatte bir
'0 */6 * * *'

# Her Pazartesi 09:00
'0 9 * * 1'

# Haftada bir, Pazar 00:00
'0 0 * * 0'

# Ayda bir, 1. gün 00:00
'0 0 1 * *'
```

---

## 🚨 Sorun Giderme

### Workflow Çalışmıyor

1. **GitHub Secrets** kontrol et
2. **Workflow dosyası** syntax hatası var mı?
3. **Actions** sekmesinde hata loglarını oku

### Dosyalar Commit Edilmiyor

1. Gerçekten değişiklik var mı?
2. Git config doğru mu?
3. Permission var mı?

### MongoDB Bağlantı Hatası

1. MONGODB_URI doğru mu?
2. IP whitelist kontrolü (MongoDB Atlas)
3. Şifre özel karakter içeriyor mu? URL encode et

---

## 📞 Destek

Sorun yaşarsan:
1. GitHub Actions logs'u kontrol et
2. Console'da error mesajlarını oku
3. Environment variables'ı kontrol et

---

## ✨ Önerilen Kurulum

**En kolay ve güvenilir:** GitHub Actions (Adım 1)

1. GitHub Secret'ı ekle: `MONGODB_URI`
2. Workflow'u aktif et (otomatik)
3. İlk sync için manuel tetikle
4. Günlük otomatik sync çalışacak

🎉 Tamamlandı!

