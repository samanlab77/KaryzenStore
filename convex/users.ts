import {
  query,
  mutation,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { v } from "convex/values";

export const getByExternalId = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("customer"),
      v.literal("staff"),
      v.literal("superadmin")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const upsert = mutation({
  args: {
    externalId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    role: v.union(
      v.literal("customer"),
      v.literal("staff"),
      v.literal("superadmin")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        avatarUrl: args.avatarUrl,
      });
      return existing._id;
    }
    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ── Internal helpers (used by the Clerk sync action in convex/auth.ts) ──

export const updateFromClerk = internalMutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      externalId: args.externalId,
    });
  },
});

export const insertClerkUser = internalMutation({
  args: {
    externalId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    role: v.union(
      v.literal("customer"),
      v.literal("staff"),
      v.literal("superadmin")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const countAdmins = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.filter(
      (u) => u.role === "staff" || u.role === "superadmin"
    ).length;
  },
});