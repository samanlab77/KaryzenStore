import { Link } from "react-router-dom";
import { Plus, Search, Edit, Eye } from "lucide-react";
import { products, categories } from "@/lib/data/dummy";
import { formatIDR } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: { label: "Aktif", class: "badge-success" },
  draft: { label: "Draft", class: "badge-muted" },
  archived: { label: "Arsip", class: "badge-danger" },
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text mb-1">
            Kelola Produk
          </h1>
          <p className="text-text-secondary text-sm">
            {products.length} produk total
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="btn-primary !py-2.5 flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-9"
          />
        </div>
        <select
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || null)}
          className="input min-w-[140px]"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="draft">Draft</option>
          <option value="archived">Arsip</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Produk
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">
                  Kategori
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Harga
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">
                  Terjual
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                const sc = statusConfig[p.status];
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-text truncate max-w-[200px]">
                            {p.title}
                          </p>
                          <p className="text-[10px] text-text-secondary">
                            {p.productType === "license" ? "Lisensi" : "File"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-text-secondary hidden sm:table-cell">
                      {cat?.name}
                    </td>
                    <td className="px-5 py-3 text-xs font-medium text-text">
                      {formatIDR(p.price)}
                    </td>
                    <td className="px-5 py-3 text-xs text-text-secondary hidden md:table-cell">
                      {p.soldCount}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("text-[10px]", sc.class)}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors inline-flex"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
