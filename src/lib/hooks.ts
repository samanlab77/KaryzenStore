import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  categories as dummyCategories,
  products as dummyProducts,
  coupons as dummyCoupons,
  orders as dummyOrders,
  userProfiles,
  getActiveProducts,
  getFeaturedProducts,
  getProductBySlug,
  getCategoryBySlug,
  getOrdersByUser,
  getPaidOrders,
  getTotalRevenue,
  getTotalTax,
  getTotalDiscount,
} from "@/lib/data/dummy";
import type { Id } from "../../convex/_generated/dataModel";
import type {
  NormalizedProduct,
  NormalizedCategory,
  NormalizedOrder,
  NormalizedCoupon,
  NormalizedLicenseCode,
  NormalizedUser,
  NormalizedProductFile,
} from "@/lib/types";

export const isConvexConfigured = !!import.meta.env.VITE_CONVEX_URL;

// ── Normalization helpers ──

function normalizeProduct(p: any): NormalizedProduct {
  return {
    _id: (p._id as string) ?? (p.id as string) ?? "",
    id: (p.id as string) ?? (p._id as string) ?? "",
    title: p.title as string,
    slug: p.slug as string,
    shortDescription: p.shortDescription as string,
    description: p.description as string,
    price: p.price as number,
    compareAtPrice: p.compareAtPrice as number | undefined,
    productType: p.productType as "file" | "license",
    categoryId: p.categoryId as string,
    coverImage: p.coverImage as string,
    isFeatured: p.isFeatured as boolean,
    status: p.status as "draft" | "active" | "archived",
    licenseCount: p.licenseCount as number,
    soldCount: p.soldCount as number,
    createdAt: p.createdAt as number,
    updatedAt: p.updatedAt as number,
  };
}

function normalizeCategory(c: any): NormalizedCategory {
  return {
    _id: (c._id as string) ?? (c.id as string) ?? "",
    id: (c.id as string) ?? (c._id as string) ?? "",
    name: c.name as string,
    slug: c.slug as string,
    description: c.description as string,
    coverImage: c.coverImage as string,
    isActive: c.isActive as boolean,
  };
}

function normalizeOrder(o: any): NormalizedOrder {
  return {
    _id: (o._id as string) ?? (o.id as string) ?? "",
    id: (o.id as string) ?? (o._id as string) ?? "",
    orderNumber: o.orderNumber as string,
    userId: o.userId as string,
    customerName: o.customerName as string,
    customerEmail: o.customerEmail as string,
    items: o.items as NormalizedOrder["items"],
    couponCode: o.couponCode as string | undefined,
    status: o.status as "pending" | "paid" | "cancelled" | "expired",
    subtotalAmount: o.subtotalAmount as number,
    discountAmount: o.discountAmount as number,
    taxAmount: o.taxAmount as number,
    totalAmount: o.totalAmount as number,
    paymentGateway: o.paymentGateway as string,
    paidAt: o.paidAt as number | undefined,
    createdAt: o.createdAt as number,
  };
}

function normalizeCoupon(c: any): NormalizedCoupon {
  return {
    _id: (c._id as string) ?? (c.id as string) ?? "",
    id: (c.id as string) ?? (c._id as string) ?? "",
    code: c.code as string,
    description: c.description as string,
    percentage: c.percentage as number,
    minSubtotal: c.minSubtotal as number,
    maxDiscount: c.maxDiscount as number | undefined,
    startsAt: c.startsAt as number,
    expiresAt: c.expiresAt as number,
    maxUses: c.maxUses as number | undefined,
    currentUses: c.currentUses as number,
    isActive: c.isActive as boolean,
  };
}

function normalizeUser(u: any): NormalizedUser {
  return {
    _id: (u._id as string) ?? (u.id as string) ?? "",
    id: (u.id as string) ?? (u._id as string) ?? "",
    email: u.email as string,
    name: u.name as string,
    avatarUrl: u.avatarUrl as string,
    role: u.role as "customer" | "staff" | "superadmin",
    createdAt: u.createdAt as number,
  };
}

// ── Categories ──
export function useCategories(): NormalizedCategory[] {
  const convexCategories = useQuery(
    api.categories.listActive,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || convexCategories === undefined) {
    return dummyCategories.filter((c) => c.isActive).map(normalizeCategory);
  }
  return convexCategories.map(normalizeCategory);
}

export function useAllCategories(): NormalizedCategory[] {
  const convexCategories = useQuery(
    api.categories.list,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || convexCategories === undefined) {
    return dummyCategories.map(normalizeCategory);
  }
  return convexCategories.map(normalizeCategory);
}

export function useCategoryBySlug(
  slug: string | undefined
): NormalizedCategory | undefined {
  const convexCategory = useQuery(
    api.categories.getBySlug,
    isConvexConfigured && slug ? { slug } : "skip"
  );
  if (!isConvexConfigured || convexCategory === undefined) {
    return slug
      ? normalizeCategory(getCategoryBySlug(slug) ?? dummyCategories[0])
      : undefined;
  }
  return normalizeCategory(convexCategory);
}

// ── Products ──
export function useActiveProducts(): NormalizedProduct[] {
  const convexProducts = useQuery(
    api.products.listActive,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || convexProducts === undefined) {
    return getActiveProducts().map(normalizeProduct);
  }
  return convexProducts.map(normalizeProduct);
}

export function useFeaturedProducts(): NormalizedProduct[] {
  const convexProducts = useQuery(
    api.products.listFeatured,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || convexProducts === undefined) {
    return getFeaturedProducts().map(normalizeProduct);
  }
  return convexProducts.map(normalizeProduct);
}

