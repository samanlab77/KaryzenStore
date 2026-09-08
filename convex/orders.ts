import {
  query,
  mutation,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("orders").collect();
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .unique();
  },
});

export const listPaid = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "paid"))
      .collect();
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    orderNumber: v.string(),
    userId: v.id("users"),
    customerName: v.string(),
    customerEmail: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productTitle: v.string(),
        productSlug: v.string(),
        productType: v.union(v.literal("file"), v.literal("license")),
        coverImage: v.string(),
        unitPrice: v.number(),
        quantity: v.number(),
        licenseCode: v.optional(v.string()),
      })
    ),
    couponCode: v.optional(v.string()),
    subtotalAmount: v.number(),
    discountAmount: v.number(),
    taxAmount: v.number(),
    totalAmount: v.number(),
    paymentGateway: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Server-side checkout: validates products + coupon, computes prices from
 * the database (never trusts client amounts) and creates a pending order.
 */
export const createFromCart = mutation({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      })
    ),
    couponCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.items.length === 0) throw new Error("Keranjang kosong");

    // Resolve the buyer by email (works for Clerk-synced and demo users).
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.customerEmail))
      .unique();
    if (!user) {
      const userId = await ctx.db.insert("users", {
        externalId: `email:${args.customerEmail}`,
        email: args.customerEmail,
        name: args.customerName,
        avatarUrl: "",
        role: "customer",
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }
    if (!user) throw new Error("Gagal membuat akun pengguna");

    let subtotal = 0;
    const orderItems: Array<{
      productId: any;
      productTitle: string;
      productSlug: string;
      productType: "file" | "license";
      coverImage: string;
      unitPrice: number;
      quantity: number;
    }> = [];

    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product || product.status !== "active") {
        throw new Error("Produk tidak ditemukan atau tidak aktif");
      }
      if (product.productType === "license") {
        const available = await ctx.db
          .query("licenses")
          .withIndex("by_product", (q) => q.eq("productId", product._id))
          .filter((q) => q.eq(q.field("status"), "available"))
          .collect();
        if (available.length < item.quantity) {
          throw new Error(`Stok lisensi tidak cukup untuk ${product.title}`);
        }
      }
      subtotal += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        productTitle: product.title,
        productSlug: product.slug,
        productType: product.productType,
        coverImage: product.coverImage,
        unitPrice: product.price,
        quantity: item.quantity,
      });
    }

    let discount = 0;
    if (args.couponCode) {
      const coupon = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", args.couponCode!))
        .unique();
      if (!coupon || !coupon.isActive) throw new Error("Kode kupon tidak valid");
      const now = Date.now();
      if (now < coupon.startsAt || now > coupon.expiresAt)
        throw new Error("Kupon sudah tidak berlaku");
      if (coupon.maxUses && coupon.currentUses >= coupon.maxUses)
        throw new Error("Kupon sudah mencapai batas pemakaian");
      if (subtotal < coupon.minSubtotal)
        throw new Error("Minimal belanja untuk kupon ini belum terpenuhi");
      discount = Math.min(
        Math.floor(subtotal * (coupon.percentage / 100)),
        coupon.maxDiscount || Infinity
      );
    }

    const taxAmount = Math.floor((subtotal - discount) * 0.1);
    const totalAmount = subtotal - discount + taxAmount;
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = String(Math.floor(Math.random() * 9999)).padStart(4, "0");
    const orderNumber = `KZN-${datePart}-${randomPart}`;

    return await ctx.db.insert("orders", {
      orderNumber,
      userId: user._id,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      items: orderItems,
      couponCode: args.couponCode,
      status: "pending",
      subtotalAmount: subtotal,
      discountAmount: discount,
      taxAmount,
      totalAmount: totalAmount,
      paymentGateway: "midtrans",
      createdAt: Date.now(),
    });
  },
});

export const markPaid = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "paid",
      paidAt: Date.now(),
    });
  },
});

export const cancel = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "cancelled" });
  },
});

export const totalRevenue = query({
  args: {},
  handler: async (ctx) => {
    const paid = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "paid"))
      .collect();
    return paid.reduce((sum, o) => sum + o.totalAmount, 0);
  },
});

export const totalTax = query({
  args: {},
  handler: async (ctx) => {
    const paid = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "paid"))
      .collect();
    return paid.reduce((sum, o) => sum + o.taxAmount, 0);
  },
});

export const totalDiscount = query({
  args: {},
  handler: async (ctx) => {
    const paid = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "paid"))
      .collect();
    return paid.reduce((sum, o) => sum + o.discountAmount, 0);
  },
});

// ── Internal helpers (used by checkout flow + Midtrans webhook) ──

export const getInternal = internalQuery({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByOrderNumberInternal = internalQuery({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .unique();
  },
});

export const setSnapToken = internalMutation({
  args: {
    id: v.id("orders"),
    token: v.string(),
    redirectUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      snapToken: args.token,
      snapRedirectUrl: args.redirectUrl,
    });
  },
});

export const setStatus = internalMutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

/** Only transition pending orders — never downgrade an already-paid order. */
export const setStatusIfPending = internalMutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.status === "paid") return;
    await ctx.db.patch(args.id, { status: args.status });
  },
});

/**
 * Fulfillment after Midtrans confirms a successful payment:
 * - marks the order paid,
 * - assigns available license codes to license items,
 * - bumps product sold counts,
 * - increments coupon usage.
 * Runs atomically inside a single mutation.
 */
export const fulfillPayment = internalMutation({
  args: {
    id: v.id("orders"),
    transactionId: v.optional(v.string()),
    paymentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    if (order.status === "paid") return;

    const items: typeof order.items = [];
    for (const item of order.items) {
      const codes: string[] = item.licenseCode ? [item.licenseCode] : [];
      if (item.productType === "license") {
        const available = await ctx.db
          .query("licenses")
          .withIndex("by_product", (q) => q.eq("productId", item.productId))
          .filter((q) => q.eq(q.field("status"), "available"))
          .take(item.quantity);
        for (const license of available) {
          await ctx.db.patch(license._id, {
            status: "sold",
            orderId: order._id,
            soldAt: Date.now(),
          });
          codes.push(license.code);
        }
      }
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          soldCount: product.soldCount + item.quantity,
        });
      }
      items.push({
        ...item,
        licenseCodes: codes.length > 0 ? codes : undefined,
      });
    }

    await ctx.db.patch(order._id, {
      status: "paid",
      paidAt: Date.now(),
      items,
      midtransTransactionId: args.transactionId,
      midtransPaymentType: args.paymentType,
    });

    if (order.couponCode) {
      const coupon = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", order.couponCode!))
        .unique();
      if (coupon) {
        await ctx.db.patch(coupon._id, {
          currentUses: coupon.currentUses + 1,
        });
      }
    }
  },
});