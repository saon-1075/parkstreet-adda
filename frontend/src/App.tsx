import { Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import HomePage from "@/features/home/HomePage";
import MenuPage from "@/features/menu/MenuPage";
import CartPage from "@/features/cart/CartPage";
import OurStoryPage from "@/features/story/OurStoryPage";
import ContactPage from "@/features/contact/ContactPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
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
            <DashboardPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
