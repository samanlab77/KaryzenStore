# Karyzen Store 🛍️

Toko produk digital (*e-commerce*) yang menjual software, lisensi aplikasi, template desain, e-book, dan kursus online. Pembeli dapat melakukan transaksi secara otomatis, lalu langsung mengunduh produk atau melihat lisensi/kode aktivasi dari akun mereka.

> **Status:** MVP — berjalan dengan data demo, siap dihubungkan ke payment gateway & auth produksi.

---

## ✨ Fitur Utama

### 🏪 Untuk Pengunjung & Customer
- **Katalog produk digital** — pencarian, filter kategori, produk unggulan, dan halaman detail produk
- **Keranjang belanja** berbasis browser (localStorage) — bisa diisi tanpa login
- **Checkout** dengan perhitungan subtotal, diskon kupon, pajak, dan total otomatis
- **Kupon diskon** persentase dengan periode berlaku & batas pemakaian
- **Member Library / Dashboard** — daftar produk yang dibeli, tautan unduhan, dan lisensi/kode aktivasi
- **Riwayat transaksi** dengan status pembayaran (Lunas / Menunggu / Dibatalkan / Kadaluarsa)
- Halaman **Tentang, FAQ, dan Kontak**

### 🛠️ Untuk Admin (Staff & Superadmin)
- **Kelola produk** — buat, edit, arsipkan produk; kelola status (draft/active/archived)
- **Kelola kategori**
- **Kelola kupon diskon** — persentase, periode berlaku, minimal subtotal, batas pemakaian
- **Kelola pesanan** — lihat semua transaksi beserta detail item & status
- **Kelola pengguna & peran** — customer, staff, superadmin
- **Laporan penjualan** — pendapatan, pajak, dan diskon otomatis

---

## 🧰 Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, TypeScript, Vite 6 |
| Routing | React Router 7 |
| State | Zustand (cart + auth, dengan persist) |
| Styling | Tailwind CSS 3, Framer Motion, Lucide Icons |
| Chart | Recharts |
| Backend/Database | Convex (schema, queries, mutations, seed) |

---

## 📁 Struktur Proyek

```
├── convex/                  # Backend Convex
│   ├── schema.ts            # 7 tabel: users, categories, products, productFiles, licenses, orders, coupons
│   ├── users.ts             # CRUD user & manajemen peran
│   ├── categories.ts        # CRUD kategori
│   ├── products.ts          # CRUD produk, pencarian/filter, produk unggulan
│   ├── orders.ts            # CRUD pesanan, aggregasi pendapatan/pajak/diskon
│   ├── coupons.ts           # CRUD kupon + validasi (periode, min subtotal, max uses)
│   ├── licenses.ts          # Manajemen kode lisensi & stok
│   ├── productFiles.ts      # Manajemen versi file produk
│   └── seed.ts              # Seeder data demo (16 produk, 5 kategori, 3 kupon, dll)
└── src/
    ├── pages/
    │   ├── public/          # Home, Produk, Detail Produk, Kategori, Keranjang, Checkout, Tentang, FAQ, Kontak
    │   ├── member/          # Dashboard, Riwayat Transaksi, Lisensi, Pengaturan, Sukses Pesanan
    │   ├── admin/           # Dashboard, Produk, Kategori, Pesanan, Kupon, Laporan, Pengguna
    │   └── auth/            # Halaman Sign In / Sign Up
    ├── layouts/             # PublicLayout, MemberLayout, AdminLayout
    ├── stores/              # Zustand stores (cart, auth)
    ├── lib/
    │   ├── hooks.ts         # React hooks reaktif (Convex + fallback data demo)
    │   ├── types.ts         # Normalisasi tipe antara Convex & dummy data
    │   └── data/dummy.ts    # Data demo (fallback jika Convex belum dikonfigurasi)
    └── App.tsx              # Definisi seluruh route
```

---

## 🚀 Menjalankan Secara Lokal

