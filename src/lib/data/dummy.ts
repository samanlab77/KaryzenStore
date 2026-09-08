// ============================================================
// Karyzen Store — Data Dummy Lengkap (Bahasa Indonesia)
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  isActive: boolean;
  productCount: number;
}

export interface ProductFile {
  id: string;
  version: number;
  fileName: string;
  sizeBytes: number;
  releaseNotes: string;
  isActive: boolean;
  createdAt: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  productType: "file" | "license";
  categoryId: string;
  coverImage: string;
  isFeatured: boolean;
  status: "draft" | "active" | "archived";
  licenseCount: number;
  soldCount: number;
  files?: ProductFile[];
  createdAt: number;
  updatedAt: number;
}

export interface License {
  id: string;
  productId: string;
  code: string;
  orderId?: string;
  status: "available" | "sold" | "blocked";
  soldAt?: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  percentage: number;
  minSubtotal: number;
  maxDiscount?: number;
  startsAt: number;
  expiresAt: number;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  productType: "file" | "license";
  coverImage: string;
  unitPrice: number;
  quantity: number;
  licenseCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  couponCode?: string;
  status: "pending" | "paid" | "cancelled" | "expired";
  subtotalAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentGateway: string;
  paidAt?: number;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: "customer" | "staff" | "superadmin";
  createdAt: number;
}

// ===========================
// KATEGORI
// ===========================
export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Software",
    slug: "software",
    description: "Software premium untuk produktivitas, keamanan, dan pengembangan.",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    isActive: true,
    productCount: 4,
  },
  {
    id: "cat-2",
    name: "Desain Grafis",
    slug: "desain-grafis",
    description: "Aset desain, ikon, ilustrasi, dan elemen visual berkualitas tinggi.",
    coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
    isActive: true,
    productCount: 3,
  },
  {
    id: "cat-3",
    name: "E-Book",
    slug: "e-book",
    description: "Buku digital tentang teknologi, bisnis, desain, dan pengembangan diri.",
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop",
    isActive: true,
    productCount: 3,
  },
  {
    id: "cat-4",
    name: "Template & UI Kit",
    slug: "template-ui-kit",
    description: "Template website, aplikasi, dan UI kit untuk mempercepat pengembangan.",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=400&fit=crop",
    isActive: true,
    productCount: 3,
  },
  {
    id: "cat-5",
    name: "Kursus Online",
    slug: "kursus-online",
    description: "Kelas video dan materi pembelajaran untuk menguasai skill baru.",
    coverImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
    isActive: true,
    productCount: 3,
  },
];

