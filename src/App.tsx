import { Routes, Route } from "react-router-dom";

// Public Pages
import PublicLayout from "@/layouts/PublicLayout";
import HomePage from "@/pages/public/HomePage";
import ProductsPage from "@/pages/public/ProductsPage";
import ProductDetailPage from "@/pages/public/ProductDetailPage";
import CategoryPage from "@/pages/public/CategoryPage";
import CartPage from "@/pages/public/CartPage";
import CheckoutPage from "@/pages/public/CheckoutPage";
import AboutPage from "@/pages/public/AboutPage";
import FAQPage from "@/pages/public/FAQPage";
import ContactPage from "@/pages/public/ContactPage";

// Member Pages
import MemberLayout from "@/layouts/MemberLayout";
import MemberDashboardPage from "@/pages/member/MemberDashboardPage";
import MemberOrdersPage from "@/pages/member/MemberOrdersPage";
import MemberLicensesPage from "@/pages/member/MemberLicensesPage";
import MemberSettingsPage from "@/pages/member/MemberSettingsPage";

// Admin Pages
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminProductNewPage from "@/pages/admin/AdminProductNewPage";
import AdminProductEditPage from "@/pages/admin/AdminProductEditPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "@/pages/admin/AdminOrderDetailPage";
import AdminCouponsPage from "@/pages/admin/AdminCouponsPage";
import AdminCouponEditPage from "@/pages/admin/AdminCouponEditPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

// Auth
import AuthPage from "@/pages/auth/AuthPage";

// Success
import OrderSuccessPage from "@/pages/member/OrderSuccessPage";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/keranjang" element={<CartPage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/kontak" element={<ContactPage />} />
      </Route>

      {/* Auth */}
      <Route path="/sign-in/*" element={<AuthPage />} />
      <Route path="/sign-up/*" element={<AuthPage />} />

      {/* Member Routes */}
      <Route element={<MemberLayout />}>
        <Route path="/dashboard" element={<MemberDashboardPage />} />
        <Route path="/dashboard/orders" element={<MemberOrdersPage />} />
        <Route path="/dashboard/licenses" element={<MemberLicensesPage />} />
        <Route path="/dashboard/settings" element={<MemberSettingsPage />} />
      </Route>

      {/* Checkout (needs auth but separate layout) */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order/:orderNumber/success" element={<OrderSuccessPage />} />

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/products/new" element={<AdminProductNewPage />} />
        <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="/admin/coupons" element={<AdminCouponsPage />} />
        <Route path="/admin/coupons/:id" element={<AdminCouponEditPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
}