Prasyarat: **Node.js 18+** dan **Bun** (atau npm/pnpm/yarn).

```bash
# 1. Install dependencies
bun install

# 2. Jalankan dev server
bun run dev

# 3. Build produksi
bun run build

# 4. Preview hasil build
bun run preview
```

> Catatan: `bun install` otomatis menjalankan codegen Convex (`convex dev --once`) melalui `postinstall`.

### Konfigurasi Convex (opsional)

Aplikasi berjalan **tanpa konfigurasi apa pun** menggunakan data demo. Untuk menggunakan backend Convex yang sesungguhnya:

1. Buat project Convex di [convex.dev](https://convex.dev) dan jalankan `bunx convex dev` untuk login.
2. Set `VITE_CONVEX_URL` pada environment (contoh: `https://happy-otter-123.convex.cloud`).
3. Jalankan `bunx convex run seedAll` untuk mengisi data demo ke database Convex.

Tanpa `VITE_CONVEX_URL`, seluruh halaman otomatis menggunakan data dummy dari `src/lib/data/dummy.ts`.

---

## 🗺️ Daftar Route

| Route | Halaman | Akses |
|---|---|---|
| `/` | Landing page & produk unggulan | Publik |
| `/products` | Katalog produk (cari & filter) | Publik |
| `/products/:slug` | Detail produk | Publik |
| `/categories/:slug` | Produk per kategori | Publik |
| `/keranjang` | Keranjang belanja | Publik |
| `/checkout` | Checkout | Member |
| `/order/:orderNumber/success` | Konfirmasi pesanan sukses | Member |
| `/dashboard` | Member library | Member |
| `/dashboard/orders` | Riwayat transaksi | Member |
| `/dashboard/licenses` | Lisensi & kode aktivasi | Member |
| `/dashboard/settings` | Pengaturan akun | Member |
| `/admin` | Dashboard admin | Staff/Superadmin |
| `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit` | Kelola produk | Staff/Superadmin |
| `/admin/categories` | Kelola kategori | Staff/Superadmin |
| `/admin/orders`, `/admin/orders/:id` | Kelola pesanan | Staff/Superadmin |
| `/admin/coupons`, `/admin/coupons/:id` | Kelola kupon | Staff/Superadmin |
| `/admin/reports` | Laporan penjualan | Staff/Superadmin |
| `/admin/users` | Kelola pengguna & peran | Superadmin |
| `/sign-in`, `/sign-up` | Autentikasi | Publik |
| `/tentang`, `/faq`, `/kontak` | Halaman informasi | Publik |

---

## 🧪 Data Demo

Saat login otomatis (mode demo), aplikasi masuk sebagai **Budi Santoso** (customer). Data demo mencakup:

- **16 produk** digital (software, template, e-book, kursus) dalam **5 kategori**
- **3 kupon diskon** aktif (mis. `WELCOME10`, `KARYZEN20`)
- **5 pesanan** beserta lisensi yang sudah terjual

Seeder Convex (`convex/seed.ts`) membuat: 4 user, 5 kategori, 16 produk, 3 kupon, 5 pesanan, dan 8 lisensi.

---

## 📌 Status & Roadmap

**Sudah berjalan di MVP:**
- ✅ Katalog, keranjang (localStorage), checkout, dan simulasi pembayaran
- ✅ Member library, riwayat transaksi, lisensi
- ✅ Admin panel lengkap + laporan penjualan
- ✅ Backend Convex (schema + CRUD + seeder)

**Berikutnya:**
- ⏳ Payment gateway **Midtrans Snap** (webhook verifikasi pembayaran, produk aktif otomatis setelah lunas)
- ⏳ Autentikasi nyata (**Clerk**) untuk member & admin
- ⏳ Upload file produk digital (Convex file storage) & riwayat versi file
- ⏳ Deploy produksi

---

Dibangun dengan ❤️ untuk toko digital yang transparan dan otomatis.