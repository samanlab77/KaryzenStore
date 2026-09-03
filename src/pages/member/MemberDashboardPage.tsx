import { Link } from "react-router-dom";
import { Download, Key, ShoppingBag, ArrowRight, Clock } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useOrdersByUser } from "@/lib/hooks";
import { formatIDR, formatShortDate } from "@/lib/utils";

export default function MemberDashboardPage() {
  const { user } = useAuthStore();
  const userOrders = useOrdersByUser(user?.id);
  const paidOrders = userOrders.filter((o) => o.status === "paid");

  const purchasedItems = paidOrders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      purchasedAt: order.paidAt || order.createdAt,
    }))
  );

  const totalSpent = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const fileCount = purchasedItems.filter(
    (i) => i.productType === "file"
  ).length;
  const licenseCount = purchasedItems.filter(
    (i) => i.productType === "license"
  ).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-text mb-1">
          Selamat Datang, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-text-secondary">
          Berikut ringkasan produk digital yang Anda miliki.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-xs text-text-secondary mb-1">Total Pengeluaran</p>
          <p className="text-xl font-heading font-bold text-primary">
            {formatIDR(totalSpent)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-text-secondary mb-1">File Dimiliki</p>
          <p className="text-xl font-heading font-bold text-text">
            {fileCount} produk
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-text-secondary mb-1">Lisensi Aktif</p>
          <p className="text-xl font-heading font-bold text-text">
            {licenseCount} kode
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Riwayat Transaksi",
            href: "/dashboard/orders",
            icon: ShoppingBag,
            desc: "Lihat semua pesanan Anda",
          },
          {
            label: "Lisensi Saya",
            href: "/dashboard/licenses",
            icon: Key,
            desc: "Kode aktivasi produk",
          },
          {
            label: "Pengaturan Akun",
            href: "/dashboard/settings",
            icon: Clock,
            desc: "Ubah profil dan password",
          },
        ].map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="card p-5 group hover:border-primary/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <link.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-text-secondary">{link.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Purchased Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-text">
            Library Saya
          </h2>
          <Link
            to="/products"
            className="text-xs text-primary hover:text-primary-hover"
          >
            + Beli Lagi
          </Link>
        </div>

        {purchasedItems.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-text-secondary mb-4">
              Anda belum memiliki produk.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              Mulai Belanja
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {purchasedItems.map((item, idx) => (
              <div
                key={idx}
                className="card p-4 flex items-center gap-4"
              >
                <img
                  src={item.coverImage}
                  alt={item.productTitle}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.productSlug}`}
                    className="text-sm font-medium text-text hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.productTitle}
                  </Link>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Dibeli {formatShortDate(item.purchasedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.productType === "file" ? (
                    <button className="btn-primary !py-2 !px-3 text-xs flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Unduh
                    </button>
                  ) : (
                    <Link
                      to="/dashboard/licenses"
                      className="badge-primary flex items-center gap-1.5 !bg-primary/10 !text-primary text-xs"
                    >
                      <Key className="w-3 h-3" />
                      Lisensi
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
