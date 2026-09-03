import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Key, Upload } from "lucide-react";
import { products, categories, licenses } from "@/lib/data/dummy";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatIDR } from "@/lib/utils";

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const productLicenses = licenses.filter((l) => l.productId === id);

  const [form, setForm] = useState({
    title: product?.title || "",
    categoryId: product?.categoryId || "",
    price: product?.price?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    productType: (product?.productType || "file") as "file" | "license",
    shortDescription: product?.shortDescription || "",
    description: product?.description || "",
    status: (product?.status || "draft") as "draft" | "active" | "archived",
  });

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Produk tidak ditemukan.</p>
        <Link to="/admin/products" className="text-primary text-sm mt-2 inline-block">
          Kembali ke Produk
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/products");
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/products" className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-heading font-bold text-text">Edit Produk</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Informasi Dasar</h3>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">Nama Produk</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Kategori</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input w-full">
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Tipe Produk</label>
              <select value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value as "file" | "license" })} className="input w-full">
                <option value="file">File Unduhan</option>
                <option value="license">Lisensi</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">Deskripsi Singkat</label>
            <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input w-full" />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">Deskripsi Lengkap</label>
            <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input w-full resize-none" />
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Harga</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Harga (IDR)</label>
              <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input w-full" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Harga Coret (IDR)</label>
              <input type="number" min={0} value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className="input w-full" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Status</h3>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "active" | "archived" })} className="input w-full">
            <option value="draft">Draft</option>
            <option value="active">Aktif</option>
            <option value="archived">Arsip</option>
          </select>
        </div>

        {/* File Management (for file type) */}
        {form.productType === "file" && (
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-sm text-text mb-4">File / Versi</h3>
            <div className="border border-dashed border-white/10 rounded-xl p-8 text-center mb-4">
              <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">Klik atau seret file untuk diunggah</p>
              <p className="text-[10px] text-text-secondary mt-1">.zip, .rar, .pdf, .exe, .dmg (maks 500MB)</p>
            </div>
          </div>
        )}

        {/* Licenses (for license type) */}
        {form.productType === "license" && (
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-sm text-text mb-4">Stok Lisensi ({productLicenses.length} total)</h3>
            <div className="space-y-2">
              {productLicenses.map((lic) => (
                <div key={lic.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                  <code className="text-xs font-mono text-text">{lic.code}</code>
                  <span className={cn("text-[10px]", lic.status === "available" ? "badge-success" : lic.status === "sold" ? "badge-info" : "badge-danger")}>
                    {lic.status === "available" ? "Tersedia" : lic.status === "sold" ? "Terjual" : "Diblokir"}
                  </span>
                </div>
              ))}
            </div>
            <button type="button" className="mt-4 text-xs text-primary hover:text-primary-hover flex items-center gap-1">
              <Key className="w-3 h-3" />
              Tambah Lisensi
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
          <Link to="/admin/products" className="px-6 py-3 rounded-lg border border-white/10 text-sm text-text-secondary hover:text-text hover:bg-white/5 transition-colors">
            Batal
          </Link>
          <button type="button" className="ml-auto px-4 py-3 rounded-lg text-sm text-danger hover:bg-danger/5 transition-colors flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>
        </div>
      </form>
    </div>
  );
}
