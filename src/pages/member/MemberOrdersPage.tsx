import { useAuthStore } from "@/stores/authStore";
import { useOrdersByUser } from "@/lib/hooks";
import { formatIDR, formatShortDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const statusConfig = {
  paid: { label: "Lunas", class: "badge-success" },
  pending: { label: "Menunggu", class: "badge-warning" },
  cancelled: { label: "Dibatalkan", class: "badge-danger" },
  expired: { label: "Kadaluarsa", class: "badge-muted" },
};

export default function MemberOrdersPage() {
  const { user } = useAuthStore();
  const userOrders = useOrdersByUser(user?.id);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text mb-1">
        Riwayat Transaksi
      </h1>
      <p className="text-text-secondary text-sm mb-8">
        Semua pesanan dan riwayat pembayaran Anda.
      </p>

      {userOrders.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-secondary mb-4">
            Belum ada riwayat transaksi.
          </p>
          <Link
            to="/products"
            className="text-sm text-primary hover:text-primary-hover"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const sc = statusConfig[order.status];
            return (
              <div key={order._id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-heading font-semibold text-text text-sm">
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {formatShortDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-xs", sc.class)}>{sc.label}</span>
                    <span className="font-heading font-bold text-primary">
                      {formatIDR(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.coverImage}
                        alt={item.productTitle}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text line-clamp-1">
                          {item.productTitle}
                        </p>
                        <p className="text-[10px] text-text-secondary">
                          {item.quantity} × {formatIDR(item.unitPrice)}
                          {item.licenseCode && (
                            <span className="ml-2 text-primary">
                              Lisensi: {item.licenseCode}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-3 mt-3 text-xs text-text-secondary space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatIDR(order.subtotalAmount)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Diskon</span>
                      <span>-{formatIDR(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Pajak</span>
                    <span>{formatIDR(order.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-text">
                    <span>Total</span>
                    <span>{formatIDR(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
