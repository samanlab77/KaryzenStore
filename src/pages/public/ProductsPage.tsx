import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, ShoppingCart, X } from "lucide-react";
import { useActiveProducts, useCategories } from "@/lib/hooks";
import { formatIDR, truncate } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import { useSEO } from "@/lib/seo";

type SortKey = "default" | "price-asc" | "price-desc" | "newest";

export default function ProductsPage() {
  const allProducts = useActiveProducts();
  const cats = useCategories();
  const addItem = useCartStore((s) => s.addItem);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [showFilters, setShowFilters] = useState(false);

  useSEO({
    title: "Katalog Produk Digital",
    description:
      "Jelajahi katalog lengkap Karyzen Store: software, lisensi aplikasi, template desain, e-book, dan kursus online. Cari, filter, dan beli dalam hitungan menit.",
    path: "/products",
  });

  const filtered = useMemo(() => {
    let result = allProducts;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return result;
  }, [allProducts, search, selectedCategory, sort, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-2">
          Katalog Produk
        </h1>
        <p className="text-text-secondary">
          Temukan berbagai produk digital berkualitas tinggi
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-10"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="input min-w-[180px]"
        >
          <option value="default">Urutkan: Default</option>
          <option value="price-asc">Harga: Rendah ke Tinggi</option>
          <option value="price-desc">Harga: Tinggi ke Rendah</option>
          <option value="newest">Terbaru</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors",
            showFilters
              ? "border-primary text-primary bg-primary/5"
              : "border-white/10 text-text-secondary hover:text-text hover:bg-white/5"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm text-text">
              Filter
            </h3>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setPriceRange([0, 5000000]);
              }}
              className="text-xs text-primary hover:text-primary-hover"
            >
              Reset
            </button>
          </div>

          <div className="mb-5">
            <p className="text-xs text-text-secondary mb-2 font-medium uppercase tracking-wider">
              Kategori
            </p>
            <div className="flex flex-wrap gap-2">
              {cats.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat._id ? null : cat._id
                    )
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selectedCategory === cat._id
                      ? "border-primary text-primary bg-primary/10"
                      : "border-white/10 text-text-secondary hover:text-text hover:bg-white/5"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-text-secondary mb-2 font-medium uppercase tracking-wider">
              Harga Maksimal: {formatIDR(priceRange[1])}
            </p>
            <input
              type="range"
              min={0}
              max={1000000}
              step={10000}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([0, parseInt(e.target.value)])
              }
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>{formatIDR(0)}</span>
              <span>{formatIDR(1000000)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(selectedCategory || search) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {search && (
            <span className="badge-info flex items-center gap-1">
              Pencarian: &quot;{search}&quot;
              <button onClick={() => setSearch("")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="badge-info flex items-center gap-1">
              Kategori:{" "}
              {cats.find((c) => c._id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory(null)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      <p className="text-sm text-text-secondary mb-6">
        Menampilkan {filtered.length} produk
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-secondary mb-4">
            Tidak ada produk yang ditemukan.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
              setPriceRange([0, 5000000]);
            }}
            className="text-sm text-primary hover:text-primary-hover"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product._id} className="card overflow-hidden group">
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
                    {product.productType === "license" ? "Lisensi" : "File"}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
