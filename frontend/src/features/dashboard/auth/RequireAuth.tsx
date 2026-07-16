import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

/** Gates the dashboard. In demo mode (no Supabase) it lets you through so the UI
 *  is viewable; with Supabase configured it requires a signed-in owner. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading, isDemo } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isDemo && !session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