// ===========================
// PRODUK DIGITAL
// ===========================
export const products: Product[] = [
  // === SOFTWARE ===
  {
    id: "prod-1",
    title: "Karyzen Security Pro 1 Tahun",
    slug: "karyzen-security-pro-1-tahun",
    shortDescription: "Lisensi resmi software keamanan untuk 1 perangkat, berlaku 1 tahun.",
    description:
      "Karyzen Security Pro adalah solusi keamanan digital komprehensif yang melindungi perangkat Anda dari malware, phishing, dan ancaman siber terkini. Dengan pembaruan database virus real-time dan firewall canggih, perangkat Anda akan selalu terlindungi. Termasuk dukungan teknis prioritas selama masa berlangganan.",
    price: 350000,
    compareAtPrice: 500000,
    productType: "license",
    categoryId: "cat-1",
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
    isFeatured: true,
    status: "active",
    licenseCount: 45,
    soldCount: 128,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "prod-2",
    title: "Karyzen Office Suite Premium",
    slug: "karyzen-office-suite-premium",
    shortDescription: "Paket aplikasi perkantoran lengkap dengan lisensi seumur hidup.",
    description:
      "Karyzen Office Suite menyediakan aplikasi perkantoran lengkap: pengolah kata, spreadsheet, presentasi, dan database. Kompatibel dengan format populer dan berjalan offline. Lisensi seumur hidup tanpa biaya berlangganan bulanan.",
    price: 275000,
    productType: "license",
    categoryId: "cat-1",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 80,
    soldCount: 65,
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "prod-3",
    title: "Karyzen DevTools Bundle",
    slug: "karyzen-devtools-bundle",
    shortDescription: "Paket tools pengembangan: code editor, terminal, dan debugging suite.",
    description:
      "Bundle lengkap untuk developer profesional. Termasuk code editor dengan AI completion, terminal modern dengan multiplexing, dan debugging suite untuk frontend & backend. Mendukung 50+ bahasa pemrograman.",
    price: 425000,
    compareAtPrice: 600000,
    productType: "license",
    categoryId: "cat-1",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    isFeatured: true,
    status: "active",
    licenseCount: 30,
    soldCount: 42,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: "prod-4",
    title: "Karyzen Cloud Backup 2TB",
    slug: "karyzen-cloud-backup-2tb",
    shortDescription: "Penyimpanan cloud 2TB dengan enkripsi end-to-end selama 1 tahun.",
    description:
      "Karyzen Cloud Backup menawarkan penyimpanan cloud sebesar 2TB dengan enkripsi end-to-end. File Anda akan selalu aman dan dapat diakses dari mana saja. Termasuk sinkronisasi otomatis dan versi file historis.",
    price: 199000,
    productType: "license",
    categoryId: "cat-1",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 120,
    soldCount: 89,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 1,
  },

  // === DESAIN GRAFIS ===
  {
    id: "prod-5",
    title: "Masterclass Desain Branding bersama Karyzen",
    slug: "masterclass-desain-branding-karyzen",
    shortDescription: "Kelas video lengkap untuk belajar membangun identitas visual brand.",
    description:
      "Kelas video lengkap untuk belajar membangun identitas visual brand dari nol, termasuk studi kasus dan file latihan. Pelajari prinsip desain, tipografi, pewarnaan, dan cara membuat brand guideline yang profesional. Cocok untuk desainer pemula hingga menengah.",
    price: 249000,
    productType: "file",
    categoryId: "cat-2",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
    isFeatured: true,
    status: "active",
    licenseCount: 0,
    soldCount: 210,
    createdAt: Date.now() - 86400000 * 40,
    updatedAt: Date.now() - 86400000 * 7,
  },
  {
    id: "prod-6",
    title: "Paket Ikon SVG Premium (2.000+)",
    slug: "paket-ikon-svg-premium",
    shortDescription: "Koleksi lebih dari 2.000 ikon SVG dalam berbagai gaya.",
    description:
      "Koleksi premium 2.000+ ikon SVG dalam berbagai gaya: line, solid, duotone, dan filled. Semua ikon tersedia dalam format SVG, PNG, dan JSX. Cocok untuk desain UI/UX, presentasi, dan proyek web.",
    price: 149000,
    compareAtPrice: 199000,
    productType: "file",
    categoryId: "cat-2",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 0,
    soldCount: 340,
    createdAt: Date.now() - 86400000 * 35,
    updatedAt: Date.now() - 86400000 * 10,
  },
  {
    id: "prod-7",
    title: "Template Media Sosial 365 Hari",
    slug: "template-media-sosial-365-hari",
    shortDescription: "365 template siap pakai untuk konten media sosial harian.",
    description:
      "Koleksi 365 template desain untuk konten media sosial: Instagram, Facebook, Twitter, dan LinkedIn. Setiap template dapat diedit dengan mudah menggunakan Canva, Figma, atau Photoshop. Termasuk kalender konten editorial.",
    price: 175000,
    productType: "file",
    categoryId: "cat-2",
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 0,
    soldCount: 175,
    createdAt: Date.now() - 86400000 * 22,
    updatedAt: Date.now() - 86400000 * 4,
  },

  // === E-BOOK ===
  {
    id: "prod-8",
    title: "Panduan Lengkap Membangun Startup Digital",
    slug: "panduan-lengkap-membangun-startup-digital",
    shortDescription: "E-book 350+ halaman tentang membangun startup dari ide hingga scale-up.",
    description:
      "E-book komprehensif yang membahas seluruh aspek membangun startup digital: validasi ide, MVP, penggalangan dana, strategi marketing, hingga scaling. Dilengkapi studi kasus startup Indonesia yang berhasil dan template bisnis plan.",
    price: 129000,
    productType: "file",
    categoryId: "cat-3",
    coverImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop",
    isFeatured: true,
    status: "active",
    licenseCount: 0,
    soldCount: 420,
    createdAt: Date.now() - 86400000 * 50,
    updatedAt: Date.now() - 86400000 * 15,
  },
  {
    id: "prod-9",
    title: "Belajar TypeScript dari Nol hingga Mahir",
    slug: "belajar-typescript-dari-nol-hingga-mahir",
    shortDescription: "E-book TypeScript praktis dengan 80+ contoh kode dan latihan.",
    description:
      "E-book TypeScript yang dirancang untuk developer JavaScript yang ingin menguasai TypeScript. Dimulai dari konsep dasar hingga advanced patterns seperti generics, conditional types, dan utility types. Setiap bab dilengkapi latihan praktis.",
    price: 99000,
    productType: "file",
    categoryId: "cat-3",
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 0,
    soldCount: 290,
    createdAt: Date.now() - 86400000 * 28,
    updatedAt: Date.now() - 86400000 * 6,
  },
  {
    id: "prod-10",
    title: "Strategi Marketing Digital untuk Pemula",
    slug: "strategi-marketing-digital-untuk-pemula",
    shortDescription: "E-book tentang SEO, social media marketing, dan iklan digital.",
    description:
      "Panduan praktis marketing digital untuk pemilik bisnis dan content creator. Pelajari SEO, social media marketing, Google Ads, Facebook Ads, email marketing, dan analytics. Dilengkapi checklist dan template kampanye.",
    price: 89000,
    compareAtPrice: 149000,
    productType: "file",
    categoryId: "cat-3",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 0,
    soldCount: 180,
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000 * 3,
  },

  // === TEMPLATE & UI KIT ===
  {
    id: "prod-11",
    title: "Karyzen Dashboard UI Kit",
    slug: "karyzen-dashboard-ui-kit",
    shortDescription: "UI Kit lengkap untuk dashboard admin modern dengan dark mode.",
    description:
      "UI Kit komprehensif untuk membangun dashboard admin. Termasuk 200+ komponen, 30+ halaman template, dark mode built-in, dan dokumentasi lengkap. Kompatibel dengan Figma, Tailwind CSS, dan React.",
    price: 199000,
    compareAtPrice: 349000,
    productType: "file",
    categoryId: "cat-4",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    isFeatured: true,
    status: "active",
    licenseCount: 0,
    soldCount: 156,
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: "prod-12",
    title: "Template Landing Page Konversi Tinggi",
    slug: "template-landing-page-konversi-tinggi",
    shortDescription: "10 template landing page yang dioptimasi untuk konversi tinggi.",
    description:
      "Koleksi 10 template landing page yang telah dioptimasi berdasarkan riset UX dan psikologi konversi. Setiap template dilengkapi variasi warna, copywriting guide, dan analisis elemen konversi. Format HTML & Figma.",
    price: 159000,
    productType: "file",
    categoryId: "cat-4",
    coverImage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 0,
    soldCount: 220,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "prod-13",
    title: "Figma E-Commerce Starter Kit",
    slug: "figma-ecommerce-starter-kit",
    shortDescription: "Template Figma lengkap untuk membangun toko online.",
    description:
      "Starter kit Figma untuk e-commerce: halaman produk, keranjang, checkout, profil user, dan admin panel. Desain responsif dengan variabel desain dan auto-layout. Hemat waktu 40+ jam dalam proyek e-commerce Anda.",
    price: 225000,
    productType: "file",
    categoryId: "cat-4",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 0,
    soldCount: 95,
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 1,
  },

  // === KURSUS ONLINE ===
  {
    id: "prod-14",
    title: "Kursus Fullstack Web Development",
    slug: "kursus-fullstack-web-development",
    shortDescription: "120+ video pembelajaran fullstack: React, Node.js, database, dan deployment.",
    description:
      "Kursus komprehensif fullstack web development. Mulai dari HTML, CSS, JavaScript, React, Node.js, Express, database (PostgreSQL & MongoDB), hingga deployment di Vercel dan Railway. Termasuk 15 proyek nyata dan sertifikat penyelesaian.",
    price: 499000,
    compareAtPrice: 799000,
    productType: "file",
    categoryId: "cat-5",
    coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
    isFeatured: true,
    status: "active",
    licenseCount: 0,
    soldCount: 310,
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "prod-15",
    title: "Kursus UI/UX Design dengan Figma",
    slug: "kursus-ui-ux-design-figma",
    shortDescription: "80+ video tentang UI/UX design: research, wireframe, prototyping, testing.",
    description:
      "Kursus mendalam UI/UX design menggunakan Figma. Pelajari user research, wireframing, prototyping, design system, usability testing, dan portofolio design. Cocok untuk pemula yang ingin masuk ke dunia desain digital.",
    price: 349000,
    productType: "file",
    categoryId: "cat-5",
    coverImage: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 0,
    soldCount: 185,
    createdAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now() - 86400000 * 8,
  },
  {
    id: "prod-16",
    title: "Kursus Copywriting & Content Marketing",
    slug: "kursus-copywriting-content-marketing",
    shortDescription: "60+ video tentang menulis copy yang menjual dan strategi content marketing.",
    description:
      "Kursus copywriting praktis untuk marketer dan content creator. Pelajari headline yang menarik, copywriting AIDA, email marketing, landing page copy, dan content marketing strategy. Dilengkapi template dan contoh kampanye sukses.",
    price: 279000,
    productType: "file",
    categoryId: "cat-5",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop",
    isFeatured: false,
    status: "active",
    licenseCount: 0,
    soldCount: 130,
    createdAt: Date.now() - 86400000 * 32,
    updatedAt: Date.now() - 86400000 * 4,
  },
];

