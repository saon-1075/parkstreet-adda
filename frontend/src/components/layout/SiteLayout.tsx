import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

/** Shared chrome for all public pages: nav + routed page + footer. */
export function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <ScrollToTop />
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
