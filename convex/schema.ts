import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ── Users ──
  users: defineTable({
    externalId: v.string(), // Clerk or auth provider ID
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    role: v.union(
      v.literal("customer"),
      v.literal("staff"),
      v.literal("superadmin")
    ),
    createdAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // ── Categories ──
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    coverImage: v.string(),
    isActive: v.boolean(),
  }).index("by_slug", ["slug"]),

  // ── Products ──
  products: defineTable({
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
    soldCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_status", ["status"])
    .index("by_featured", ["isFeatured"])
    .index("by_soldCount", ["soldCount"]),

  // ── Product Files (versions) ──
  productFiles: defineTable({
    productId: v.id("products"),
    version: v.number(),
    fileName: v.string(),
    storageId: v.optional(v.string()),
    contentType: v.optional(v.string()),
    sizeBytes: v.number(),
    releaseNotes: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_product", ["productId"]),

  // ── Licenses ──
  licenses: defineTable({
    productId: v.id("products"),
    code: v.string(),
    orderId: v.optional(v.id("orders")),
    status: v.union(
      v.literal("available"),
      v.literal("sold"),
      v.literal("blocked")
    ),
    soldAt: v.optional(v.number()),
  })
    .index("by_product", ["productId"])
    .index("by_status", ["status"])
    .index("by_code", ["code"]),

  // ── Orders ──
  orders: defineTable({
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
        licenseCodes: v.optional(v.array(v.string())),
      })
    ),
    couponCode: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
    subtotalAmount: v.number(),
    discountAmount: v.number(),
    taxAmount: v.number(),
    totalAmount: v.number(),
    paymentGateway: v.string(),
    snapToken: v.optional(v.string()),
    snapRedirectUrl: v.optional(v.string()),
    midtransTransactionId: v.optional(v.string()),
    midtransPaymentType: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_orderNumber", ["orderNumber"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // ── Coupons ──
  coupons: defineTable({
    code: v.string(),
    description: v.string(),
    percentage: v.number(),
    minSubtotal: v.number(),
    maxDiscount: v.optional(v.number()),
    startsAt: v.number(),
    expiresAt: v.number(),
    maxUses: v.optional(v.number()),
    currentUses: v.number(),
    isActive: v.boolean(),
  })
    .index("by_code", ["code"])
    .index("by_active", ["isActive"]),
});