import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/BrandMark";
import { useAuth } from "./AuthProvider";

export default function LoginPage() {
  const { signIn, isDemo, session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in, or nothing to sign into — go to the board.
  if (session || isDemo) {
    return (
      <Container className="max-w-sm py-20 text-center">
        <p className="text-muted">
          {isDemo
            ? "Running in demo mode — login is enabled once Supabase is connected."
            : "You're signed in."}
        </p>
        <Link to="/dashboard" className={`${buttonVariants({ size: "md" })} mt-6`}>
          Go to dashboard
        </Link>
      </Container>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Check your details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="flex min-h-dvh max-w-sm flex-col justify-center py-16">
      <div className="mb-8 flex flex-col items-center text-center">
        <BrandMark className="h-16 w-16" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">{restaurant.name}</h1>
        <p className="mt-1 text-sm text-muted">Owner sign in</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted"
            placeholder="owner@cafe.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`${buttonVariants({ size: "lg" })} w-full disabled:opacity-60`}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <Link to="/" className="mt-6 text-center text-sm text-muted hover:text-ink">
        ← Back to site
      </Link>
    </Container>
  );
}
