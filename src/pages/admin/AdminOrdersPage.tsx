import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import { useAllOrders } from "@/lib/hooks";
import { formatIDR, formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusConfig = {
  paid: { label: "Lunas", class: "badge-success" },
  pending: { label: "Menunggu", class: "badge-warning" },
  cancelled: { label: "Dibatalkan", class: "badge-danger" },
  expired: { label: "Kadaluarsa", class: "badge-muted" },
};

export default function AdminOrdersPage() {
  const allOrders = useAllOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = allOrders
    .filter((o) => {
      if (search) {
        const q = search.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .filter((o) => !statusFilter || o.status === statusFilter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text mb-1">Kelola Pesanan</h1>
        <p className="text-text-secondary text-sm">{allOrders.length} pesanan total</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input type="text" placeholder="Cari nomor order atau nama..." value={search} onChange={(e) => setSearch(e.target.value)} className="input w-full pl-9" />
        </div>
        <select value={statusFilter || ""} onChange={(e) => setStatusFilter(e.target.value || null)} className="input min-w-[140px]">
          <option value="">Semua Status</option>
          <option value="paid">Lunas</option>
          <option value="pending">Menunggu</option>
          <option value="cancelled">Dibatalkan</option>
          <option value="expired">Kadaluarsa</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Items</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((order) => {
                const sc = statusConfig[order.status];
                return (
                  <tr key={order._id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <p className="font-medium text-text text-xs">#{order.orderNumber}</p>
                      <p className="text-[10px] text-text-secondary">{formatShortDate(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs text-text">{order.customerName}</p>
                      <p className="text-[10px] text-text-secondary">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3 text-xs text-text-secondary hidden sm:table-cell">
                      {order.items.length} produk
                    </td>
                    <td className="px-5 py-3 text-xs font-medium text-text">{formatIDR(order.totalAmount)}</td>
                    <td className="px-5 py-3"><span className={cn("text-[10px]", sc.class)}>{sc.label}</span></td>
                    <td className="px-5 py-3">
                      <Link to={`/admin/orders/${order._id}`} className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors inline-flex">
                        <Eye className="w-3.5 h-3.5" />
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
