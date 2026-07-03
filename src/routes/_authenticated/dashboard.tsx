import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, MapPin, ShoppingBag, Shield, Plane } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard — KashmirVale" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

type Profile = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  destination_preferences: string[] | null;
};

function Dashboard() {
  const { user, isAdmin, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trips, setTrips] = useState<{ id: string; status: string; created_at: string }[]>([]);
  const [orders, setOrders] = useState<{ id: string; status: string; total: number }[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [prefs, setPrefs] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setPrefs((data.destination_preferences ?? []).join(", "));
      }
    });
    supabase.from("trip_requests").select("id,status,created_at").order("created_at", { ascending: false }).then(({ data }) => setTrips(data ?? []));
    supabase.from("orders").select("id,status,total").order("created_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));
  }, [user]);

  async function save() {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      phone,
      destination_preferences: prefs.split(",").map((s) => s.trim()).filter(Boolean),
    }).eq("id", user.id);
    if (error) alert(error.message);
    else alert("Profile saved!");
  }

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground">{profile?.email}</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Link to="/admin" className="inline-flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
                <Shield className="size-4" /> Admin
              </Link>
            )}
            {isSuperAdmin && (
              <Link to="/super-admin" className="inline-flex items-center gap-1 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground">
                <Shield className="size-4" /> Super Admin
              </Link>
            )}
            <button onClick={handleSignOut} className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Profile</h2>
            <div className="space-y-3">
              <Input label="Full name" value={fullName} onChange={setFullName} />
              <Input label="Phone" value={phone} onChange={setPhone} />
              <Input label="Destination preferences (comma separated)" value={prefs} onChange={setPrefs} />
              <button onClick={save} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Save</button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground"><Plane className="size-5 text-gold" /> My Trips</h2>
            {trips.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trip requests yet. <Link to="/" hash="planner" className="text-primary">Plan a trip →</Link></p>
            ) : (
              <ul className="space-y-2">
                {trips.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                    <span className="text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">{t.status}</span>
                  </li>
                ))}
              </ul>
            )}
            <h2 className="mb-4 mt-6 flex items-center gap-2 text-lg font-bold text-foreground"><ShoppingBag className="size-5 text-gold" /> My Orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet. <Link to="/shop" className="text-primary">Visit shop →</Link></p>
            ) : (
              <ul className="space-y-2">
                {orders.map((o) => (
                  <li key={o.id} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                    <span className="text-muted-foreground">₹{o.total.toLocaleString("en-IN")}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">{o.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <Link to="/" className="mt-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <MapPin className="size-4" /> Back to site
        </Link>
      </div>
    </main>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}
