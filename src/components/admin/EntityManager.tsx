import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "boolean";
};

type Row = Record<string, unknown> & { id: string };

export function EntityManager({
  table,
  title,
  fields,
}: {
  table: "destinations" | "shop_items" | "payment_options" | "promotions" | "discount_codes";
  title: string;
  fields: FieldDef[];
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Row[]);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  async function create() {
    setBusy(true);
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      let v = draft[f.key];
      if (f.type === "number") v = Number(v ?? 0);
      if (f.type === "boolean") v = Boolean(v);
      payload[f.key] = v ?? (f.type === "number" ? 0 : f.type === "boolean" ? false : "");
    }
    const { error } = await supabase.from(table).insert(payload as never);
    setBusy(false);
    if (error) return alert(error.message);
    setDraft({});
    load();
  }

  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from(table).update(patch as never).eq("id", id);
    if (error) alert(error.message);
    else load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) alert(error.message);
    else load();
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-bold text-foreground">{title}</h2>

      <div className="mb-4 grid gap-2 rounded-xl bg-muted p-3 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) => (
          <FieldInput key={f.key} field={f} value={draft[f.key]} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
        ))}
        <button onClick={create} disabled={busy} className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          <Plus className="size-4" /> Add
        </button>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="grid items-center gap-2 rounded-lg border border-border p-2 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((f) => (
              <FieldInput
                key={f.key}
                field={f}
                value={r[f.key]}
                onChange={(v) => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, [f.key]: v } : x)))}
              />
            ))}
            <div className="flex gap-2">
              <button onClick={() => update(r.id, Object.fromEntries(fields.map((f) => [f.key, r[f.key]])))} className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                <Save className="size-3" /> Save
              </button>
              <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground">
                <Trash2 className="size-3" /> Delete
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No items yet.</p>}
      </div>
    </section>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }
  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      placeholder={field.label}
      value={value === null || value === undefined ? "" : String(value)}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
    />
  );
}
