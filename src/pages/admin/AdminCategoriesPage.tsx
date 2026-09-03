import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { categories } from "@/lib/data/dummy";
import { cn } from "@/lib/utils";

interface CategoryForm {
  name: string;
  description: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>({ name: "", description: "", slug: "" });

  const openNew = () => {
    setEditId(null);
    setForm({ name: "", description: "", slug: "" });
    setShowModal(true);
  };

  const openEdit = (cat: (typeof categories)[0]) => {
    setEditId(cat.id);
    setForm({ name: cat.name, description: cat.description, slug: cat.slug });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text mb-1">Kelola Kategori</h1>
          <p className="text-text-secondary text-sm">{categories.length} kategori</p>
        </div>
        <button onClick={openNew} className="btn-primary !py-2.5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Kategori</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Slug</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Produk</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={cat.coverImage} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-text">{cat.name}</p>
                      <p className="text-[10px] text-text-secondary line-clamp-1 max-w-[200px]">{cat.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-text-secondary font-mono hidden sm:table-cell">{cat.slug}</td>
                <td className="px-5 py-3 text-xs text-text-secondary hidden md:table-cell">{cat.productCount}</td>
                <td className="px-5 py-3">
                  <span className={cn("text-[10px]", cat.isActive ? "badge-success" : "badge-muted")}>
                    {cat.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="card w-full max-w-md p-6 mx-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-text">
                {editId ? "Edit Kategori" : "Tambah Kategori"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/5">
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium">Nama Kategori</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input w-full" />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium">Deskripsi</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input w-full resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editId ? "Simpan" : "Tambah"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-lg border border-white/10 text-sm text-text-secondary hover:text-text hover:bg-white/5 transition-colors">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
