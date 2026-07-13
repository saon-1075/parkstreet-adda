import { Routes, Route, Navigate } from "react-router-dom";
import MenuPage from "@/features/menu/MenuPage";
import DashboardPage from "@/features/dashboard/DashboardPage";

export default function App() {
  return (
    <Routes>
      {/* Customer menu (QR landing). Reads ?table= in a later milestone. */}
      <Route path="/" element={<MenuPage />} />
      {/* Owner dashboard. Auth gate added in M5. */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
