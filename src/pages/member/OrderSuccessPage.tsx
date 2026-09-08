import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  XCircle,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatIDR } from "@/lib/utils";

export default function OrderSuccessPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  // Reactive subscription: flips to "paid" automatically once the Midtrans
  // webhook confirms the payment.
  const order = useQuery(
    api.orders.getByOrderNumber,
    orderNumber ? { orderNumber } : "skip"
  );

  const status = order?.status ?? "pending";
  const orderNumberText = order?.orderNumber ?? orderNumber ?? "";
  const isPaid = status === "paid";
  const isFailed = status === "cancelled" || status === "expired";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="card p-8 sm:p-10">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isPaid
                ? "bg-success/10"
                : isFailed
                  ? "bg-danger/10"
                  : "bg-info/10"
            }`}
          >
            {order === undefined ? (
              <Loader2 className="w-10 h-10 text-text-secondary animate-spin" />
            ) : isPaid ? (
              <CheckCircle2 className="w-10 h-10 text-success" />
            ) : isFailed ? (
              <XCircle className="w-10 h-10 text-danger" />
            ) : (
              <Clock className="w-10 h-10 text-info" />
            )}
          </div>

          <h1 className="text-2xl font-heading font-bold text-text mb-3">
            {order === undefined
              ? "Memuat Order..."
              : isPaid
                ? "Pembayaran Berhasil!"
                : isFailed
                  ? "Pembayaran Gagal"
                  : "Menunggu Pembayaran"}
          </h1>

          {order === undefined ? (
            <p className="text-text-secondary mb-6">
              Mengambil status pembayaran Anda...
            </p>
          ) : isPaid ? (
            <>
              <p className="text-text-secondary mb-2">
                Terima kasih atas pembelian Anda.
              </p>
              <p className="text-sm text-text-secondary mb-6">
                Nomor order Anda:
              </p>
              <p className="font-mono font-bold text-primary text-lg mb-6">
                #{orderNumberText}
              </p>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Produk digital Anda sudah tersedia. Silakan cek halaman{" "}
                <strong>Dasbor Saya</strong> untuk mengunduh file atau melihat
                kode lisensi.
              </p>
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Buka Dasbor Saya
                </Link>
                <Link
                  to="/products"
                  className="block text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Lanjut Belanja
                </Link>
              </div>
            </>
          ) : isFailed ? (
            <>
              <p className="text-text-secondary mb-2">
                Pembayaran untuk order ini dibatalkan atau kedaluwarsa.
              </p>
              <p className="font-mono font-bold text-text text-sm mb-8">
                #{orderNumberText}
              </p>
              <div className="space-y-3">
                <Link
                  to="/keranjang"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Coba Lagi
                </Link>
                <Link
                  to="/dashboard/orders"
                  className="block text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Lihat Riwayat Transaksi
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-text-secondary mb-2">
                Pembayaran Anda sedang diproses oleh Midtrans. Halaman ini akan
                diperbarui otomatis setelah pembayaran dikonfirmasi.
              </p>
              <p className="font-mono font-bold text-primary text-lg mb-4">
                #{orderNumberText}
              </p>
              <p className="text-sm text-text-secondary mb-8">
                Total: <strong>{formatIDR(order?.totalAmount ?? 0)}</strong>
              </p>
              <div className="space-y-3">
                <Link
                  to="/dashboard/orders"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Lihat Riwayat Transaksi
                </Link>
                <Link
                  to="/products"
                  className="block text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Lanjut Belanja
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