// ===========================
// KUPON DISKON
// ===========================
export const coupons: Coupon[] = [
  {
    id: "coupon-1",
    code: "HEMATHOKI15",
    description: "Diskon spesial untuk pembelian pertama Anda!",
    percentage: 15,
    minSubtotal: 150000,
    maxDiscount: 75000,
    startsAt: new Date("2025-08-01").getTime(),
    expiresAt: new Date("2025-08-31").getTime(),
    maxUses: 200,
    currentUses: 87,
    isActive: true,
  },
  {
    id: "coupon-2",
    code: "KARYZEN10",
    description: "Diskon 10% untuk semua produk Karyzen Store.",
    percentage: 10,
    minSubtotal: 50000,
    startsAt: new Date("2025-07-01").getTime(),
    expiresAt: new Date("2025-12-31").getTime(),
    maxUses: 1000,
    currentUses: 342,
    isActive: true,
  },
  {
    id: "coupon-3",
    code: "MEGADEAL25",
    description: "Diskon mega deal! Hanya untuk pembelian di atas Rp500.000.",
    percentage: 25,
    minSubtotal: 500000,
    maxDiscount: 200000,
    startsAt: new Date("2025-08-15").getTime(),
    expiresAt: new Date("2025-09-15").getTime(),
    maxUses: 50,
    currentUses: 12,
    isActive: true,
  },
];

