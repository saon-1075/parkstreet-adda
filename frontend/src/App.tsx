import { Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import HomePage from "@/features/home/HomePage";
import MenuPage from "@/features/menu/MenuPage";
import CartPage from "@/features/cart/CartPage";
import OurStoryPage from "@/features/story/OurStoryPage";
import ContactPage from "@/features/contact/ContactPage";
import DashboardLayout from "@/features/dashboard/DashboardLayout";
import { OrderBoard } from "@/features/dashboard/orders/OrderBoard";
import { MenuManager } from "@/features/dashboard/menu-admin/MenuManager";
import LoginPage from "@/features/dashboard/auth/LoginPage";
import { RequireAuth } from "@/features/dashboard/auth/RequireAuth";

export default function App() {
  return (
    <Routes>
      {/* Public brand + ordering site (shared nav + footer) */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Owner area — separate from the public site, behind auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<OrderBoard />} />
        <Route path="menu" element={<MenuManager />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
