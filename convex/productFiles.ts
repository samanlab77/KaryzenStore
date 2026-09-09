import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ──

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

/**
 * Returns the active downloadable file for each product id in the list.
 * Used by the member library to render download buttons in bulk.
 */
export const getActiveForProducts = query({
  args: { productIds: v.array(v.id("products")) },
  handler: async (ctx, args) => {
    const result: Array<{
      productId: string;
      fileId: string;
      fileName: string;
      sizeBytes: number;
      version: number;
    }> = [];

    for (const productId of args.productIds) {
      const files = await ctx.db
        .query("productFiles")
        .withIndex("by_product", (q) => q.eq("productId", productId))
        .collect();
      const active = files
        .filter((f) => f.isActive && f.storageId)
        .sort((a, b) => b.version - a.version)[0];
      if (active) {
        result.push({
          productId,
          fileId: active._id,
          fileName: active.fileName,
          sizeBytes: active.sizeBytes,
          version: active.version,
        });
      }
    }
    return result;
  },
});

/**
 * Download URL for a product file — only for users who own the product
 * (have at least one PAID order containing it).
 */
export const getDownloadUrl = query({
  args: { fileId: v.id("productFiles"), email: v.string() },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file || !file.storageId) {
      return { authorized: false as const, url: null, fileName: null };
    }

    // Resolve buyer by email (Clerk or demo account is synced into `users`).
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) {
      return { authorized: false as const, url: null, fileName: null };
    }

    // Ownership = at least one paid order that includes this product.
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "paid"))
      .collect();
    const owns = orders.some((o) =>
      o.items.some((i) => i.productId === file.productId)
    );
    if (!owns) {
      return { authorized: false as const, url: null, fileName: null };
    }

    const url = await ctx.storage.getUrl(file.storageId);
    return { authorized: true as const, url, fileName: file.fileName };
  },
});

// ── Mutations ──

/** Short-lived upload URL for Convex Storage (admin uploads a file version). */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    productId: v.id("products"),
    fileName: v.string(),
    storageId: v.optional(v.string()),
    contentType: v.optional(v.string()),
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
      productId: args.productId,
      fileName: args.fileName,
      storageId: args.storageId,
      contentType: args.contentType,
      sizeBytes: args.sizeBytes,
      releaseNotes: args.releaseNotes,
      isActive: args.isActive,
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

/** Set exactly one version active for a product (deactivates siblings). */
export const setActive = mutation({
  args: { id: v.id("productFiles") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) throw new Error("File not found");
    const siblings = await ctx.db
      .query("productFiles")
      .withIndex("by_product", (q) => q.eq("productId", file.productId))
      .collect();
    for (const s of siblings) {
      if (s.isActive) await ctx.db.patch(s._id, { isActive: false });
    }
    await ctx.db.patch(args.id, { isActive: true });
  },
});

export const remove = mutation({
  args: { id: v.id("productFiles") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) throw new Error("File not found");
    if (file.storageId) {
      try {
        await ctx.storage.delete(file.storageId);
      } catch {
        // storage object may already be gone; still remove the record
      }
    }
    await ctx.db.delete(args.id);
  },
});
