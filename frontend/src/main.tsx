import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { applyTheme } from "@/lib/theme";
import { restaurant } from "@/config/restaurant.config";
import { CartProvider } from "@/features/cart/CartProvider";
import { AuthProvider } from "@/features/dashboard/auth/AuthProvider";

// Re-skin seam: paint the config theme onto :root before first render.
applyTheme(restaurant.theme);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
