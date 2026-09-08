import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

/**
 * Midtrans Payment Notification webhook.
 * Parses the payload, then delegates signature verification + order
 * fulfillment to an internal action (which runs with Node built-ins).
 */
http.route({
  path: "/midtrans/notification",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const rawBody = await request.text();
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const result = await ctx.runAction(
      internal.midtrans.handleNotification,
      { rawBody, payload }
    );

    if (!result.ok) {
      return new Response(result.error ?? "Bad request", {
        status: result.status ?? 400,
      });
    }
    return new Response("OK", { status: 200 });
  }),
});

export default http;