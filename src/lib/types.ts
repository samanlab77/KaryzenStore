/**
 * Unified type interfaces for Karyzen Store.
 * These normalize both Convex documents and dummy data into a consistent shape.
 */

export interface NormalizedProduct {
  _id: string;
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  productType: "file" | "license";
  categoryId: string;
  coverImage: string;
  isFeatured: boolean;
  status: "draft" | "active" | "archived";
  licenseCount: number;
  soldCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface NormalizedCategory {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  isActive: boolean;
}

export interface NormalizedOrderItem {
  productId: string;
  productTitle: string;
  productSlug: string;
  productType: "file" | "license";
  coverImage: string;
  unitPrice: number;
  quantity: number;
  licenseCode?: string;
  licenseCodes?: string[];
}

export interface NormalizedOrder {
  _id: string;
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: NormalizedOrderItem[];
  couponCode?: string;
  status: "pending" | "paid" | "cancelled" | "expired";
  subtotalAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentGateway: string;
  paidAt?: number;
  createdAt: number;
}

export interface NormalizedCoupon {
  _id: string;
  id: string;
  code: string;
  description: string;
  percentage: number;
  minSubtotal: number;
  maxDiscount?: number;
  startsAt: number;
  expiresAt: number;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
}

export interface NormalizedLicenseCode {
  productTitle: string;
  productSlug: string;
  licenseCode: string;
  coverImage: string;
  unitPrice: number;
}

export interface NormalizedUser {
  _id: string;
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: "customer" | "staff" | "superadmin";
  createdAt: number;
}

/** Helper to get document ID from either Convex or dummy data */
export function getDocId(doc: { _id?: string; id?: string }): string {
  return doc._id ?? doc.id ?? "";
}
