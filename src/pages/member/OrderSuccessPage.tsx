import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, LayoutDashboard, Download } from "lucide-react";

export default function OrderSuccessPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="card p-8 sm:p-10">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>

          <h1 className="text-2xl font-heading font-bold text-text mb-3">
            Pembayaran Berhasil!
          </h1>

          <p className="text-text-secondary mb-2">
            Terima kasih atas pembelian Anda.
          </p>
          <p className="text-sm text-text-secondary mb-6">
            Nomor order Anda:
          </p>
          <p className="font-mono font-bold text-primary text-lg mb-6">
            #{orderNumber}
          </p>

          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            Produk digital Anda sudah tersedia. Silakan cek halaman{" "}
            <strong>Dasbor Saya</strong> untuk mengunduh file atau melihat kode
            lisensi.
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
        </div>
      </div>
    </div>
  );
}
