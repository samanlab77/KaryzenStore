import { useEffect } from "react";

/**
 * Per-page SEO: updates document title, meta description, canonical URL,
 * Open Graph / Twitter cards, and optionally injects JSON-LD structured data.
 *
 * The SPA cannot prerender meta tags for crawlers that don't execute JS,
 * but Google renders JS and every social crawler picks up these tags.
 */

const SITE_NAME = "Karyzen Store";
const DEFAULT_DESCRIPTION =
  "Toko Produk Digital Premium. Software, lisensi, template, e-book, dan kursus online. Beli dalam hitungan menit, langsung dapat digunakan.";

function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${window.location.origin}${path}`;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export interface SeoOptions {
  title: string;
  description?: string;
  /** Path like "/products/foo" (made absolute automatically) */
  path?: string;
  image?: string;
  type?: "website" | "product" | "article";
  /** JSON-LD structured data object(s) injected as <script type="application/ld+json"> */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function useSEO({
  title,
  description,
  path,
  image,
  type = "website",
  jsonLd,
}: SeoOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
    const desc = description?.trim() || DEFAULT_DESCRIPTION;
    const url = absoluteUrl(path ?? window.location.pathname);
    const img = image || absoluteUrl("/og-image.svg");

    document.title = fullTitle;

    setMeta("name", "description", desc);
    setLink("canonical", url);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:image", img);
    setMeta("property", "og:locale", "id_ID");

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", img);

    // JSON-LD structured data
    const scriptId = "karyzen-jsonld";
    document.getElementById(scriptId)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, type, jsonLd]);
}

/** Organization + WebSite structured data used on the home page. */
export function organizationJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: window.location.origin,
      logo: absoluteUrl("/favicon.svg"),
      email: "halo@karyzenstore.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Digital No. 123",
        addressLocality: "Jakarta Selatan",
        postalCode: "12345",
        addressCountry: "ID",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: window.location.origin,
      potentialAction: {
        "@type": "SearchAction",
        target: `${window.location.origin}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

interface ProductJsonLdInput {
  title: string;
  description: string;
  slug: string;
  price: number;
  coverImage: string;
  productType: "file" | "license";
  soldCount: number;
}

/** Product + BreadcrumbList structured data for the product detail page. */
export function productJsonLd(p: ProductJsonLdInput) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      description: p.description,
      image: p.coverImage,
      category: p.productType === "license" ? "Software License" : "Digital File",
      offers: {
        "@type": "Offer",
        url: absoluteUrl(`/products/${p.slug}`),
        priceCurrency: "IDR",
        price: p.price,
        availability:
          p.productType === "license" && p.soldCount >= 0
            ? "https://schema.org/InStock"
            : "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: window.location.origin,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Katalog",
          item: absoluteUrl("/products"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: p.title,
          item: absoluteUrl(`/products/${p.slug}`),
        },
      ],
    },
  ];
}
