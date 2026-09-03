import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { coupons } from "@/lib/data/dummy";
import { Link } from "react-router-dom";

export default function AdminCouponEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const coupon = coupons.find((c) => c.id === id);

  const formatDateForInput = (ts: number) => {
    const d = new Date(ts);
    return d.toISOString().slice(0, 10);
  };

  const [form, setForm] = useState({
    code: coupon?.code || "",
    description: coupon?.description || "",
    percentage: coupon?.percentage?.toString() || "10",
    minSubtotal: coupon?.minSubtotal?.toString() || "0",
    maxDiscount: coupon?.maxDiscount?.toString() || "",
    startsAt: coupon ? formatDateForInput(coupon.startsAt) : "",
    expiresAt: coupon ? formatDateForInput(coupon.expiresAt) : "",
    maxUses: coupon?.maxUses?.toString() || "",
    isActive: coupon?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/coupons");
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/coupons" className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-heading font-bold text-text">
          {coupon ? "Edit Kupon" : "Buat Kupon Baru"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Informasi Kupon</h3>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">Kode Kupon *</label>
            <input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input w-full font-mono" placeholder="CONTOH15" />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">Deskripsi</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input w-full" placeholder="Diskon spesial untuk..." />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Diskon</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Persentase (%) *</label>
              <input type="number" min={1} max={100} required value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} className="input w-full" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Maks. Potongan (IDR)</label>
              <input type="number" min={0} value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} className="input w-full" placeholder="Tanpa batas" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">Min. Pembelian (IDR)</label>
            <input type="number" min={0} value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })} className="input w-full" />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Periode</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Tanggal Mulai *</label>
              <input type="date" required value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="input w-full" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Tanggal Selesai *</label>
              <input type="date" required value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="input w-full" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-text">Batas Pemakaian</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Maks. Pemakaian</label>
              <input type="number" min={1} value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="input w-full" placeholder="Tidak terbatas" />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary" />
                <span className="text-sm text-text">Aktif</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {coupon ? "Simpan Perubahan" : "Buat Kupon"}
          </button>
          <Link to="/admin/coupons" className="px-6 py-3 rounded-lg border border-white/10 text-sm text-text-secondary hover:text-text hover:bg-white/5 transition-colors">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
