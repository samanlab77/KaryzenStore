import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("coupons").collect();
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();
  },
});

export const get = query({
  args: { id: v.id("coupons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const validate = query({
  args: { code: v.string(), subtotal: v.number() },
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();
    if (!coupon) return { valid: false, error: "Kode kupon tidak valid" };
    if (!coupon.isActive)
      return { valid: false, error: "Kupon tidak aktif" };
    const now = Date.now();
    if (now < coupon.startsAt)
      return { valid: false, error: "Kupon belum berlaku" };
    if (now > coupon.expiresAt)
      return { valid: false, error: "Kupon sudah tidak berlaku" };
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses)
      return {
        valid: false,
        error: "Kupon sudah mencapai batas pemakaian",
      };
    if (args.subtotal < coupon.minSubtotal)
      return {
        valid: false,
        error: `Minimal belanja Rp${coupon.minSubtotal.toLocaleString("id-ID")} untuk kupon ini`,
      };

    const discount = Math.min(
      Math.floor(args.subtotal * (coupon.percentage / 100)),
      coupon.maxDiscount || Infinity
    );
    return {
      valid: true,
      coupon,
      discount,
      percentage: coupon.percentage,
    };
  },
});

export const create = mutation({
  args: {
    code: v.string(),
    description: v.string(),
    percentage: v.number(),
    minSubtotal: v.number(),
    maxDiscount: v.optional(v.number()),
    startsAt: v.number(),
    expiresAt: v.number(),
    maxUses: v.optional(v.number()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("coupons", {
      ...args,
      currentUses: 0,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("coupons"),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    percentage: v.optional(v.number()),
    minSubtotal: v.optional(v.number()),
    maxDiscount: v.optional(v.number()),
    startsAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value;
    }
    await ctx.db.patch(id, updates);
  },
});

export const incrementUses = mutation({
  args: { id: v.id("coupons") },
  handler: async (ctx, args) => {
    const coupon = await ctx.db.get(args.id);
    if (!coupon) throw new Error("Coupon not found");
    await ctx.db.patch(args.id, {
      currentUses: coupon.currentUses + 1,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("coupons") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
