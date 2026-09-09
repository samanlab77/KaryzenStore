import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  ArrowLeft,
  Save,
  Trash2,
  Key,
  Upload,
  Loader2,
  FileArchive,
  CheckCircle2,
} from "lucide-react";
import { cn, formatIDR } from "@/lib/utils";
import { useAllCategories, useProductById, useProductFiles } from "@/lib/hooks";

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = useProductById(id);
  const categories = useAllCategories();
  const files = useProductFiles(id);

  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);
  const generateUploadUrl = useMutation(api.productFiles.generateUploadUrl);
  const createFile = useMutation(api.productFiles.create);
  const activateFile = useMutation(api.productFiles.setActive);
  const removeFile = useMutation(api.productFiles.remove);
  const bulkCreateLicenses = useMutation(api.licenses.bulkCreate);

  const [form, setForm] = useState<{
    title: string;
    categoryId: string;
    price: string;
    compareAtPrice: string;
    productType: "file" | "license";
    shortDescription: string;
    description: string;
    status: "draft" | "active" | "archived";
  } | null>(null);

  // Sync form once product loads (avoid overwriting user edits afterwards).
  if (product && form === null) {
    setForm({
      title: product.title,
      categoryId: product.categoryId,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      productType: product.productType,
      shortDescription: product.shortDescription,
      description: product.description,
      status: product.status,
    });
  }

  // License management state
  const productLicenses = useQuery(
    api.licenses.getByProduct,
    id ? { productId: id as Id<"products"> } : "skip"
  );
  const [newLicenseCodes, setNewLicenseCodes] = useState("");
  const [licenseMsg, setLicenseMsg] = useState<string | null>(null);

  // File upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !form) return;
    try {
      await updateProduct({
        id: product._id as Id<"products">,
        title: form.title.trim(),
        categoryId: form.categoryId as Id<"categories">,
        price: Number(form.price) || 0,
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        productType: form.productType,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        status: form.status,
      });
      navigate("/admin/products");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan produk.");
    }
  };

  const handleUpload = async () => {
    if (!product || !pendingFile) return;
    setUploading(true);
    setUploadError(null);
    try {
      // 1. Get a short-lived upload URL from Convex Storage.
      const postUrl = await generateUploadUrl();
      // 2. Upload the binary directly to storage.
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": pendingFile.type || "application/octet-stream" },
        body: pendingFile,
      });
      if (!res.ok) throw new Error("Upload ke storage gagal.");
      const { storageId } = (await res.json()) as { storageId: string };
      // 3. Register the version — new uploads start as the active version.
      await createFile({
        productId: product._id as Id<"products">,
        fileName: pendingFile.name,
        storageId,
        contentType: pendingFile.type || "application/octet-stream",
        sizeBytes: pendingFile.size,
        releaseNotes: uploadNotes.trim() || `Versi ${files.length + 1}`,
        isActive: true,
      });
      setPendingFile(null);
      setUploadNotes("");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddLicenses = async () => {
    if (!product || !newLicenseCodes.trim()) return;
    const codes = newLicenseCodes
      .split(/[\n,;]+/)
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
    if (codes.length === 0) return;
    try {
      await bulkCreateLicenses({
        productId: product._id as Id<"products">,
        codes,
      });
      await updateProduct({
        id: product._id as Id<"products">,
        licenseCount: (product.licenseCount ?? 0) + codes.length,
      });
      setNewLicenseCodes("");
      setLicenseMsg(`${codes.length} lisensi ditambahkan.`);
      setTimeout(() => setLicenseMsg(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menambah lisensi.");
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    if (!window.confirm(`Hapus produk "${product.title}"? Tindakan ini permanen.`))
      return;
    await removeProduct({ id: product._id as Id<"products"> });
    navigate("/admin/products");
  };

  if (!id) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">ID produk tidak valid.</p>
        <Link to="/admin/products" className="text-primary text-sm mt-2 inline-block">
          Kembali ke Produk
        </Link>
      </div>
    );
  }

  if (!product || !form) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-6 h-6 text-text-secondary animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/products"
          className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-heading font-bold text-text">Edit Produk</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Informasi Dasar</h3>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">Nama Produk</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Kategori</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="input w-full"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Tipe Produk</label>
              <select
                value={form.productType}
                onChange={(e) =>
                  setForm({ ...form, productType: e.target.value as "file" | "license" })
                }
                className="input w-full"
              >
                <option value="file">File Unduhan</option>
                <option value="license">Lisensi</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">Deskripsi Singkat</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">Deskripsi Lengkap</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input w-full resize-none"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Harga</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Harga (IDR)</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Harga Coret (IDR)</label>
              <input
                type="number"
                min={0}
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Status</h3>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as "draft" | "active" | "archived" })
            }
            className="input w-full"
          >
            <option value="draft">Draft</option>
            <option value="active">Aktif</option>
            <option value="archived">Arsip</option>
          </select>
        </div>

        {/* File Management (for file type) */}
        {form.productType === "file" && (
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-sm text-text mb-4">
              File / Versi ({files.length} versi)
            </h3>

            {/* Upload zone */}
            <div className="border border-dashed border-white/10 rounded-xl p-6 text-center mb-4">
              <Upload className="w-7 h-7 text-text-secondary mx-auto mb-2" />
              <input
                type="file"
                id="product-file-input"
                className="hidden"
                onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
              />
              {pendingFile ? (
                <div className="mb-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-text">
                    <FileArchive className="w-4 h-4 text-primary" />
                    <span className="max-w-[240px] truncate">{pendingFile.name}</span>
                    <span className="text-text-secondary text-xs">
                      ({formatBytes(pendingFile.size)})
                    </span>
                  </div>
                  <input
                    type="text"
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    placeholder="Catatan rilis (opsional)"
                    className="input w-full mt-3 text-xs"
                  />
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={handleUpload}
                      className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      {uploading ? "Mengunggah..." : "Unggah Versi Baru"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingFile(null)}
                      className="px-3 py-2 text-xs text-text-secondary hover:text-text"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => document.getElementById("product-file-input")?.click()}
                  className="text-sm text-text-secondary hover:text-text transition-colors"
                >
                  Klik untuk memilih file
                  <span className="block text-[10px] mt-1">
                    .zip, .rar, .pdf, .exe, .dmg
                  </span>
                </button>
              )}
              {uploadError && <p className="text-xs text-danger mt-2">{uploadError}</p>}
            </div>

            {/* Version list */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((f) => (
                  <div
                    key={f._id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]"
                  >
                    <FileArchive className="w-4 h-4 text-text-secondary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text truncate">
                        v{f.version} · {f.fileName}
                        {f.isActive && (
                          <span className="ml-2 text-[10px] badge-success align-middle">
                            Aktif
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        {formatBytes(f.sizeBytes)}
                        {f.releaseNotes ? ` · ${f.releaseNotes}` : ""}
                      </p>
                    </div>
                    {!f.isActive && (
                      <button
                        type="button"
                        onClick={() => activateFile({ id: f._id as Id<"productFiles"> })}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Jadikan versi aktif"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {f.isActive && (
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Hapus v${f.version} (${f.fileName})?`))
                          removeFile({ id: f._id as Id<"productFiles"> });
                      }}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                      title="Hapus versi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Licenses (for license type) */}
        {form.productType === "license" && (
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-sm text-text mb-4">
              Stok Lisensi ({productLicenses?.length ?? 0} total)
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(productLicenses ?? []).map((lic) => (
                <div
                  key={lic._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"
                >
                  <code className="text-xs font-mono text-text">{lic.code}</code>
                  <span
                    className={cn(
                      "text-[10px]",
                      lic.status === "available"
                        ? "badge-success"
                        : lic.status === "sold"
                          ? "badge-info"
                          : "badge-danger"
                    )}
                  >
                    {lic.status === "available"
                      ? "Tersedia"
                      : lic.status === "sold"
                        ? "Terjual"
                        : "Diblokir"}
                  </span>
                </div>
              ))}
              {productLicenses?.length === 0 && (
                <p className="text-xs text-text-secondary py-4 text-center">
                  Belum ada lisensi. Tambahkan kode di bawah.
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <textarea
                rows={3}
                value={newLicenseCodes}
                onChange={(e) => setNewLicenseCodes(e.target.value)}
                placeholder={"Satu kode per baris, atau pisahkan dengan koma\nContoh: KRYZ-XXXX-YYYY-ZZZZ"}
                className="input w-full resize-none font-mono text-xs"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddLicenses}
                  disabled={!newLicenseCodes.trim()}
                  className="text-xs text-primary hover:text-primary-hover flex items-center gap-1 disabled:opacity-40"
                >
                  <Key className="w-3 h-3" />
                  Tambah Lisensi
                </button>
                {licenseMsg && (
                  <span className="text-xs text-success flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {licenseMsg}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-lg border border-white/10 text-sm text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
          >
            Batal
          </Link>
          <button
            type="button"
            onClick={handleDeleteProduct}
            className="ml-auto px-4 py-3 rounded-lg text-sm text-danger hover:bg-danger/5 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>
        </div>
      </form>
    </div>
  );
}
