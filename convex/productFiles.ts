import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("productFiles")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    return all.sort((a, b) => b.version - a.version);
  },
});

export const getActiveByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("productFiles")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    return all
      .filter((f) => f.isActive)
      .sort((a, b) => b.version - a.version);
  },
});

export const create = mutation({
  args: {
    productId: v.id("products"),
    fileName: v.string(),
    sizeBytes: v.number(),
    releaseNotes: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("productFiles")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    const nextVersion =
      existing.length > 0
        ? Math.max(...existing.map((f) => f.version)) + 1
        : 1;

    return await ctx.db.insert("productFiles", {
      ...args,
      version: nextVersion,
      createdAt: Date.now(),
    });
  },
});

export const toggleActive = mutation({
  args: { id: v.id("productFiles") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) throw new Error("File not found");
    await ctx.db.patch(args.id, { isActive: !file.isActive });
  },
});
