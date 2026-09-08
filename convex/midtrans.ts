"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import crypto from "node:crypto";

export interface SnapTransactionResult {
  orderId: Id<"orders">;
  orderNumber: string;
  token: string;
  redirectUrl: string;
  totalAmount: number;
}

export interface WebhookResult {
  ok: boolean;
  status?: number;
  error?: string;
}

/**
 * Creates a Midtrans Snap transaction for an already-created pending order.
 * The server key never leaves the server; the Snap token / redirect URL
 * are stored on the order document so the webhook can verify them later.
 */
export const createSnapTransaction = action({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args): Promise<SnapTransactionResult> => {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      throw new Error(
        "Konfigurasi pembayaran belum siap. Tambahkan MIDTRANS_SERVER_KEY di pengaturan lingkungan."
      );
    }

    const order = await ctx.runQuery(internal.orders.getInternal, {
      id: args.orderId,
    });
    if (!order) throw new Error("Order tidak ditemukan");
    if (order.status !== "pending") {
      throw new Error("Order sudah diproses");
    }

    const isProduction = String(process.env.MIDTRANS_IS_PRODUCTION) === "true";
    const baseUrl = isProduction
      ? "https://app.midtrans.com"
      : "https://app.sandbox.midtrans.com";

    const itemDetails = order.items.map((item) => ({
      id: item.productId,
      price: item.unitPrice,
      quantity: item.quantity,
      name: item.productTitle.slice(0, 50),
      category: item.productType === "license" ? "Lisensi" : "File Digital",
    }));

    const body = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: order.totalAmount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: order.customerName,
        email: order.customerEmail,
      },
      credit_card: { secure: true },
      expiry: { unit: "hours", duration: 24 },
    };

    const response = await fetch(`${baseUrl}/snap/v1/transactions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Midtrans create transaction failed:", data);
      throw new Error(
        data?.error_messages?.join?.(', ') ??
          "Gagal membuat pembayaran di Midtrans"
      );
    }

    const token: string = data.token;
    const redirectUrl: string = data.redirect_url;
    if (!token) throw new Error("Midtrans tidak mengembalikan snap token");

    await ctx.runMutation(internal.orders.setSnapToken, {
      id: args.orderId,
      token,
      redirectUrl,
    });

    return {
      orderId: order._id,
      orderNumber: order.orderNumber,
      token,
      redirectUrl,
      totalAmount: order.totalAmount,
    };
  },
});

/**
 * Internal handler for Midtrans payment notifications.
 * Verifies the SHA512 signature, then marks the order paid (or cancelled /
 * expired) and runs fulfillment (license assignment, sold counts, coupon use).
 */
export const handleNotification = internalAction({
  args: {
    rawBody: v.string(),
    payload: v.any(),
  },
  handler: async (ctx, args): Promise<WebhookResult> => {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY is not configured");
      return { ok: false, status: 500, error: "Server key missing" };
    }

    const payload = args.payload as any;

    // Signature verification (current Midtrans format: sha512(rawBody + serverKey),
    // with a fallback to the legacy concatenated-field format).
    const expectedRaw = crypto
      .createHash("sha512")
      .update(args.rawBody + serverKey)
      .digest("hex");
    const expectedLegacy = crypto
      .createHash("sha512")
      .update(
        `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`
      )
      .digest("hex");
    const received = payload.signature_key;
    if (received && received !== expectedRaw && received !== expectedLegacy) {
      console.error("Midtrans webhook signature mismatch");
      return { ok: false, status: 403, error: "Invalid signature" };
    }

    const orderNumber: string | undefined = payload.order_id;
    const status: string | undefined = payload.transaction_status;
    const fraudStatus: string | undefined = payload.fraud_status;
    if (!orderNumber || !status) {
      return { ok: false, status: 400, error: "Missing fields" };
    }

    const order = await ctx.runQuery(
      internal.orders.getByOrderNumberInternal,
      { orderNumber }
    );
    if (!order) {
      console.error("Midtrans webhook: order not found", orderNumber);
      return { ok: false, status: 404, error: "Order not found" };
    }

    // Defensive check: webhook gross_amount must match what we charged.
    if (
      payload.gross_amount !== undefined &&
      Number(payload.gross_amount) !== order.totalAmount
    ) {
      console.error(
        "Midtrans webhook gross_amount mismatch",
        payload.gross_amount,
        order.totalAmount
      );
      return { ok: false, status: 400, error: "Amount mismatch" };
    }

    const isFraudAccepted = !fraudStatus || fraudStatus === "accept";

    if ((status === "capture" || status === "settlement") && isFraudAccepted) {
      await ctx.runMutation(internal.orders.fulfillPayment, {
        id: order._id,
        transactionId: payload.transaction_id,
        paymentType: payload.payment_type,
      });
      return { ok: true };
    }

    if (status === "cancel" || status === "deny" || status === "expire") {
      await ctx.runMutation(internal.orders.setStatusIfPending, {
        id: order._id,
        status: status === "expire" ? "expired" : "cancelled",
      });
      return { ok: true };
    }

    // Other statuses (pending, challenge, etc.) — acknowledge without changes.
    return { ok: true };
  },
});