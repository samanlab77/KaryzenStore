/**
 * Midtrans Snap client-side helper.
 * Loads the Snap.js SDK once (lazily) and exposes `window.snap.pay`.
 *
 * Environment is controlled by VITE_MIDTRANS_IS_PRODUCTION ("true" = production).
 */

const isProduction = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === "true";

const SNAP_SOURCE = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

let snapPromise: Promise<Window["snap"]> | null = null;

export function loadSnap(clientKey: string | undefined): Promise<Window["snap"]> {
  if (!clientKey) {
    return Promise.reject(
      new Error("VITE_MIDTRANS_CLIENT_KEY belum dikonfigurasi")
    );
  }
  if (window.snap) return Promise.resolve(window.snap);
  if (snapPromise) return snapPromise;

  snapPromise = new Promise<Window["snap"]>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-src="${SNAP_SOURCE}"]`
    );
    if (existing) {
      existing.addEventListener("load", () =>
        window.snap ? resolve(window.snap) : reject(new Error("Snap load failed"))
      );
      existing.addEventListener("error", () =>
        reject(new Error("Gagal memuat Midtrans Snap"))
      );
      return;
    }
    const script = document.createElement("script");
    script.src = SNAP_SOURCE;
    script.setAttribute("data-client-key", clientKey);
    script.setAttribute("data-src", SNAP_SOURCE);
    script.async = true;
    script.onload = () =>
      window.snap ? resolve(window.snap) : reject(new Error("Snap load failed"));
    script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap"));
    document.body.appendChild(script);
  });

  return snapPromise;
}

export const midtransClientKey =
  (import.meta.env.VITE_MIDTRANS_CLIENT_KEY as string | undefined) ?? "";