// ===========================
// LISENSI
// ===========================
export const licenses: License[] = [
  { id: "lic-1", productId: "prod-1", code: "KZN-SEC-4F2A-91C8-27BD", status: "sold", soldAt: Date.now() - 86400000 * 10 },
  { id: "lic-2", productId: "prod-1", code: "KZN-SEC-7B3E-5D19-A6F0", status: "available" },
  { id: "lic-3", productId: "prod-1", code: "KZN-SEC-2C8F-E4A1-B3D7", status: "available" },
  { id: "lic-4", productId: "prod-2", code: "KZN-OFF-9E1A-C5B8-D2F4", status: "sold", soldAt: Date.now() - 86400000 * 5 },
  { id: "lic-5", productId: "prod-2", code: "KZN-OFF-3D7F-A2E6-9C1B", status: "available" },
  { id: "lic-6", productId: "prod-3", code: "KZN-DEV-8A4C-F1D3-E7B2", status: "sold", soldAt: Date.now() - 86400000 * 8 },
  { id: "lic-7", productId: "prod-3", code: "KZN-DEV-5F2B-C9A7-3E8D", status: "available" },
  { id: "lic-8", productId: "prod-4", code: "KZN-CDB-1E6A-8D4B-F2C9", status: "sold", soldAt: Date.now() - 86400000 * 3 },
];

// ===========================
// USER PROFILES
// ===========================
export const userProfiles: UserProfile[] = [
  {
    id: "user-1",
    email: "budi.santoso@email.com",
    name: "Budi Santoso",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
    role: "customer",
    createdAt: Date.now() - 86400000 * 60,
  },
  {
    id: "user-2",
    email: "sari.dewi@email.com",
    name: "Sari Dewi",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sari",
    role: "customer",
    createdAt: Date.now() - 86400000 * 45,
  },
  {
    id: "user-3",
    email: "admin@karyzenstore.com",
    name: "Admin Karyzen",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    role: "staff",
    createdAt: Date.now() - 86400000 * 90,
  },
  {
    id: "user-4",
    email: "superadmin@karyzenstore.com",
    name: "Super Admin",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin",
    role: "superadmin",
    createdAt: Date.now() - 86400000 * 120,
  },
];

