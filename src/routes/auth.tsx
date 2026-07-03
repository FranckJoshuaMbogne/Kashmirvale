import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mountain } from "lucide-react";
import { toast, Toaster } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Mode = "login" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — KashmirVale" },
      { name: "description", content: "Sign in or create your KashmirVale account to plan trips and shop." },
    ],
  }),
  component: AuthPage,
});

function safePath(p?: string) {
  if (p && p.startsWith("/") && !p.startsWith("//")) return p;
  return "/dashboard";
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: safePath(redirect) });
    }
  }, [user, loading, redirect, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: safePath(redirect) });
      } else if (mode === "signup") {
        if (!phone.trim()) throw new Error("Phone number is required");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/auth",
            data: { full_name: fullName, phone },
          },
        });
        if (error) throw error;
        toast.success("Account created! You can now sign in.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        toast.success("Password reset link sent to your email.");
        setMode("login");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-16">
      <Toaster richColors position="top-center" />
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elegant">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-display text-2xl font-bold">
          <Mountain className="size-7 text-gold" />
          Kashmir<span className="text-gold">Vale</span>
        </Link>
        <h1 className="text-center text-2xl font-bold text-foreground">
          {mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Reset password"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {mode === "login"
            ? "Access your trips, cart & dashboard"
            : mode === "signup"
              ? "Phone & email required"
              : "We'll email you a reset link"}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <Field label="Full name" value={fullName} onChange={setFullName} type="text" required />
              <Field label="Phone" value={phone} onChange={setPhone} type="tel" required placeholder="+91 …" />
            </>
          )}
          <Field label="Email" value={email} onChange={setEmail} type="email" required />
          {mode !== "forgot" && (
            <Field label="Password" value={password} onChange={setPassword} type="password" required />
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm">
          {mode === "login" && (
            <>
              <button onClick={() => setMode("forgot")} className="text-muted-foreground hover:text-foreground">
                Forgot password?
              </button>
              <p className="text-muted-foreground">
                No account?{" "}
                <button onClick={() => setMode("signup")} className="font-semibold text-primary">
                  Sign up
                </button>
              </p>
            </>
          )}
          {mode !== "login" && (
            <button onClick={() => setMode("login")} className="font-semibold text-primary">
              ← Back to sign in
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
