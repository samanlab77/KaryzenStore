import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Ticket } from "lucide-react";
import { coupons } from "@/lib/data/dummy";
import { formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [couponList] = useState(coupons);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text mb-1">Kelola Kupon</h1>
          <p className="text-text-secondary text-sm">{couponList.length} kupon aktif</p>
        </div>
        <Link to="/admin/coupons/new" className="btn-primary !py-2.5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Buat Kupon
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Kode</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Diskon</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Periode</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Pemakaian</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {couponList.map((coupon) => {
                const now = Date.now();
                const isExpired = now > coupon.expiresAt;
                const isFuture = now < coupon.startsAt;
                const isMaxedOut = coupon.maxUses !== null && coupon.maxUses !== undefined && coupon.currentUses >= coupon.maxUses;
                const effectiveStatus = !coupon.isActive || isExpired ? "expired" : isFuture ? "pending" : isMaxedOut ? "used" : "active";

                const statusMap = {
                  active: { label: "Aktif", class: "badge-success" },
                  expired: { label: "Kadaluarsa", class: "badge-danger" },
                  pending: { label: "Belum Mulai", class: "badge-muted" },
                  used: { label: "Habis", class: "badge-warning" },
                };
                const sc = statusMap[effectiveStatus];

                return (
                  <tr key={coupon.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-primary" />
                        <span className="font-mono font-bold text-text text-xs">{coupon.code}</span>
                      </div>
                      <p className="text-[10px] text-text-secondary mt-0.5 line-clamp-1 max-w-[180px]">{coupon.description}</p>
                    </td>
                    <td className="px-5 py-3 text-xs font-medium text-primary hidden sm:table-cell">{coupon.percentage}%</td>
                    <td className="px-5 py-3 text-[10px] text-text-secondary hidden md:table-cell">
                      {formatShortDate(coupon.startsAt)} — {formatShortDate(coupon.expiresAt)}
                    </td>
                    <td className="px-5 py-3 text-xs text-text-secondary hidden md:table-cell">
                      {coupon.currentUses}{coupon.maxUses ? ` / ${coupon.maxUses}` : " / ∞"}
                    </td>
                    <td className="px-5 py-3"><span className={cn("text-[10px]", sc.class)}>{sc.label}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/coupons/${coupon.id}`} className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
