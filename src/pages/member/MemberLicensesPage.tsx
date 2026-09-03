import { useAuthStore } from "@/stores/authStore";
import { useLicensesForUser } from "@/lib/hooks";
import { Key, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function MemberLicensesPage() {
  const { user } = useAuthStore();
  const licenseCodes = useLicensesForUser(user?.id);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text mb-1">
        Lisensi & Kode Aktivasi
      </h1>
      <p className="text-text-secondary text-sm mb-8">
        Semua kode lisensi produk yang Anda miliki.
      </p>

      {licenseCodes.length === 0 ? (
        <div className="card p-8 text-center">
          <Key className="w-10 h-10 text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary mb-4">
            Anda belum memiliki kode lisensi.
          </p>
          <Link
            to="/products"
            className="text-sm text-primary hover:text-primary-hover"
          >
            Beli Produk Lisensi
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {licenseCodes.map((item, i) => (
            <div key={i} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={item.coverImage}
                  alt={item.productTitle}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.productSlug}`}
                    className="text-sm font-medium text-text hover:text-primary transition-colors"
                  >
                    {item.productTitle}
                  </Link>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {item.unitPrice > 0 ? "Pembelian" : "Gratis"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-mono font-medium">
                    {item.licenseCode}
                  </code>
                  <span className="badge-success text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
