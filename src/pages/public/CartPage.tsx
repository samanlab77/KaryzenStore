import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Tag, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { formatIDR } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { coupons as dummyCoupons } from "@/lib/data/dummy";
import { isConvexConfigured } from "@/lib/convexEnv";

export default function CartPage() {
  const { items, removeItem, updateQuantity, couponCode, setCouponCode, getSubtotal, clearCart } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const subtotal = getSubtotal();

  // Server-side validation via Convex when configured, dummy fallback otherwise.
  const validation = useQuery(
    api.coupons.validate,
    isConvexConfigured && couponCode && subtotal > 0
      ? { code: couponCode, subtotal }
      : "skip"
  );

  let discount = 0;
  if (couponCode) {
    if (isConvexConfigured) {
      if (validation?.valid) discount = validation.discount ?? 0;
    } else {
      const coupon = dummyCoupons.find((c) => c.code === couponCode && c.isActive);
      if (coupon) {
        const now = Date.now();
        const isValidPeriod = now >= coupon.startsAt && now <= coupon.expiresAt;
        const meetsMinimum = subtotal >= coupon.minSubtotal;
        const notMaxedOut = !coupon.maxUses || coupon.currentUses < coupon.maxUses;
        if (isValidPeriod && meetsMinimum && notMaxedOut) {
          discount = Math.min(
            Math.floor(subtotal * (coupon.percentage / 100)),
            coupon.maxDiscount || Infinity
          );
        }
      }
    }
  }

  const taxableAmount = subtotal - discount;
  const taxRate = 0.1;
  const tax = Math.floor(taxableAmount * taxRate);
  const total = taxableAmount + tax;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Masukkan kode kupon");
      setCouponSuccess("");
      return;
    }

    if (isConvexConfigured) {
      // Server-side validation happens reactively via the `validate` query;
      // its result (valid / error) is rendered in the summary below.
      setCouponCode(code);
      setCouponError("");
      setCouponSuccess(`Kupon "${code}" diterapkan. Diskon dihitung otomatis.`);
      return;
    }

    // Demo mode: validate against dummy data.
    const coupon = dummyCoupons.find((c) => c.code === code && c.isActive);
    if (!coupon) {
      setCouponError("Kode kupon tidak valid");
      setCouponSuccess("");
      return;
    }
    const now = Date.now();
    if (now < coupon.startsAt || now > coupon.expiresAt) {
      setCouponError("Kupon sudah tidak berlaku");
      setCouponSuccess("");
      return;
    }
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      setCouponError("Kupon sudah mencapai batas pemakaian");
      setCouponSuccess("");
      return;
    }
    if (subtotal < coupon.minSubtotal) {
      setCouponError(`Minimal belanja ${formatIDR(coupon.minSubtotal)} untuk kupon ini`);
      setCouponSuccess("");
      return;
    }

    setCouponCode(code);
    setCouponError("");
    setCouponSuccess(
      `Kupon "${code}" berhasil diterapkan! Diskon ${coupon.percentage}%`
    );
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-text-secondary" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-text mb-3">
          Keranjang Kosong
        </h1>
        <p className="text-text-secondary mb-6">
          Anda belum menambahkan produk ke keranjang.
        </p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-heading font-bold text-text mb-8">
        Keranjang Belanja
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card p-4 flex gap-4">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.slug}`}
                  className="font-heading font-semibold text-sm text-text hover:text-primary transition-colors line-clamp-1"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-text-secondary mt-0.5 capitalize">
                  {item.productType === "license" ? "Lisensi" : "File"}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    {item.productType === "license" ? (
                      <span className="text-xs text-text-secondary">
                        Qty: {item.quantity}
                      </span>
                    ) : (
                      <div className="flex items-center border border-white/10 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-2 py-1 text-xs text-text-secondary hover:text-text"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs text-text border-x border-white/10">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="px-2 py-1 text-xs text-text-secondary hover:text-text"
                        >
                          +
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-bold text-primary text-sm">
                    {formatIDR(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-xs text-text-secondary hover:text-danger transition-colors"
          >
            Hapus Semua
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h3 className="font-heading font-semibold text-text mb-4">
              Ringkasan
            </h3>

            {/* Coupon */}
            <div className="mb-4">
              <p className="text-xs text-text-secondary mb-2 font-medium">
                Kode Kupon
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan kode..."
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="input flex-1 text-sm !py-2"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-3 py-2 rounded-lg border border-white/10 text-sm text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-danger mt-1">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-xs text-success mt-1">{couponSuccess}</p>
              )}
              {isConvexConfigured && couponCode && validation && !validation.valid && (
                <p className="text-xs text-danger mt-1">{validation.error}</p>
              )}
              {isConvexConfigured && couponCode && validation?.valid && (
                <p className="text-xs text-success mt-1">
                  Diskon {validation.percentage}% aktif
                </p>
              )}
            </div>

            <hr className="border-white/5 my-4" />

            {/* Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal ({items.length} produk)</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Diskon</span>
                  <span>-{formatIDR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Pajak (10%)</span>
                <span>{formatIDR(tax)}</span>
              </div>
            </div>

            <hr className="border-white/5 my-4" />

            <div className="flex justify-between mb-6">
              <span className="font-heading font-semibold text-text">
                Total
              </span>
              <span className="font-heading font-bold text-primary text-xl">
                {formatIDR(total)}
              </span>
            </div>

            <Link
              to={isAuthenticated ? "/checkout" : "/sign-in?returnTo=/checkout"}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="block text-center text-xs text-text-secondary hover:text-primary mt-3"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}