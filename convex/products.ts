import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("products").collect();
    return all.filter((p) => p.status === "active");
  },
});

export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("products").collect();
    return all.filter((p) => p.isFeatured && p.status === "active");
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();
    return all.filter((p) => p.status === "active");
  },
});

export const search = query({
  args: {
    query: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    maxPrice: v.optional(v.number()),
    sortBy: v.optional(
      v.union(
        v.literal("default"),
        v.literal("price-asc"),
        v.literal("price-desc"),
        v.literal("newest")
      )
    ),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    if (args.query) {
      const q = args.query.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (args.categoryId) {
      results = results.filter((p) => p.categoryId === args.categoryId);
    }

    if (args.maxPrice) {
      results = results.filter((p) => p.price <= args.maxPrice!);
    }

    switch (args.sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        results.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return results;
  },
});

export const topSelling = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    const all = await ctx.db
      .query("products")
      .withIndex("by_soldCount")
      .order("desc")
      .take(limit);
    return all;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    productType: v.union(v.literal("file"), v.literal("license")),
    categoryId: v.id("categories"),
    coverImage: v.string(),
    isFeatured: v.boolean(),
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("archived")
    ),
    licenseCount: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      soldCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    productType: v.optional(v.union(v.literal("file"), v.literal("license"))),
    categoryId: v.optional(v.id("categories")),
    coverImage: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("active"),
        v.literal("archived")
      )
    ),
    licenseCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value;
    }
    await ctx.db.patch(id, updates);
  },
});

export const incrementSold = mutation({
  args: { id: v.id("products"), amount: v.number() },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");
    await ctx.db.patch(args.id, {
      soldCount: product.soldCount + args.amount,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
