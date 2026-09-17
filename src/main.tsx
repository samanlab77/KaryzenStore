import { Component, StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import { clerkPublishableKey, isClerkEnabled } from "./lib/clerk";
import "./index.css";

/**
 * The app runs in three modes depending on build-time env vars:
 *  - Full:   VITE_CONVEX_URL + VITE_CLERK_PUBLISHABLE_KEY set
 *  - Data:   only VITE_CONVEX_URL (demo auth)
 *  - Demo:   no vars at all (dummy data, demo auth) — must not crash
 */
const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

/**
 * Last-resort error boundary: shows the actual error instead of a blank page
 * when something crashes outside the normal error handling.
 */
class RootErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0B0E14",
            color: "#E5E9F0",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            padding: 24,
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 20, marginBottom: 12, color: "#F0B414" }}>
              Terjadi kesalahan saat memuat aplikasi
            </h1>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: 13,
                lineHeight: 1.6,
                color: "#9BA3B4",
                background: "#141B29",
                padding: 16,
                borderRadius: 12,
              }}
            >
              {String(this.state.error?.message ?? this.state.error)}
            </pre>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 12 }}>
              Cek console browser untuk detail, atau hubungi administrator.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppProviders({ children }: { children: ReactNode }) {
  let tree = <>{children}</>;
  // Demo mode: hooks fall back to dummy data when Convex is not configured.
  if (convex) {
    tree = <ConvexProvider client={convex}>{tree}</ConvexProvider>;
  }
  if (isClerkEnabled) {
    tree = (
      <ClerkProvider publishableKey={clerkPublishableKey}>{tree}</ClerkProvider>
    );
  }
  return tree;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProviders>
    </RootErrorBoundary>
  </StrictMode>
);
