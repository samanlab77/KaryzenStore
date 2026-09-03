import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Percent,
  DollarSign,
  BarChart3,
} from "lucide-react";
import {
  getTotalRevenue,
  getTotalTax,
  getTotalDiscount,
  getPaidOrders,
  products,
  coupons,
} from "@/lib/data/dummy";
import { formatIDR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AdminReportsPage() {
  const revenue = getTotalRevenue();
  const tax = getTotalTax();
  const discount = getTotalDiscount();
  const netIncome = revenue - discount;
  const paidCount = getPaidOrders().length;

  // Top products
  const topProducts = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);

  // Coupon usage
  const usedCoupons = coupons.filter((c) => c.currentUses > 0);

  // Monthly revenue estimate (last 6 months)
  const months = [
    { label: "Feb", revenue: 820000 },
    { label: "Mar", revenue: 1250000 },
    { label: "Apr", revenue: 980000 },
    { label: "Mei", revenue: 1540000 },
    { label: "Jun", revenue: 1890000 },
    { label: "Jul", revenue: 2100000 },
  ];
  const maxRevenue = Math.max(...months.map((m) => m.revenue));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-text mb-1">
          Laporan Penjualan
        </h1>
        <p className="text-text-secondary text-sm">
          Ringkasan keuangan dan performa toko.
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <p className="text-xs text-text-secondary">Total Pendapatan Kotor</p>
          </div>
          <p className="text-xl font-heading font-bold text-text">
            {formatIDR(revenue)}
          </p>
          <p className="text-[10px] text-text-secondary mt-1">
            Dari {paidCount} pesanan lunas
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-danger" />
            <p className="text-xs text-text-secondary">Total Pajak</p>
          </div>
          <p className="text-xl font-heading font-bold text-text">
            {formatIDR(tax)}
          </p>
          <p className="text-[10px] text-text-secondary mt-1">
            10% dari subtotal
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-info" />
            <p className="text-xs text-text-secondary">Total Diskon</p>
          </div>
          <p className="text-xl font-heading font-bold text-text">
            {formatIDR(discount)}
          </p>
          <p className="text-[10px] text-text-secondary mt-1">
            Penggunaan kupon diskon
          </p>
        </div>

        <div className="card p-5 border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <p className="text-xs text-text-secondary">Pendapatan Bersih</p>
          </div>
          <p className="text-xl font-heading font-bold text-success">
            {formatIDR(netIncome)}
          </p>
          <p className="text-[10px] text-text-secondary mt-1">
            Setelah diskon
          </p>
        </div>
      </div>

      {/* Revenue Chart (simple bar chart) */}
      <div className="card p-6 mb-8">
        <h3 className="font-heading font-semibold text-sm text-text mb-6">
          Grafik Pendapatan (6 Bulan Terakhir)
        </h3>
        <div className="flex items-end gap-3 h-48">
          {months.map((m) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-text-secondary">
                {formatIDR(m.revenue)}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary transition-all duration-300"
                style={{
                  height: `${(m.revenue / maxRevenue) * 100}%`,
                  minHeight: "4px",
                }}
              />
              <span className="text-[10px] text-text-secondary">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-sm text-text mb-4">
            Produk Terlaris
          </h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]"
              >
                <span className="text-lg font-heading font-bold text-primary w-6 text-center">
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
                    {p.soldCount} terjual • {formatIDR(p.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-primary">
                    {formatIDR(p.price * p.soldCount)}
                  </p>
                  <p className="text-[10px] text-text-secondary">pendapatan</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Usage */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-sm text-text mb-4">
            Penggunaan Kupon
          </h3>
          <div className="space-y-3">
            {usedCoupons.map((c) => {
              const usagePercent = c.maxUses
                ? (c.currentUses / c.maxUses) * 100
                : 50;
              return (
                <div
                  key={c.id}
                  className="p-3 rounded-lg bg-white/[0.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-text">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-text-secondary">
                      {c.percentage}% diskon
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-text-secondary">
                      {c.currentUses}
                      {c.maxUses ? `/${c.maxUses}` : ""} pemakaian
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
