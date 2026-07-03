import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/auth";
import { EntityManager } from "@/components/admin/EntityManager";

export const Route = createFileRoute("/_authenticated/super-admin")({
  head: () => ({ meta: [{ title: "Super Admin — KashmirVale" }, { name: "robots", content: "noindex" }] }),
  component: SuperAdmin,
});

type UserRow = { id: string; full_name: string | null; email: string | null };

function SuperAdmin() {
  const { isSuperAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, AppRole[]>>({});
  const [social, setSocial] = useState({ instagram: "", facebook: "", twitter: "", youtube: "" });
  const [pay, setPay] = useState({ stripe_enabled: true, paypal_enabled: true, upi_enabled: false });

  useEffect(() => {
    if (loading) return;
    if (!isSuperAdmin) navigate({ to: "/dashboard" });
  }, [isSuperAdmin, loading, navigate]);

  async function load() {
    const { data: profiles } = await supabase.from("profiles").select("id,full_name,email");
    setUsers(profiles ?? []);
    const { data: ur } = await supabase.from("user_roles").select("user_id,role");
    const map: Record<string, AppRole[]> = {};
    (ur ?? []).forEach((r) => {
      map[r.user_id] = [...(map[r.user_id] ?? []), r.role as AppRole];
    });
    setRolesByUser(map);
    const { data: cfg } = await supabase.from("site_config").select("key,value");
    cfg?.forEach((c) => {
      if (c.key === "social_links") setSocial(c.value as typeof social);
      if (c.key === "payment_settings") setPay(c.value as typeof pay);
    });
  }
  useEffect(() => {
    load();
  }, []);

  async function setRole(userId: string, role: AppRole) {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("user_roles").insert({ user_id: userId, role } as never);
    load();
  }

  async function saveConfig(key: string, value: unknown) {
    await supabase.from("site_config").update({ value: value as never }).eq("key", key);
    alert("Saved!");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold text-foreground">
            <ShieldCheck className="size-7 text-gold" /> Super Admin
          </h1>
          <div className="flex gap-2">
            <Link to="/admin" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">Admin</Link>
            <button onClick={async () => { await signOut(); navigate({ to: "/" }); }} className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </header>

        <div className="mt-8 grid gap-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Manage Users & Roles</h2>
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                  <span className="text-foreground">{u.full_name ?? "—"} · <span className="text-muted-foreground">{u.email}</span></span>
                  <select
                    value={(rolesByUser[u.id]?.[0]) ?? "user"}
                    onChange={(e) => setRole(u.id, e.target.value as AppRole)}
                    className="rounded-lg border border-input bg-background px-2 py-1 text-xs text-foreground"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                </li>
              ))}
            </ul>
          </section>

          <EntityManager
            table="payment_options"
            title="Payment Options (CRUD)"
            fields={[
              { key: "name", label: "Name" },
              { key: "provider", label: "Provider (stripe/paypal/upi)" },
              { key: "enabled", label: "Enabled", type: "boolean" },
            ]}
          />

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Payment Settings</h2>
            <div className="flex flex-wrap gap-4">
              {(["stripe_enabled", "paypal_enabled", "upi_enabled"] as const).map((k) => (
                <label key={k} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={pay[k]} onChange={(e) => setPay({ ...pay, [k]: e.target.checked })} />
                  {k.replace("_enabled", "").toUpperCase()}
                </label>
              ))}
            </div>
            <button onClick={() => saveConfig("payment_settings", pay)} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Save</button>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Social Media Links</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(social) as (keyof typeof social)[]).map((k) => (
                <label key={k} className="block">
                  <span className="mb-1 block text-sm font-medium capitalize text-foreground">{k}</span>
                  <input value={social[k]} onChange={(e) => setSocial({ ...social, [k]: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring" />
                </label>
              ))}
            </div>
            <button onClick={() => saveConfig("social_links", social)} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Save</button>
          </section>
        </div>
      </div>
    </main>
  );
}
