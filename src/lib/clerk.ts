/**
 * Clerk configuration helpers.
 * The app runs in two modes:
 *  - Clerk mode: real authentication when VITE_CLERK_PUBLISHABLE_KEY is set
 *  - Demo mode: existing demo-store auth when no key is configured
 */
export const clerkPublishableKey =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ?? "";

export const isClerkEnabled = Boolean(clerkPublishableKey);