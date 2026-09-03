import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { orders } from "@/lib/data/dummy";
import { formatIDR, formatDate, formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusConfig = {
  paid: { label: "Lunas", class: "badge-success" },
  pending: { label: "Menunggu", class: "badge-warning" },
  cancelled: { label: "Dibatalkan", class: "badge-danger" },
  expired: { label: "Kadaluarsa", class: "badge-muted" },
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Pesanan tidak ditemukan.</p>
        <Link to="/admin/orders" className="text-primary text-sm mt-2 inline-block">
          Kembali ke Pesanan
        </Link>
      </div>
    );
  }

  const sc = statusConfig[order.status];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/orders" className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">
            Detail Pesanan
          </h1>
          <p className="text-sm text-text-secondary">#{order.orderNumber}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Info */}
        <div className="card p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-secondary mb-1">Nomor Order</p>
              <p className="text-sm font-medium text-text font-mono">#{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Status</p>
              <span className={cn("text-xs", sc.class)}>{sc.label}</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Tanggal</p>
              <p className="text-sm text-text">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Pembayaran</p>
              <p className="text-sm text-text capitalize">{order.paymentGateway || "-"}</p>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-sm text-text mb-3">Pelanggan</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Nama</span>
              <span className="text-text">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Email</span>
              <span className="text-text">{order.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">User ID</span>
              <code className="text-xs bg-white/5 px-2 py-0.5 rounded text-text-secondary">{order.userId}</code>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-sm text-text mb-3">Item</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                <img src={item.coverImage} alt={item.productTitle} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text line-clamp-1">{item.productTitle}</p>
                  <p className="text-[10px] text-text-secondary">
                    {item.quantity} × {formatIDR(item.unitPrice)}
                    {item.licenseCode && <span className="ml-2 text-primary">Lisensi: {item.licenseCode}</span>}
                  </p>
                </div>
                <span className="text-xs font-medium text-text">{formatIDR(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-sm text-text mb-3">Ringkasan Pembayaran</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatIDR(order.subtotalAmount)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-success">
                <span>Diskon {order.couponCode && `(${order.couponCode})`}</span>
                <span>-{formatIDR(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-text-secondary">
              <span>Pajak</span>
              <span>{formatIDR(order.taxAmount)}</span>
            </div>
            <hr className="border-white/5" />
            <div className="flex justify-between font-heading font-bold text-text">
              <span>Total</span>
              <span className="text-primary">{formatIDR(order.totalAmount)}</span>
            </div>
          </div>

          {order.status === "pending" && (
            <button className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Tandai sebagai Lunas
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
