import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to top on route change (SPA nav doesn't do this by default). */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
