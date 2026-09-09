import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  ArrowLeft,
  Download,
  Key,
  CheckCircle2,
  Tag,
  Star,
} from "lucide-react";
import { useProductBySlug, useActiveProducts, useCategories } from "@/lib/hooks";
import { formatIDR, truncate } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSEO, productJsonLd } from "@/lib/seo";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = useProductBySlug(slug);
  const allProducts = useActiveProducts();
  const cats = useCategories();
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const { isAuthenticated } = useAuthStore();
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Dynamic SEO once product data is available (title/description update reactively).
  useSEO({
    title: product ? product.title : "Produk Tidak Ditemukan",
    description: product
      ? `${product.shortDescription} Harga ${formatIDR(product.price)}. Unduh langsung atau aktivasi lisensi setelah pembayaran.`
      : undefined,
    path: product ? `/products/${product.slug}` : undefined,
    image: product?.coverImage,
    type: "product",
    jsonLd: product
      ? productJsonLd({
          title: product.title,
          description: product.shortDescription,
          slug: product.slug,
          price: product.price,
          coverImage: product.coverImage,
          productType: product.productType,
          soldCount: product.soldCount ?? 0,
        })
      : undefined,
  });

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-text mb-4">
          Produk Tidak Ditemukan
        </h1>
        <Link to="/products" className="text-primary hover:text-primary-hover">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const category = cats.find((c) => c._id === product.categoryId);
  const isInCart = items.some((i) => i.productId === (product._id ?? product.id ?? ""));
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && (p._id ?? p.id) !== (product._id ?? product.id))
    .slice(0, 3);

  const handleAddToCart = () => {
    addItem({
      productId: product._id ?? product.id ?? "",
      title: product.title,
      slug: product.slug,
      price: product.price,
      coverImage: product.coverImage,
      productType: product.productType,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const features = [
    "Akses seumur hidup",
    "Update gratis",
    "Dukungan teknis",
    "File berkualitas tinggi",
    "Licence resmi & verified",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link to="/products" className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Katalog
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              to={`/categories/${category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-text">{truncate(product.title, 40)}</span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Image */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden aspect-[16/10]"
          >
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-muted text-[10px] uppercase tracking-wider">
                {product.productType === "license" ? "Lisensi" : "File Unduhan"}
              </span>
              {product.isFeatured && (
                <span className="badge-warning text-[10px]">
                  <Star className="w-3 h-3 mr-0.5 fill-current" />
                  Unggulan
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-3">
              {product.title}
            </h1>

            {category && (
              <Link
                to={`/categories/${category.slug}`}
                className="text-sm text-primary hover:text-primary-hover mb-4 inline-flex items-center gap-1"
              >
                <Tag className="w-3.5 h-3.5" />
                {category.name}
              </Link>
            )}

            <p className="text-text-secondary leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-heading font-bold text-primary">
                {formatIDR(product.price)}
              </span>
              {"compareAtPrice" in product && product.compareAtPrice && (
                <span className="text-lg text-text-secondary line-through">
                  {formatIDR(product.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="card p-4 mb-6">
              {product.productType === "file" ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Download className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">
                      File Unduhan
                    </p>
                    <p className="text-xs text-text-secondary">
                      Langsung dapat diunduh setelah pembayaran
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">
                      Kode Lisensi
                    </p>
                    <p className="text-xs text-text-secondary">
                      {product.licenseCount} lisensi tersedia
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={cn(
                "w-full flex items-center justify-center gap-2 text-base font-semibold py-3.5 rounded-lg transition-all duration-fast",
                isInCart
                  ? "bg-white/5 text-text-secondary cursor-default"
                  : "btn-primary"
              )}
            >
              {isInCart ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Sudah di Keranjang
                </>
              ) : addedFeedback ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Ditambahkan!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Tambah ke Keranjang
                </>
              )}
            </button>

            {isInCart && (
              <Link
                to="/keranjang"
                className="block text-center text-sm text-primary hover:text-primary-hover mt-3"
              >
                Lihat Keranjang
              </Link>
            )}

            <div className="mt-6 space-y-2.5">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12">
        <h2 className="text-xl font-heading font-bold text-text mb-4">
          Deskripsi Produk
        </h2>
        <div className="card p-6 sm:p-8">
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-heading font-bold text-text mb-6">
            Produk Terkait
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rp) => (
              <Link
                key={rp._id}
                to={`/products/${rp.slug}`}
                className="card overflow-hidden group"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={rp.coverImage}
                    alt={rp.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-sm text-text group-hover:text-primary transition-colors mb-1">
                    {rp.title}
                  </h3>
                  <span className="text-primary font-bold">
                    {formatIDR(rp.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
