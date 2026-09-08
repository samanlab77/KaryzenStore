/** Whether a Convex deployment URL is configured for the frontend. */
export const isConvexConfigured = Boolean(
  import.meta.env.VITE_CONVEX_URL as string | undefined
);