// ===========================
// ORDERS
// ===========================
export const orders: Order[] = [
  {
    id: "order-1",
    orderNumber: "KZN-20250801-0001",
    userId: "user-1",
    customerName: "Budi Santoso",
    customerEmail: "budi.santoso@email.com",
    items: [
      {
        id: "oi-1",
        productId: "prod-5",
        productTitle: "Masterclass Desain Branding bersama Karyzen",
        productSlug: "masterclass-desain-branding-karyzen",
        productType: "file",
        coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
        unitPrice: 249000,
        quantity: 1,
      },
    ],
    status: "paid",
    subtotalAmount: 249000,
    discountAmount: 0,
    taxAmount: 24900,
    totalAmount: 273900,
    paymentGateway: "midtrans",
    paidAt: Date.now() - 86400000 * 8,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: "order-2",
    orderNumber: "KZN-20250805-0002",
    userId: "user-1",
    customerName: "Budi Santoso",
    customerEmail: "budi.santoso@email.com",
    items: [
      {
        id: "oi-2",
        productId: "prod-1",
        productTitle: "Karyzen Security Pro 1 Tahun",
        productSlug: "karyzen-security-pro-1-tahun",
        productType: "license",
        coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
        unitPrice: 350000,
        quantity: 1,
        licenseCode: "KZN-SEC-4F2A-91C8-27BD",
      },
    ],
    couponCode: "KARYZEN10",
    status: "paid",
    subtotalAmount: 350000,
    discountAmount: 35000,
    taxAmount: 31500,
    totalAmount: 346500,
    paymentGateway: "midtrans",
    paidAt: Date.now() - 86400000 * 5,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: "order-3",
    orderNumber: "KZN-20250810-0003",
    userId: "user-2",
    customerName: "Sari Dewi",
    customerEmail: "sari.dewi@email.com",
    items: [
      {
        id: "oi-3",
        productId: "prod-11",
        productTitle: "Karyzen Dashboard UI Kit",
        productSlug: "karyzen-dashboard-ui-kit",
        productType: "file",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        unitPrice: 199000,
        quantity: 1,
      },
      {
        id: "oi-4",
        productId: "prod-8",
        productTitle: "Panduan Lengkap Membangun Startup Digital",
        productSlug: "panduan-lengkap-membangun-startup-digital",
        productType: "file",
        coverImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop",
        unitPrice: 129000,
        quantity: 1,
      },
    ],
    couponCode: "HEMATHOKI15",
    status: "paid",
    subtotalAmount: 328000,
    discountAmount: 49200,
    taxAmount: 27880,
    totalAmount: 306680,
    paymentGateway: "midtrans",
    paidAt: Date.now() - 86400000 * 3,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "order-4",
    orderNumber: "KZN-20250815-0004",
    userId: "user-2",
    customerName: "Sari Dewi",
    customerEmail: "sari.dewi@email.com",
    items: [
      {
        id: "oi-5",
        productId: "prod-14",
        productTitle: "Kursus Fullstack Web Development",
        productSlug: "kursus-fullstack-web-development",
        productType: "file",
        coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
        unitPrice: 499000,
        quantity: 1,
      },
    ],
    status: "pending",
    subtotalAmount: 499000,
    discountAmount: 0,
    taxAmount: 49900,
    totalAmount: 548900,
    paymentGateway: "midtrans",
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: "order-5",
    orderNumber: "KZN-20250803-0005",
    userId: "user-1",
    customerName: "Budi Santoso",
    customerEmail: "budi.santoso@email.com",
    items: [
      {
        id: "oi-6",
        productId: "prod-3",
        productTitle: "Karyzen DevTools Bundle",
        productSlug: "karyzen-devtools-bundle",
        productType: "license",
        coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
        unitPrice: 425000,
        quantity: 1,
        licenseCode: "KZN-DEV-8A4C-F1D3-E7B2",
      },
    ],
    status: "paid",
    subtotalAmount: 425000,
    discountAmount: 0,
    taxAmount: 42500,
    totalAmount: 467500,
    paymentGateway: "midtrans",
    paidAt: Date.now() - 86400000 * 12,
    createdAt: Date.now() - 86400000 * 14,
  },
];

// ===========================
// HELPER FUNCTIONS
// ===========================
export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  return products.filter((p) => p.categoryId === cat.id && p.status === "active");
}

export function getActiveProducts(): Product[] {
  return products.filter((p) => p.status === "active");
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured && p.status === "active");
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getOrdersByUser(userId: string): Order[] {
  return orders.filter((o) => o.userId === userId);
}

export function getPaidOrders(): Order[] {
  return orders.filter((o) => o.status === "paid");
}

export function getTotalRevenue(): number {
  return getPaidOrders().reduce((sum, o) => sum + o.totalAmount, 0);
}

export function getTotalTax(): number {
  return getPaidOrders().reduce((sum, o) => sum + o.taxAmount, 0);
}

export function getTotalDiscount(): number {
  return getPaidOrders().reduce((sum, o) => sum + o.discountAmount, 0);
}
