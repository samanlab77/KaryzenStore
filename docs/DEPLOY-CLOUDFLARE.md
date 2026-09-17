# 🚀 Cara Install Karyzen Store di Cloudflare Pages

Panduan lengkap menghubungkan repo GitHub ini ke Cloudflare Pages.
Frontend (SPA Vite) di-host di Cloudflare, backend & database tetap di **Convex** — tidak perlu D1.

---

## Prasyarat

| Kebutuhan | Keterangan |
|---|---|
| Akun Cloudflare | Gratis, daftar di https://dash.cloudflare.com/sign-up |
| Repo GitHub | `samanlab77/KaryzenStore` (sudah berisi semua build fix) |
| Akun Convex | Untuk deployment production database |
| Key Clerk | Publishable key (`pk_live_...` / `pk_test_...`) |
| Key Midtrans | Client key (`Mid-client-...`) — sudah dimiliki |

---

## Langkah 1 — Buat Deployment Convex Production

Di terminal, dari root project:

```bash
bunx convex deploy
```

- Login/authorize bila diminta.
- Catat **URL deployment** yang muncul, formatnya:
  `https://<nama-deployment>.convex.cloud`
- Nilai ini yang nanti diisi ke `VITE_CONVEX_URL` di Cloudflare.

> Pastikan env server sudah ada di deployment production tersebut:
> `MIDTRANS_SERVER_KEY` dan `MIDTRANS_IS_PRODUCTION=true`
> (set via `bunx convex env set ...` atau dashboard Convex → Settings → Environment Variables).

---

## Langkah 2 — Hubungkan GitHub ke Cloudflare Pages

1. Buka **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → tab **Pages**.
2. Pilih **Connect to Git** → **GitHub** → authorize Cloudflare.
3. Pilih repository **KaryzenStore**, branch **`main`** → **Begin setup**.

### Konfigurasi build

| Setting | Nilai yang harus diisi |
|---|---|
| Project name | `karyzen-store` (bebas, jadi subdomain `*.pages.dev`) |
| Production branch | `main` |
| Framework preset | **Vite** |
| Build command | `bunx vite build` |
| Build output directory | `dist` |
| Root directory | (kosong / default) |

> ⚠️ **Pakai `bunx vite build`**, bukan `vite build` atau `tsc -b && vite build`.
> `tsc` tidak akan ditemukan (bukan production dependency), dan builder bisa
> meng-install production deps saja. `bunx` selalu menemukan vite.
> `bun.lock` sudah ada di repo sehingga versi dependency konsisten.

### (WAJIB sebelum klik Save) — Environment variables

Masih di wizard setup, buka **Settings → Variables and Secrets** dan tambahkan
untuk **Production** (centang juga Preview bila perlu):

| Nama variabel | Isi |
|---|---|
| `VITE_CONVEX_URL` | URL Convex dari Langkah 1, mis. `https://abc123.convex.cloud` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable key Clerk |
| `VITE_MIDTRANS_CLIENT_KEY` | `Mid-client-...` (client key kamu) |
| `VITE_MIDTRANS_IS_PRODUCTION` | `true` |

> 🔑 Semua variabel `VITE_*` dibaca **saat build**, bukan saat runtime.
> Kalau ditambahkan setelah build pertama → wajib **Retry deploy** agar ikut ter-bake ke bundle.

Klik **Save and Deploy**. Build pertama biasanya 1–2 menit.
Situs live di `https://<project-name>.pages.dev`.

---

## Langkah 3 — Deploy Ulang Setiap Kali Update

Setiap `git push` ke `main` → Cloudflare otomatis build & publish.
Pull request otomatis mendapat **preview URL** terpisah.

Jika build gagal: **Deployments → deployment gagal → Retry deploy**,
dan cek apakah ada perubahan pada build command/variabel.

---

## Langkah 4 — Daftarkan Domain ke Layanan Eksternal

### Clerk (autentikasi)

**Clerk Dashboard** → aplikasi → **Domains** → tambahkan:
- `https://<project-name>.pages.dev`
- plus domain custom (Langkah 5) kalau ada.

Tanpa ini, login akan diblokir Clerk.

### Midtrans (pembayaran)

**Midtrans Dashboard (production)** → **Settings → Configuration**:

| Field | Nilai |
|---|---|
| Payment Notification URL | `https://<domain-final>/midtrans/notification` |
| Finish Redirect URL (opsional) | `https://<domain-final>/order/success` |
| Unfinish / Error Redirect (opsional) | `https://<domain-final>/order/status` |

> Tanpa Payment Notification URL, pembayaran tetap masuk tetapi status order
> tidak otomatis berubah jadi `paid` (webhook inilah yang meng-assign lisensi).

### Verifikasi webhook (opsional, sekali)

```bash
curl -i -X POST https://<domain-final>/midtrans/notification \
  -H "Content-Type: application/json" -d '{}'
```

Respons `400`/`500` (signature invalid) berarti endpoint hidup — Midtrans yang valid akan lolos SHA512 check.

---

## Langkah 5 — Custom Domain (Opsional)

1. **Pages → project → Custom domains → Set up a domain**.
2. Masukkan misalnya `karyzenstore.com` (atau `www.karyzenstore.com`).
3. Bila domain dibeli/di-host di Cloudflare → DNS & SSL otomatis.
   Bila di registrar lain → tambahkan CNAME ke `<project-name>.pages.dev`.
4. Setelah aktif:
   - Tambahkan domain di **Clerk → Domains**.
   - Perbarui **Payment Notification URL** Midtrans ke domain final.
   - Perbarui URL absolut di `public/sitemap.xml` (sitemap mewajibkan URL absolut).

---

## Arsitektur Final

```
Pengunjung ──► Cloudflare Pages (dist/ static + _redirects SPA fallback)
                     │
                     ├─► Convex (database, storage file, functions)
                     │     └─ webhook /midtrans/notification
                     ├─► Clerk (auth)
                     └─► Midtrans Snap (pembayaran popup)
```

- Routing SPA ditangani `public/_redirects` (`/* /index.html 200`) — sudah ada di repo.
- File produk tersimpan di **Convex Storage**; unduhan member divalidasi server-side.
- Tidak perlu Workers, Functions, atau D1 tambahan.

---

## Troubleshooting

| Gejala | Penyebab & Solusi |
|---|---|
| `sh: 1: tsc: not found` | Build command masih lama → ganti ke `bunx vite build` |
| `sh: 1: vite: not found` | Builder install production deps saja → pakai `bunx vite build` (toolchain build sudah dipindah ke `dependencies` sejak commit `3adc9b9`) |
| Situs blank / tanpa data produk | `VITE_CONVEX_URL` kosong saat build → isi variabel, lalu **Retry deploy** |
| Halaman 404 saat refresh `/products/...` | `_redirects` hilang → pastikan `public/_redirects` ada di repo |
| Login diblokir/error Clerk | Domain Pages belum didaftarkan di Clerk → Langkah 4 |
| Order tidak jadi `paid` setelah bayar | Payment Notification URL belum di-set di Midtrans → Langkah 4 |
| Perubahan variabel tidak berpengaruh | `VITE_*` dibaca saat build → wajib Retry deploy setelah mengubah variabel |
