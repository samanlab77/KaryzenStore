import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("licenses").collect();
  },
});

export const getByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("licenses")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
  },
});

export const getAvailableByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("licenses")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    return all.filter((l) => l.status === "available");
  },
});

export const getForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userOrders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "paid"))
      .collect();

    const licenseCodes: Array<{
      productTitle: string;
      productSlug: string;
      licenseCode: string;
      coverImage: string;
      unitPrice: number;
    }> = [];

    for (const order of userOrders) {
      for (const item of order.items) {
        if (item.productType === "license" && item.licenseCode) {
          licenseCodes.push({
            productTitle: item.productTitle,
            productSlug: item.productSlug,
            licenseCode: item.licenseCode,
            coverImage: item.coverImage,
            unitPrice: item.unitPrice,
          });
        }
      }
    }

    return licenseCodes;
  },
});

export const assignToOrder = mutation({
  args: { productId: v.id("products"), orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const available = await ctx.db
      .query("licenses")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("status"), "available"))
      .first();

    if (!available) throw new Error("No available license for this product");

    await ctx.db.patch(available._id, {
      status: "sold",
      orderId: args.orderId,
      soldAt: Date.now(),
    });

    return available.code;
  },
});

export const create = mutation({
  args: {
    productId: v.id("products"),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("licenses", {
      ...args,
      status: "available",
    });
  },
});

export const bulkCreate = mutation({
  args: {
    productId: v.id("products"),
    codes: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const code of args.codes) {
      const id = await ctx.db.insert("licenses", {
        productId: args.productId,
        code,
        status: "available",
      });
      ids.push(id);
    }
    return ids;
  },
});

export const block = mutation({
  args: { id: v.id("licenses") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "blocked" });
  },
});
