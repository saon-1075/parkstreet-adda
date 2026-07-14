import { Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import HomePage from "@/features/home/HomePage";
import MenuPage from "@/features/menu/MenuPage";
import CartPage from "@/features/cart/CartPage";
import OurStoryPage from "@/features/story/OurStoryPage";
import ContactPage from "@/features/contact/ContactPage";
import DashboardPage from "@/features/dashboard/DashboardPage";

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

      {/* Owner area — separate from the public site (auth gate added in M6) */}
      <Route path="/dashboard" element={<DashboardPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
