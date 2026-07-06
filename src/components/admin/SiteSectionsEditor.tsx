import { useEffect, useState } from "react";
import { GripVertical, Plus, Save, Trash2, Eye, EyeOff } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

type Section = {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  enabled: boolean;
  sort_order: number;
};

export function SiteSectionsEditor() {
  const [rows, setRows] = useState<Section[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ section_key: "", title: "" });

  async function load() {
    const { data } = await supabase.from("site_sections").select("*").order("sort_order", { ascending: true });
    setRows((data ?? []) as Section[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function persistOrder(list: Section[]) {
    setRows(list);
    await Promise.all(
      list.map((s, i) => supabase.from("site_sections").update({ sort_order: i } as never).eq("id", s.id)),
    );
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = rows.findIndex((r) => r.id === dragId);
    const to = rows.findIndex((r) => r.id === targetId);
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next);
    setDragId(null);
  }

  async function add() {
    if (!draft.section_key.trim()) return alert("Section key required");
    await supabase.from("site_sections").insert({
      section_key: draft.section_key.trim(),
      title: draft.title,
      sort_order: rows.length,
    } as never);
    setDraft({ section_key: "", title: "" });
    load();
  }

  async function save(s: Section) {
    await supabase.from("site_sections").update({
      title: s.title, subtitle: s.subtitle, body: s.body, image_url: s.image_url, enabled: s.enabled,
    } as never).eq("id", s.id);
    alert("Saved!");
  }

  async function remove(id: string) {
    if (!confirm("Delete section?")) return;
    await supabase.from("site_sections").delete().eq("id", id);
    load();
  }

  function patch(id: string, p: Partial<Section>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...p } : r)));
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-1 text-lg font-bold text-foreground">Website Sections (drag to reorder)</h2>
      <p className="mb-4 text-sm text-muted-foreground">Drag the handle to change order. Toggle visibility, edit content, or delete.</p>

      <div className="mb-4 flex flex-wrap gap-2 rounded-xl bg-muted p-3">
        <input value={draft.section_key} onChange={(e) => setDraft({ ...draft, section_key: e.target.value })} placeholder="section key (e.g. hero)" className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground" />
        <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground" />
        <button onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" /> Add section</button>
      </div>

      <div className="space-y-3">
        {rows.map((s) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => setDragId(s.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(s.id)}
            className={`rounded-xl border border-border p-3 ${dragId === s.id ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-2">
              <GripVertical className="size-5 cursor-grab text-muted-foreground" />
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">{s.section_key}</span>
              <div className="ml-auto flex gap-2">
                <button onClick={() => patch(s.id, { enabled: !s.enabled })} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-foreground">
                  {s.enabled ? <><Eye className="size-3" /> Visible</> : <><EyeOff className="size-3" /> Hidden</>}
                </button>
                <button onClick={() => save(s)} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"><Save className="size-3" /> Save</button>
                <button onClick={() => remove(s.id)} className="inline-flex items-center gap-1 rounded-lg bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground"><Trash2 className="size-3" /></button>
              </div>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input value={s.title ?? ""} onChange={(e) => patch(s.id, { title: e.target.value })} placeholder="Title" className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground" />
              <input value={s.subtitle ?? ""} onChange={(e) => patch(s.id, { subtitle: e.target.value })} placeholder="Subtitle" className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground" />
              <input value={s.image_url ?? ""} onChange={(e) => patch(s.id, { image_url: e.target.value })} placeholder="Image URL" className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground sm:col-span-2" />
              <textarea value={s.body ?? ""} onChange={(e) => patch(s.id, { body: e.target.value })} placeholder="Body text" rows={2} className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground sm:col-span-2" />
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No sections yet.</p>}
      </div>
    </section>
  );
}

export function ThemeEditor() {
  const [theme, setTheme] = useState({ primary: "", accent: "", font_heading: "", font_body: "" });

  useEffect(() => {
    supabase.from("site_config").select("value").eq("key", "theme").maybeSingle().then(({ data }) => {
      if (data?.value) setTheme((t) => ({ ...t, ...(data.value as typeof theme) }));
    });
  }, []);

  async function save() {
    await supabase.from("site_config").upsert({ key: "theme", value: theme as never } as never);
    alert("Theme saved! Colors/fonts apply on next load.");
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-bold text-foreground">Fonts & Colors</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {([
          ["primary", "Primary color (oklch/hex)"],
          ["accent", "Accent color"],
          ["font_heading", "Heading font"],
          ["font_body", "Body font"],
        ] as const).map(([k, label]) => (
          <label key={k} className="block">
            <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
            <input value={theme[k]} onChange={(e) => setTheme({ ...theme, [k]: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring" />
          </label>
        ))}
      </div>
      <button onClick={save} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Save theme</button>
    </section>
  );
}