export function useProductBySlug(
  slug: string | undefined
): NormalizedProduct | undefined {
  const convexProduct = useQuery(
    api.products.getBySlug,
    isConvexConfigured && slug ? { slug } : "skip"
  );
  if (!isConvexConfigured || convexProduct === undefined) {
    const p = slug ? getProductBySlug(slug) : undefined;
    return p ? normalizeProduct(p) : undefined;
  }
  return normalizeProduct(convexProduct);
}

export function useTopProducts(limit?: number): NormalizedProduct[] {
  const convexProducts = useQuery(
    api.products.topSelling,
    isConvexConfigured ? { limit } : "skip"
  );
  if (!isConvexConfigured || convexProducts === undefined) {
    return [...dummyProducts]
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, limit ?? 5)
      .map(normalizeProduct);
  }
  return convexProducts.map(normalizeProduct);
}

// ── Orders ──
export function useAllOrders(): NormalizedOrder[] {
  const convexOrders = useQuery(
    api.orders.list,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || convexOrders === undefined) {
    return [...dummyOrders]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(normalizeOrder);
  }
  return convexOrders.map(normalizeOrder);
}

export function useOrdersByUser(
  userId: string | undefined
): NormalizedOrder[] {
  const convexOrders = useQuery(
    api.orders.getByUser,
    isConvexConfigured && userId
      ? { userId: userId as Id<"users"> }
      : "skip"
  );
  if (!isConvexConfigured || convexOrders === undefined) {
    return (userId ? getOrdersByUser(userId) : []).map(normalizeOrder);
  }
  return convexOrders.map(normalizeOrder);
}

export function usePaidOrders(): NormalizedOrder[] {
  const convexOrders = useQuery(
    api.orders.listPaid,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || convexOrders === undefined) {
    return getPaidOrders().map(normalizeOrder);
  }
  return convexOrders.map(normalizeOrder);
}

// ── Reports ──
export function useTotalRevenue(): number {
  const revenue = useQuery(
    api.orders.totalRevenue,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || revenue === undefined) {
    return getTotalRevenue();
  }
  return revenue;
}

export function useTotalTax(): number {
  const tax = useQuery(
    api.orders.totalTax,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || tax === undefined) {
    return getTotalTax();
  }
  return tax;
}

export function useTotalDiscount(): number {
  const discount = useQuery(
    api.orders.totalDiscount,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || discount === undefined) {
    return getTotalDiscount();
  }
  return discount;
}

// ── Coupons ──
export function useCoupons(): NormalizedCoupon[] {
  const convexCoupons = useQuery(
    api.coupons.list,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || convexCoupons === undefined) {
    return dummyCoupons.map(normalizeCoupon);
  }
  return convexCoupons.map(normalizeCoupon);
}

// ── Licenses ──
export function useLicensesForUser(
  userId: string | undefined
): NormalizedLicenseCode[] {
  const convexLicenses = useQuery(
    api.licenses.getForUser,
    isConvexConfigured && userId
      ? { userId: userId as Id<"users"> }
      : "skip"
  );
  if (!isConvexConfigured || convexLicenses === undefined) {
    if (!userId) return [];
    const userPaidOrders = dummyOrders.filter(
      (o) => o.userId === userId && o.status === "paid"
    );
    return userPaidOrders
      .flatMap((o) => o.items)
      .filter((i) => i.productType === "license" && i.licenseCode)
      .map((i) => ({
        productTitle: i.productTitle,
        productSlug: i.productSlug,
        licenseCode: i.licenseCode ?? "",
        coverImage: i.coverImage,
        unitPrice: i.unitPrice,
      }));
  }
  return convexLicenses;
}

// ── Admin: all products / single product / files ──
export function useAllProducts(): NormalizedProduct[] {
  const convexProducts = useQuery(api.products.list, isConvexConfigured ? {} : "skip");
  if (!isConvexConfigured || convexProducts === undefined) {
    return dummyProducts.map(normalizeProduct);
  }
  return convexProducts.map(normalizeProduct);
}

export function useProductById(
  id: string | undefined
): NormalizedProduct | undefined {
  const convexProduct = useQuery(
    api.products.get,
    isConvexConfigured && id ? { id: id as Id<"products"> } : "skip"
  );
  if (!isConvexConfigured || convexProduct === undefined) {
    const p = id ? dummyProducts.find((d) => d.id === id) : undefined;
    return p ? normalizeProduct(p) : undefined;
  }
  return normalizeProduct(convexProduct);
}

export function useProductFiles(
  productId: string | undefined
): NormalizedProductFile[] {
  const convexFiles = useQuery(
    api.productFiles.getByProduct,
    isConvexConfigured && productId
      ? { productId: productId as Id<"products"> }
      : "skip"
  );
  if (!isConvexConfigured || convexFiles === undefined) return [];
  return convexFiles.map((f) => ({
    _id: f._id,
    id: f._id,
    productId: f.productId,
    version: f.version,
    fileName: f.fileName,
    storageId: f.storageId,
    contentType: f.contentType,
    sizeBytes: f.sizeBytes,
    releaseNotes: f.releaseNotes,
    isActive: f.isActive,
    createdAt: f.createdAt,
  }));
}

// ── Users ──
export function useAllUsers(): NormalizedUser[] {
  const convexUsers = useQuery(
    api.users.list,
    isConvexConfigured ? {} : "skip"
  );
  if (!isConvexConfigured || convexUsers === undefined) {
    return userProfiles.map(normalizeUser);
  }
  return convexUsers.map(normalizeUser);
}
