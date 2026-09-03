import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data/dummy";
import { formatIDR, truncate } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  const products = slug ? getProductsByCategory(slug) : [];
  const addItem = useCartStore((s) => s.addItem);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-text mb-4">
          Kategori Tidak Ditemukan
        </h1>
        <Link to="/products" className="text-primary hover:text-primary-hover">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link to="/products" className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Katalog
        </Link>
        <span>/</span>
        <span className="text-text">{category.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-2">
          {category.name}
        </h1>
        <p className="text-text-secondary">{category.description}</p>
        <p className="text-sm text-text-secondary mt-2">
          {products.length} produk ditemukan
        </p>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-secondary">
            Belum ada produk dalam kategori ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card overflow-hidden group">
              <Link to={`/products/${product.slug}`} className="block">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={product.coverImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.compareAtPrice && (
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
                    {product.compareAtPrice && (
                      <span className="text-xs text-text-secondary line-through">
                        {formatIDR(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      addItem({
                        productId: product.id,
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
