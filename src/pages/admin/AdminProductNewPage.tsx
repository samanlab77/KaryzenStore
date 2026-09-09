import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "convex/react";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAllCategories, useAllProducts } from "@/lib/hooks";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminProductNewPage() {
  const navigate = useNavigate();
  const createProduct = useMutation(api.products.create);
  const categories = useAllCategories();
  const allProducts = useAllProducts();

  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    price: "",
    compareAtPrice: "",
    productType: "file" as "file" | "license",
    shortDescription: "",
    description: "",
    coverImage: "",
    isFeatured: false,
    status: "draft" as "draft" | "active" | "archived",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.categoryId) {
      setError("Pilih kategori terlebih dahulu.");
      return;
    }

    setSaving(true);
    try {
      // Ensure a unique slug.
      let slug = slugify(form.title) || `produk-${Date.now()}`;
      const taken = new Set(allProducts.map((p) => p.slug));
      while (taken.has(slug)) slug = `${slug}-${Math.floor(Math.random() * 90 + 10)}`;

      await createProduct({
        title: form.title.trim(),
        slug,
        shortDescription: form.shortDescription.trim() || form.title.trim(),
        description: form.description.trim() || form.shortDescription.trim() || form.title.trim(),
        price: Number(form.price) || 0,
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        productType: form.productType,
        categoryId: form.categoryId as any,
        coverImage:
          form.coverImage.trim() ||
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop",
        isFeatured: form.isFeatured,
        status: form.status,
        licenseCount: 0,
      });
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan produk.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/products"
          className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-heading font-bold text-text">
          Tambah Produk Baru
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">
            Informasi Dasar
          </h3>

          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">
              Nama Produk *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input w-full"
              placeholder="Contoh: Karyzen Security Pro"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Kategori *
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="input w-full"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Tipe Produk *
              </label>
              <select
                value={form.productType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    productType: e.target.value as "file" | "license",
                  })
                }
                className="input w-full"
              >
                <option value="file">File Unduhan</option>
                <option value="license">Lisensi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">
              Deskripsi Singkat
            </label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
              className="input w-full"
              placeholder="Ringkasan singkat produk"
            />
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">
              Deskripsi Lengkap
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input w-full resize-none"
              placeholder="Deskripsi lengkap produk..."
            />
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">
              URL Gambar Cover
            </label>
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) =>
                setForm({ ...form, coverImage: e.target.value })
              }
              className="input w-full"
              placeholder="https://images.unsplash.com/... (opsional)"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">
            Harga
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Harga (IDR) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input w-full"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Harga Coret (IDR)
              </label>
              <input
                type="number"
                min={0}
                value={form.compareAtPrice}
                onChange={(e) =>
                  setForm({ ...form, compareAtPrice: e.target.value })
                }
                className="input w-full"
                placeholder="Opsional"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">
            Status & Unggulan
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "draft" | "active" | "archived",
                })
              }
              className="input w-full"
            >
              <option value="draft">Draft</option>
              <option value="active">Aktif</option>
              <option value="archived">Arsip</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
                className="accent-[#D4A94E]"
              />
              Tampilkan di Produk Unggulan
            </label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Simpan Produk"}
          </button>
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-lg border border-white/10 text-sm text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
