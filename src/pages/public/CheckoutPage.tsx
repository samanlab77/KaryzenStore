import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { formatIDR } from "@/lib/utils";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { loadSnap, midtransClientKey } from "@/lib/midtrans";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, couponCode, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState(user?.email || "");

  const createOrder = useMutation(api.orders.createFromCart);
  const createSnapTransaction = useAction(api.midtrans.createSnapTransaction);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-text mb-4">
          Silakan Masuk
        </h1>
        <p className="text-text-secondary mb-6">
          Anda perlu masuk untuk melanjutkan checkout.
        </p>
        <Link to="/sign-in?returnTo=/checkout" className="btn-primary">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-text mb-4">
          Keranjang Kosong
        </h1>
        <p className="text-text-secondary mb-6">
          Tambahkan produk ke keranjang terlebih dahulu.
        </p>
        <Link to="/products" className="btn-primary">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = 0; // recomputed server-side at checkout
  const taxableAmount = subtotal - discount;
  const tax = Math.floor(taxableAmount * 0.1);
  const total = taxableAmount + tax;

  const handlePay = async () => {
    if (!user) return;
    setError("");
    setIsProcessing(true);
    try {
      const orderId = await createOrder({
        customerName: user.name,
        customerEmail: email.trim() || user.email,
        items: items.map((i) => ({
          productId: i.productId as any,
          quantity: i.quantity,
        })),
        couponCode: couponCode ?? undefined,
      });

      const snap = await createSnapTransaction({ orderId });
      await loadSnap(midtransClientKey);

      window.snap?.pay(snap.token, {
        onSuccess: () => {
          clearCart();
          navigate(`/order/${snap.orderNumber}/success`);
        },
        onPending: () => {
          clearCart();
          navigate(`/order/${snap.orderNumber}/success`);
        },
        onError: () => {
          setIsProcessing(false);
          setError("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      console.error("Checkout error:", err);
      setIsProcessing(false);
      setError(
        err?.message?.includes("belum siap") || err?.message?.includes("konfigurasi")
          ? err.message
          : "Gagal memproses checkout. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/keranjang"
          className="text-text-secondary hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-heading font-bold text-text">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Order Info */}
        <div className="lg:col-span-3 space-y-6">
          {/* Items */}
          <div className="card p-5">
            <h3 className="font-heading font-semibold text-sm text-text mb-4">
              Produk yang Dibeli
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Qty: {item.quantity} × {formatIDR(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-text">
                    {formatIDR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="card p-5">
            <h3 className="font-heading font-semibold text-sm text-text mb-4">
              Email Pengiriman
            </h3>
            <input
              type="email"
              placeholder="email@anda.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
            />
            <p className="text-xs text-text-secondary mt-2">
              Konfirmasi dan tautan unduhan akan dikirim ke email ini.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="card p-5">
            <h3 className="font-heading font-semibold text-sm text-text mb-4">
              Metode Pembayaran
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Virtual Account", "QRIS", "E-Wallet", "Transfer Bank"].map(
                (method) => (
                  <div
                    key={method}
                    className="p-3 rounded-lg border border-white/10 text-center text-xs text-text-secondary hover:border-primary/40 hover:text-text cursor-pointer transition-all"
                  >
                    {method}
                  </div>
                )
              )}
            </div>
            <p className="text-xs text-text-secondary mt-3">
              Pembayaran diproses melalui Midtrans Snap.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-20">
            <h3 className="font-heading font-semibold text-text mb-4">
              Ringkasan Pembayaran
            </h3>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
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

            {error && (
              <div className="flex items-start gap-2 text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyiapkan Pembayaran...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Bayar Sekarang
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-secondary">
              <Shield className="w-3.5 h-3.5" />
              Pembayaran aman & terenkripsi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}