import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Users, MapPin, ShoppingBag, Plane, CheckCircle } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { EntityManager } from "@/components/admin/EntityManager";
import { Chat } from "@/components/Chat";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — KashmirVale" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { isAdmin, isSuperAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, orders: 0, trips: 0, destinations: 0 });
  const [orders, setOrders] = useState<{ id: string; status: string; total: number; contact_email: string | null }[]>([]);
  const [trips, setTrips] = useState<{ id: string; status: string; created_at: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; full_name: string | null; email: string | null; phone: string | null }[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!isAdmin) navigate({ to: "/dashboard" });
  }, [isAdmin, loading, navigate]);

  async function loadAll() {
    const [u, o, t, d] = await Promise.all([
      supabase.from("profiles").select("id,full_name,email,phone"),
      supabase.from("orders").select("id,status,total,contact_email").order("created_at", { ascending: false }),
      supabase.from("trip_requests").select("id,status,created_at").order("created_at", { ascending: false }),
      supabase.from("destinations").select("id"),
    ]);
    setUsers(u.data ?? []);
    setOrders(o.data ?? []);
    setTrips(t.data ?? []);
    setStats({ users: u.data?.length ?? 0, orders: o.data?.length ?? 0, trips: t.data?.length ?? 0, destinations: d.data?.length ?? 0 });
  }
  useEffect(() => {
    loadAll();
  }, []);

  async function confirmOrder(id: string) {
    await supabase.from("orders").update({ status: "confirmed" }).eq("id", id);
    loadAll();
  }
  async function updateTrip(id: string, status: string) {
    await supabase.from("trip_requests").update({ status }).eq("id", id);
    loadAll();
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex gap-2">
            {isSuperAdmin && (
              <Link to="/super-admin" className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground">Super Admin</Link>
            )}
            <Link to="/dashboard" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">My profile</Link>
            <button onClick={async () => { await signOut(); navigate({ to: "/" }); }} className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={<Users className="size-5" />} label="Users" value={stats.users} />
          <Stat icon={<ShoppingBag className="size-5" />} label="Orders" value={stats.orders} />
          <Stat icon={<Plane className="size-5" />} label="Trip requests" value={stats.trips} />
          <Stat icon={<MapPin className="size-5" />} label="Destinations" value={stats.destinations} />
        </div>

        <div className="mt-8 grid gap-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Orders</h2>
            {orders.length === 0 ? <p className="text-sm text-muted-foreground">No orders.</p> : (
              <ul className="space-y-2">
                {orders.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                    <span className="text-foreground">{o.contact_email ?? "—"} · ₹{o.total.toLocaleString("en-IN")}</span>
                    <span className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">{o.status}</span>
                      {o.status !== "confirmed" && (
                        <button onClick={() => confirmOrder(o.id)} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                          <CheckCircle className="size-3" /> Confirm & email
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Trip Requests</h2>
            {trips.length === 0 ? <p className="text-sm text-muted-foreground">No trip requests.</p> : (
              <ul className="space-y-2">
                {trips.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                    <span className="text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span>
                    <select value={t.status} onChange={(e) => updateTrip(t.id, e.target.value)} className="rounded-lg border border-input bg-background px-2 py-1 text-xs text-foreground">
                      <option value="requested">requested</option>
                      <option value="in_review">in_review</option>
                      <option value="confirmed">confirmed</option>
                      <option value="completed">completed</option>
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <EntityManager
            table="destinations"
            title="Destinations (details, images, videos, advantages)"
            fields={[
              { key: "name", label: "Name" },
              { key: "tagline", label: "Tagline" },
              { key: "image_url", label: "Image URL" },
              { key: "video_url", label: "Video URL" },
              { key: "description", label: "Description" },
              { key: "active", label: "Active", type: "boolean" },
            ]}
          />

          <EntityManager
            table="shop_items"
            title="Shop Items"
            fields={[
              { key: "name", label: "Name" },
              { key: "tagline", label: "Tagline" },
              { key: "price", label: "Price (₹)", type: "number" },
              { key: "image_url", label: "Image URL" },
              { key: "category", label: "Category" },
              { key: "active", label: "Active", type: "boolean" },
            ]}
          />

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Users</h2>
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                  <span className="text-foreground">{u.full_name ?? "—"}</span>
                  <span className="text-muted-foreground">{u.email} · {u.phone ?? "—"}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Customer Messages</h2>
            <Chat mode="admin" />
          </section>

          <EntityManager
            table="discount_codes"
            title="Discount Codes"
            fields={[
              { key: "code", label: "Code" },
              { key: "description", label: "Description" },
              { key: "percent_off", label: "% off", type: "number" },
              { key: "amount_off", label: "₹ off", type: "number" },
              { key: "max_uses", label: "Max uses", type: "number" },
              { key: "active", label: "Active", type: "boolean" },
            ]}
          />
        </div>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-sm">{label}</span></div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
