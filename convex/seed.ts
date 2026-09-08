import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const existingUsers = await ctx.db.query("users").first();
    if (existingUsers) return "already_seeded";

    const now = Date.now();
    const day = 86400000;

    // ── Users ──
    const userId1 = await ctx.db.insert("users", {
      externalId: "demo-budi",
      email: "budi.santoso@email.com",
      name: "Budi Santoso",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
      role: "customer",
      createdAt: now - day * 60,
    });
    const userId2 = await ctx.db.insert("users", {
      externalId: "demo-sari",
      email: "sari.dewi@email.com",
      name: "Sari Dewi",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sari",
      role: "customer",
      createdAt: now - day * 45,
    });
    const userId3 = await ctx.db.insert("users", {
      externalId: "demo-admin",
      email: "admin@karyzenstore.com",
      name: "Admin Karyzen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      role: "staff",
      createdAt: now - day * 90,
    });
    const userId4 = await ctx.db.insert("users", {
      externalId: "demo-superadmin",
      email: "superadmin@karyzenstore.com",
      name: "Super Admin",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin",
      role: "superadmin",
      createdAt: now - day * 120,
    });

    // ── Categories ──
    const catIds: Record<string, Id<"categories">> = {};
    const categoryData = [
      {
        name: "Software",
        slug: "software",
        description:
          "Software premium untuk produktivitas, keamanan, dan pengembangan.",
        coverImage:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
        isActive: true,
      },
      {
        name: "Desain Grafis",
        slug: "desain-grafis",
        description:
          "Aset desain, ikon, ilustrasi, dan elemen visual berkualitas tinggi.",
        coverImage:
          "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
        isActive: true,
      },
      {
        name: "E-Book",
        slug: "e-book",
        description:
          "Buku digital tentang teknologi, bisnis, desain, dan pengembangan diri.",
        coverImage:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop",
        isActive: true,
      },
      {
        name: "Template & UI Kit",
        slug: "template-ui-kit",
        description:
          "Template website, aplikasi, dan UI kit untuk mempercepat pengembangan.",
        coverImage:
          "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=400&fit=crop",
        isActive: true,
      },
      {
        name: "Kursus Online",
        slug: "kursus-online",
        description:
          "Kelas video dan materi pembelajaran untuk menguasai skill baru.",
        coverImage:
          "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
        isActive: true,
      },
    ];

    for (const cat of categoryData) {
      const id = await ctx.db.insert("categories", cat);
      catIds[cat.slug] = id;
    }

    // ── Products ──
    const productIds: Id<"products">[] = [];
    const productsData = [
      {
        title: "Karyzen Security Pro 1 Tahun",
        slug: "karyzen-security-pro-1-tahun",
        shortDescription:
          "Lisensi resmi software keamanan untuk 1 perangkat, berlaku 1 tahun.",
        description:
          "Karyzen Security Pro adalah solusi keamanan digital komprehensif yang melindungi perangkat Anda dari malware, phishing, dan ancaman siber terkini.",
        price: 350000,
        compareAtPrice: 500000,
        productType: "license" as const,
        categorySlug: "software",
        coverImage:
          "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
        isFeatured: true,
        status: "active" as const,
        licenseCount: 45,
        soldCount: 128,
      },
      {
        title: "Karyzen Office Suite Premium",
        slug: "karyzen-office-suite-premium",
        shortDescription:
          "Paket aplikasi perkantoran lengkap dengan lisensi seumur hidup.",
        description:
          "Karyzen Office Suite menyediakan aplikasi perkantoran lengkap.",
        price: 275000,
        productType: "license" as const,
        categorySlug: "software",
        coverImage:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 80,
        soldCount: 65,
      },
      {
        title: "Karyzen DevTools Bundle",
        slug: "karyzen-devtools-bundle",
        shortDescription:
          "Paket tools pengembangan: code editor, terminal, dan debugging suite.",
        description:
          "Bundle lengkap untuk developer profesional.",
        price: 425000,
        compareAtPrice: 600000,
        productType: "license" as const,
        categorySlug: "software",
        coverImage:
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
        isFeatured: true,
        status: "active" as const,
        licenseCount: 30,
        soldCount: 42,
      },
      {
        title: "Karyzen Cloud Backup 2TB",
        slug: "karyzen-cloud-backup-2tb",
        shortDescription:
          "Penyimpanan cloud 2TB dengan enkripsi end-to-end selama 1 tahun.",
        description:
          "Karyzen Cloud Backup menawarkan penyimpanan cloud sebesar 2TB.",
        price: 199000,
        productType: "license" as const,
        categorySlug: "software",
        coverImage:
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 120,
        soldCount: 89,
      },
      {
        title: "Masterclass Desain Branding bersama Karyzen",
        slug: "masterclass-desain-branding-karyzen",
        shortDescription:
          "Kelas video lengkap untuk belajar membangun identitas visual brand.",
        description:
          "Kelas video lengkap untuk belajar membangun identitas visual brand dari nol.",
        price: 249000,
        productType: "file" as const,
        categorySlug: "desain-grafis",
        coverImage:
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
        isFeatured: true,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 210,
      },
      {
        title: "Paket Ikon SVG Premium (2.000+)",
        slug: "paket-ikon-svg-premium",
        shortDescription:
          "Koleksi lebih dari 2.000 ikon SVG dalam berbagai gaya.",
        description:
          "Koleksi premium 2.000+ ikon SVG dalam berbagai gaya.",
        price: 149000,
        compareAtPrice: 199000,
        productType: "file" as const,
        categorySlug: "desain-grafis",
        coverImage:
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 340,
      },
      {
        title: "Template Media Sosial 365 Hari",
        slug: "template-media-sosial-365-hari",
        shortDescription:
          "365 template siap pakai untuk konten media sosial harian.",
        description:
          "Koleksi 365 template desain untuk konten media sosial.",
        price: 175000,
        productType: "file" as const,
        categorySlug: "desain-grafis",
        coverImage:
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 175,
      },
      {
        title: "Panduan Lengkap Membangun Startup Digital",
        slug: "panduan-lengkap-membangun-startup-digital",
        shortDescription:
          "E-book 350+ halaman tentang membangun startup dari ide hingga scale-up.",
        description:
          "E-book komprehensif yang membahas seluruh aspek membangun startup digital.",
        price: 129000,
        productType: "file" as const,
        categorySlug: "e-book",
        coverImage:
          "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop",
        isFeatured: true,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 420,
      },
      {
        title: "Belajar TypeScript dari Nol hingga Mahir",
        slug: "belajar-typescript-dari-nol-hingga-mahir",
        shortDescription:
          "E-book TypeScript praktis dengan 80+ contoh kode dan latihan.",
        description:
          "E-book TypeScript untuk developer JavaScript.",
        price: 99000,
        productType: "file" as const,
        categorySlug: "e-book",
        coverImage:
          "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 290,
      },
      {
        title: "Strategi Marketing Digital untuk Pemula",
        slug: "strategi-marketing-digital-untuk-pemula",
        shortDescription:
          "E-book tentang SEO, social media marketing, dan iklan digital.",
        description:
          "Panduan praktis marketing digital untuk pemilik bisnis.",
        price: 89000,
        compareAtPrice: 149000,
        productType: "file" as const,
        categorySlug: "e-book",
        coverImage:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 180,
      },
      {
        title: "Karyzen Dashboard UI Kit",
        slug: "karyzen-dashboard-ui-kit",
        shortDescription:
          "UI Kit lengkap untuk dashboard admin modern dengan dark mode.",
        description:
          "UI Kit komprehensif untuk membangun dashboard admin.",
        price: 199000,
        compareAtPrice: 349000,
        productType: "file" as const,
        categorySlug: "template-ui-kit",
        coverImage:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        isFeatured: true,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 156,
      },
      {
        title: "Template Landing Page Konversi Tinggi",
        slug: "template-landing-page-konversi-tinggi",
        shortDescription:
          "10 template landing page yang dioptimasi untuk konversi tinggi.",
        description:
          "Koleksi 10 template landing page yang telah dioptimasi.",
        price: 159000,
        productType: "file" as const,
        categorySlug: "template-ui-kit",
        coverImage:
          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 220,
      },
      {
        title: "Figma E-Commerce Starter Kit",
        slug: "figma-ecommerce-starter-kit",
        shortDescription:
          "Template Figma lengkap untuk membangun toko online.",
        description:
          "Starter kit Figma untuk e-commerce.",
        price: 225000,
        productType: "file" as const,
        categorySlug: "template-ui-kit",
        coverImage:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 95,
      },
      {
        title: "Kursus Fullstack Web Development",
        slug: "kursus-fullstack-web-development",
        shortDescription:
          "120+ video pembelajaran fullstack: React, Node.js, database, dan deployment.",
        description:
          "Kursus komprehensif fullstack web development.",
        price: 499000,
        compareAtPrice: 799000,
        productType: "file" as const,
        categorySlug: "kursus-online",
        coverImage:
          "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
        isFeatured: true,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 310,
      },
      {
        title: "Kursus UI/UX Design dengan Figma",
        slug: "kursus-ui-ux-design-figma",
        shortDescription:
          "80+ video tentang UI/UX design: research, wireframe, prototyping, testing.",
        description:
          "Kursus mendalam UI/UX design menggunakan Figma.",
        price: 349000,
        productType: "file" as const,
        categorySlug: "kursus-online",
        coverImage:
          "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 185,
      },
      {
        title: "Kursus Copywriting & Content Marketing",
        slug: "kursus-copywriting-content-marketing",
        shortDescription:
          "60+ video tentang menulis copy yang menjual dan strategi content marketing.",
        description:
          "Kursus copywriting praktis untuk marketer dan content creator.",
        price: 279000,
        productType: "file" as const,
        categorySlug: "kursus-online",
        coverImage:
          "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop",
        isFeatured: false,
        status: "active" as const,
        licenseCount: 0,
        soldCount: 130,
      },
    ];

    for (const p of productsData) {
      const id = await ctx.db.insert("products", {
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        productType: p.productType,
        categoryId: catIds[p.categorySlug],
        coverImage: p.coverImage,
        isFeatured: p.isFeatured,
        status: p.status,
        licenseCount: p.licenseCount,
        soldCount: p.soldCount,
        createdAt: now - day * 30,
        updatedAt: now - day * 2,
      });
      productIds.push(id);
    }

    // ── Licenses ──
    await ctx.db.insert("licenses", {
      productId: productIds[0],
      code: "KZN-SEC-4F2A-91C8-27BD",
      status: "sold",
      soldAt: now - day * 10,
    });
    await ctx.db.insert("licenses", {
      productId: productIds[0],
      code: "KZN-SEC-7B3E-5D19-A6F0",
      status: "available",
    });
    await ctx.db.insert("licenses", {
      productId: productIds[0],
      code: "KZN-SEC-2C8F-E4A1-B3D7",
      status: "available",
    });
    await ctx.db.insert("licenses", {
      productId: productIds[1],
      code: "KZN-OFF-9E1A-C5B8-D2F4",
      status: "sold",
      soldAt: now - day * 5,
    });
    await ctx.db.insert("licenses", {
      productId: productIds[1],
      code: "KZN-OFF-3D7F-A2E6-9C1B",
      status: "available",
    });
    await ctx.db.insert("licenses", {
      productId: productIds[2],
      code: "KZN-DEV-8A4C-F1D3-E7B2",
      status: "sold",
      soldAt: now - day * 8,
    });
    await ctx.db.insert("licenses", {
      productId: productIds[2],
      code: "KZN-DEV-5F2B-C9A7-3E8D",
      status: "available",
    });
    await ctx.db.insert("licenses", {
      productId: productIds[3],
      code: "KZN-CDB-1E6A-8D4B-F2C9",
      status: "sold",
      soldAt: now - day * 3,
    });

    // ── Coupons ──
    await ctx.db.insert("coupons", {
      code: "HEMATHOKI15",
      description: "Diskon spesial untuk pembelian pertama Anda!",
      percentage: 15,
      minSubtotal: 150000,
      maxDiscount: 75000,
      startsAt: new Date("2025-08-01").getTime(),
      expiresAt: new Date("2025-08-31").getTime(),
      maxUses: 200,
      currentUses: 87,
      isActive: true,
    });
    await ctx.db.insert("coupons", {
      code: "KARYZEN10",
      description: "Diskon 10% untuk semua produk Karyzen Store.",
      percentage: 10,
      minSubtotal: 50000,
      startsAt: new Date("2025-07-01").getTime(),
      expiresAt: new Date("2025-12-31").getTime(),
      maxUses: 1000,
      currentUses: 342,
      isActive: true,
    });
    await ctx.db.insert("coupons", {
      code: "MEGADEAL25",
      description: "Diskon mega deal! Hanya untuk pembelian di atas Rp500.000.",
      percentage: 25,
      minSubtotal: 500000,
      maxDiscount: 200000,
      startsAt: new Date("2025-08-15").getTime(),
      expiresAt: new Date("2025-09-15").getTime(),
      maxUses: 50,
      currentUses: 12,
      isActive: true,
    });

    // ── Orders ──
    await ctx.db.insert("orders", {
      orderNumber: "KZN-20250801-0001",
      userId: userId1,
      customerName: "Budi Santoso",
      customerEmail: "budi.santoso@email.com",
      items: [
        {
          productId: productIds[4],
          productTitle: "Masterclass Desain Branding bersama Karyzen",
          productSlug: "masterclass-desain-branding-karyzen",
          productType: "file",
          coverImage:
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
          unitPrice: 249000,
          quantity: 1,
        },
      ],
      status: "paid",
      subtotalAmount: 249000,
      discountAmount: 0,
      taxAmount: 24900,
      totalAmount: 273900,
      paymentGateway: "midtrans",
      paidAt: now - day * 8,
      createdAt: now - day * 10,
    });

    await ctx.db.insert("orders", {
      orderNumber: "KZN-20250805-0002",
      userId: userId1,
      customerName: "Budi Santoso",
      customerEmail: "budi.santoso@email.com",
      items: [
        {
          productId: productIds[0],
          productTitle: "Karyzen Security Pro 1 Tahun",
          productSlug: "karyzen-security-pro-1-tahun",
          productType: "license",
          coverImage:
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
          unitPrice: 350000,
          quantity: 1,
          licenseCode: "KZN-SEC-4F2A-91C8-27BD",
        },
      ],
      couponCode: "KARYZEN10",
      status: "paid",
      subtotalAmount: 350000,
      discountAmount: 35000,
      taxAmount: 31500,
      totalAmount: 346500,
      paymentGateway: "midtrans",
      paidAt: now - day * 5,
      createdAt: now - day * 7,
    });

    await ctx.db.insert("orders", {
      orderNumber: "KZN-20250810-0003",
      userId: userId2,
      customerName: "Sari Dewi",
      customerEmail: "sari.dewi@email.com",
      items: [
        {
          productId: productIds[10],
          productTitle: "Karyzen Dashboard UI Kit",
          productSlug: "karyzen-dashboard-ui-kit",
          productType: "file",
          coverImage:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
          unitPrice: 199000,
          quantity: 1,
        },
        {
          productId: productIds[7],
          productTitle: "Panduan Lengkap Membangun Startup Digital",
          productSlug: "panduan-lengkap-membangun-startup-digital",
          productType: "file",
          coverImage:
            "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop",
          unitPrice: 129000,
          quantity: 1,
        },
      ],
      couponCode: "HEMATHOKI15",
      status: "paid",
      subtotalAmount: 328000,
      discountAmount: 49200,
      taxAmount: 27880,
      totalAmount: 306680,
      paymentGateway: "midtrans",
      paidAt: now - day * 3,
      createdAt: now - day * 5,
    });

    await ctx.db.insert("orders", {
      orderNumber: "KZN-20250815-0004",
      userId: userId2,
      customerName: "Sari Dewi",
      customerEmail: "sari.dewi@email.com",
      items: [
        {
          productId: productIds[13],
          productTitle: "Kursus Fullstack Web Development",
          productSlug: "kursus-fullstack-web-development",
          productType: "file",
          coverImage:
            "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
          unitPrice: 499000,
          quantity: 1,
        },
      ],
      status: "pending",
      subtotalAmount: 499000,
      discountAmount: 0,
      taxAmount: 49900,
      totalAmount: 548900,
      paymentGateway: "midtrans",
      createdAt: now - day * 1,
    });

    await ctx.db.insert("orders", {
      orderNumber: "KZN-20250803-0005",
      userId: userId1,
      customerName: "Budi Santoso",
      customerEmail: "budi.santoso@email.com",
      items: [
        {
          productId: productIds[2],
          productTitle: "Karyzen DevTools Bundle",
          productSlug: "karyzen-devtools-bundle",
          productType: "license",
          coverImage:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
          unitPrice: 425000,
          quantity: 1,
          licenseCode: "KZN-DEV-8A4C-F1D3-E7B2",
        },
      ],
      status: "paid",
      subtotalAmount: 425000,
      discountAmount: 0,
      taxAmount: 42500,
      totalAmount: 467500,
      paymentGateway: "midtrans",
      paidAt: now - day * 12,
      createdAt: now - day * 14,
    });

    return "seeded_successfully";
  },
});
