import {
  TrendingUp,
  ShoppingBag,
  Package,
  ArrowUpRight,
} from "lucide-react";
import {
  useTotalRevenue,
  useTotalTax,
  useTotalDiscount,
  useAllOrders,
  useTopProducts,
} from "@/lib/hooks";
import { products } from "@/lib/data/dummy";
import { formatIDR, formatShortDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const statusConfig = {
  paid: { label: "Lunas", class: "badge-success" },
  pending: { label: "Menunggu", class: "badge-warning" },
  cancelled: { label: "Dibatalkan", class: "badge-danger" },
  expired: { label: "Kadaluarsa", class: "badge-muted" },
};

export default function AdminDashboardPage() {
  const revenue = useTotalRevenue();
  const tax = useTotalTax();
  const discount = useTotalDiscount();
  const netIncome = revenue - tax - discount;
  const allOrders = useAllOrders();
  const topProducts = useTopProducts(5);
  const activeProducts = products.filter((p) => p.status === "active").length;

  const recentOrders = allOrders.slice(0, 5);

  const stats = [
    {
      label: "Total Pendapatan",
      value: formatIDR(revenue),
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pendapatan Bersih",
      value: formatIDR(netIncome),
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Total Pesanan",
      value: allOrders.length.toString(),
      icon: ShoppingBag,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Produk Aktif",
      value: activeProducts.toString(),
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-text mb-1">
          Dashboard Admin
        </h1>
        <p className="text-text-secondary text-sm">
          Ringkasan performa toko Karyzen Store.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-text-secondary">{stat.label}</p>
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-4.5 h-4.5", stat.color)} />
              </div>
            </div>
            <p className="text-xl font-heading font-bold text-text">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-6 mb-8">
        <h3 className="font-heading font-semibold text-sm text-text mb-4">
          Ringkasan Keuangan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-text-secondary mb-1">Total Pajak</p>
            <p className="text-lg font-heading font-bold text-text">
              {formatIDR(tax)}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-text-secondary mb-1">Total Diskon</p>
            <p className="text-lg font-heading font-bold text-text">
              {formatIDR(discount)}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-success/5">
            <p className="text-xs text-text-secondary mb-1">
              Pendapatan Bersih
            </p>
            <p className="text-lg font-heading font-bold text-success">
              {formatIDR(netIncome)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm text-text">
              Pesanan Terbaru
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs text-primary hover:text-primary-hover flex items-center gap-1"
            >
              Lihat Semua
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const sc = statusConfig[order.status];
              return (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text truncate">
                      #{order.orderNumber}
                    </p>
                    <p className="text-[10px] text-text-secondary">
                      {order.customerName} • {formatShortDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px]", sc.class)}>
                      {sc.label}
                    </span>
                    <span className="text-xs font-medium text-text">
                      {formatIDR(order.totalAmount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm text-text">
              Produk Terlaris
            </h3>
            <Link
              to="/admin/products"
              className="text-xs text-primary hover:text-primary-hover flex items-center gap-1"
            >
              Kelola Produk
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div
                key={p._id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]"
              >
                <span className="text-xs font-bold text-text-secondary w-5">
                  {i + 1}
                </span>
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text truncate">
                    {p.title}
                  </p>
                  <p className="text-[10px] text-text-secondary">
                    {p.soldCount} terjual
                  </p>
                </div>
                <span className="text-xs font-medium text-primary">
                  {formatIDR(p.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
