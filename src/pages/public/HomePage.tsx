import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Download,
  Shield,
  Zap,
  CreditCard,
  Star,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  useFeaturedProducts,
  useCategories,
} from "@/lib/hooks";
import { formatIDR, truncate } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useSEO, organizationJsonLd } from "@/lib/seo";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const features = [
  {
    icon: CreditCard,
    title: "Pembayaran Instan",
    desc: "Bayar melalui VA, QRIS, e-wallet, atau transfer bank. Pembayaran diverifikasi otomatis.",
  },
  {
    icon: Download,
    title: "Unduh Langsung",
    desc: "Produk tersedia segera setelah pembayaran. Unduh file atau lihat kode lisensi Anda.",
  },
  {
    icon: Shield,
    title: "Transaksi Aman",
    desc: "Pembayaran diproses melalui gateway terpercaya. Data Anda terlindungi dengan enkripsi.",
  },
  {
    icon: Zap,
    title: "Update Gratis",
    desc: "Dapatkan versi terbaru produk tanpa biaya tambahan. Kami terus memperbarui produk kami.",
  },
];

const steps = [
  { num: "01", title: "Pilih Produk", desc: "Jelajahi katalog dan temukan produk digital yang Anda butuhkan." },
  { num: "02", title: "Checkout & Bayar", desc: "Masukkan kupon jika ada, lalu bayar melalui payment gateway." },
  { num: "03", title: "Unduh Produk", desc: "Produk langsung tersedia di dasbor Anda setelah pembayaran lunas." },
];

export default function HomePage() {
  const featured = useFeaturedProducts();
  const cats = useCategories();
  const addItem = useCartStore((s) => s.addItem);

  useSEO({
    title: "Karyzen Store — Toko Produk Digital Premium",
    description:
      "Beli software, lisensi aplikasi, template desain, e-book, dan kursus online. Pembayaran otomatis via Midtrans, produk langsung tersedia setelah lunas.",
    path: "/",
    jsonLd: organizationJsonLd(),
  });

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="badge-warning !px-4 !py-1.5 text-xs font-semibold tracking-wide uppercase">
                Toko Produk Digital Premium
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-text leading-tight mb-6"
            >
              Temukan Produk Digital{" "}
              <span className="text-gradient">Berkualitas Tinggi</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-secondary leading-relaxed mb-8"
            >
              Software, lisensi, template desain, e-book, dan kursus online.
              Beli dalam hitungan menit, langsung dapat digunakan.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/products" className="btn-primary text-base flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Mulai Belanja
              </Link>
              <Link
                to="/tentang"
                className="px-6 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-text hover:bg-white/5 transition-all border border-white/10"
              >
                Pelajari Lebih Lanjut
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* ── Categories ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-3">
              Jelajahi Kategori
            </h2>
            <p className="text-text-secondary">
              Temukan produk digital sesuai kebutuhan Anda
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {cats.map((cat) => (
              <Link
                key={cat._id}
                to={`/categories/${cat.slug}`}
                className="group card overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-sm text-text group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-2">
                Produk Unggulan
              </h2>
              <p className="text-text-secondary">
                Produk pilihan terbaik dari Karyzen Store
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -4 }}
                className="card overflow-hidden group"
              >
                <Link to={`/products/${product.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {"compareAtPrice" in product && product.compareAtPrice && (
                      <span className="absolute top-3 left-3 badge-danger text-[10px]">
                        HEMAT{" "}
                        {Math.round(
                          ((product.compareAtPrice - product.price) /
                            product.compareAtPrice) *
                            100
                        )}
                        %
                      </span>
                    )}
                    <span className="absolute top-3 right-3 badge-muted text-[10px]">
                      {product.productType === "license"
                        ? "Lisensi"
                        : "File"}
                    </span>
                  </div>
                </Link>
                <div className="p-5">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-heading font-semibold text-text group-hover:text-primary transition-colors mb-1.5">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {truncate(product.shortDescription, 80)}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatIDR(product.price)}
                      </span>
                      {"compareAtPrice" in product && product.compareAtPrice && (
                        <span className="text-xs text-text-secondary line-through">
                          {formatIDR(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        addItem({
                          productId: product._id ?? product.id ?? "",
                          title: product.title,
                          slug: product.slug,
                          price: product.price,
                          coverImage: product.coverImage,
                          productType: product.productType,
                        })
                      }
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all duration-fast"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              Lihat Semua Produk
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-3">
              Mengapa Karyzen Store?
            </h2>
            <p className="text-text-secondary">
              Kemudahan dan keamanan dalam setiap transaksi
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-text mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-3">
              Cara Membeli
            </h2>
            <p className="text-text-secondary">
              Hanya 3 langkah untuk mendapatkan produk Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 relative z-10">
                  <span className="font-heading font-bold text-primary text-xl">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-text mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.desc}
                </p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-6 -right-4 w-5 h-5 text-text-secondary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof / Stats ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-4">
                Dipercaya oleh Ribuan Pelanggan
              </h2>
              <p className="text-text-secondary mb-8 max-w-xl mx-auto">
                Bergabung dengan ribuan pelanggan yang sudah puas dengan produk
                dan layanan kami.
              </p>
              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-8">
                <div>
                  <p className="text-2xl font-heading font-bold text-primary">
                    2.500+
                  </p>
                  <p className="text-xs text-text-secondary mt-1">Pelanggan</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-primary">
                    1.800+
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Produk Terjual
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-primary">
                    4.9
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Rating Rata-rata
                  </p>
                </div>
              </div>
              <Link
                to="/products"
                className="btn-primary inline-flex items-center gap-2"
              >
                Jelajahi Produk
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 sm:p-12 text-center bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-4">
              Siap Mendapatkan Produk Digital Favorit Anda?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Mulai belanja sekarang dan nikmati pengalaman pembelian produk
              digital yang cepat, aman, dan mudah.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 text-base"
            >
              <ShoppingCart className="w-5 h-5" />
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
