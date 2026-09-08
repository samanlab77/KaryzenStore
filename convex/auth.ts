import { action } from "./_generated/server";
import { v } from "convex/values";
import { verifyToken, createClerkClient } from "@clerk/backend";
import { api, internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";

const ROLES = ["customer", "staff", "superadmin"] as const;

/**
 * Verifies a Clerk session token server-side (using CLERK_SECRET_KEY),
 * then upserts the user into the `users` table and returns the user doc.
 * Role resolution order:
 *   1. Role stored in Clerk user publicMetadata.role (managed via Clerk dashboard)
 *   2. Role of an existing Karyzen user with the same email (seeded admins)
 *   3. If the store has no staff/superadmin yet, the first user becomes superadmin
 *   4. Otherwise "customer"
 */
export const syncClerkUser = action({
  args: { token: v.string() },
  handler: async (
    ctx,
    { token }
  ): Promise<Doc<"users"> | null> => {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error("CLERK_SECRET_KEY is not configured on the backend");
    }

    // 1. Authenticate the token. Throws if invalid/expired.
    const identity = await verifyToken(token, { secretKey });
    const externalId = identity.sub;
    if (!externalId) {
      throw new Error("Invalid Clerk session token");
    }

    // 2. Fetch the profile from Clerk so we always have fresh name/email/avatar.
    let email = "";
    let name = "Karyzen User";
    let avatarUrl = "";
    let clerkRole: string | null = null;
    try {
      const client = createClerkClient({ secretKey });
      const clerkUser = await client.users.getUser(externalId);
      email = clerkUser.emailAddresses?.[0]?.emailAddress ?? "";
      const first = clerkUser.firstName ?? "";
      const last = clerkUser.lastName ?? "";
      name = [first, last].filter(Boolean).join(" ") || email || name;
      avatarUrl = clerkUser.imageUrl ?? "";
      const meta = clerkUser.publicMetadata as Record<string, unknown> | null;
      if (meta && typeof meta.role === "string") clerkRole = meta.role;
    } catch {
      // Profile fetch is best-effort; continue with token claims.
    }

    // 3. Upsert the user.
    const existing = await ctx.runQuery(api.users.getByExternalId, {
      externalId,
    });

    let userId: Id<"users">;
    if (existing) {
      await ctx.runMutation(internal.users.updateFromClerk, {
        userId: existing._id,
        email,
        name,
        avatarUrl,
        externalId,
      });
      userId = existing._id;
    } else {
      let role: (typeof ROLES)[number] = "customer";

      // 3a. Explicit role from Clerk publicMetadata (set in Clerk dashboard).
      if (clerkRole && (ROLES as readonly string[]).includes(clerkRole)) {
        role = clerkRole as (typeof ROLES)[number];
      }

      // 3b. Match an existing user by email (e.g. seeded admin accounts).
      if (role === "customer" && email) {
        const byEmail = await ctx.runQuery(api.users.getByEmail, { email });
        if (byEmail && byEmail.role !== "customer") role = byEmail.role;
      }

      // 3c. First admin bootstrap: no staff/superadmin exists yet.
      if (role === "customer") {
        const admins = await ctx.runQuery(internal.users.countAdmins);
        if (admins === 0) role = "superadmin";
      }

      userId = await ctx.runMutation(internal.users.insertClerkUser, {
        externalId,
        email,
        name,
        avatarUrl,
        role,
      });
    }

    const user = await ctx.runQuery(api.users.get, {
      id: userId as any,
    });
    return user;
  },
});