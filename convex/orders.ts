import { query, mutation } from "./_generated/server";
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
