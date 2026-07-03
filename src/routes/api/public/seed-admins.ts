import { createFileRoute } from "@tanstack/react-router";

// One-time idempotent seeding of the super admin and admin accounts.
// Roles are auto-assigned by the database trigger based on email.
export const Route = createFileRoute("/api/public/seed-admins")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const accounts = [
          { email: "super@admin.com", password: "root", full_name: "Super Admin" },
          { email: "admin@kashmirvale.com", password: "root", full_name: "KashmirVale Admin" },
        ];

        const results: Record<string, string> = {};
        for (const acc of accounts) {
          const { error } = await supabaseAdmin.auth.admin.createUser({
            email: acc.email,
            password: acc.password,
            email_confirm: true,
            user_metadata: { full_name: acc.full_name, phone: "" },
          });
          results[acc.email] = error
            ? error.message.toLowerCase().includes("already")
              ? "already exists"
              : `error: ${error.message}`
            : "created";
        }

        return Response.json({ ok: true, results });
      },
    },
  },
});
