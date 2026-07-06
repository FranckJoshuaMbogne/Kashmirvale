import { useEffect, useRef, useState } from "react";
import { Send, Plus, MessagesSquare } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Thread = {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  last_message_at: string;
};

type Message = {
  id: string;
  thread_id: string;
  sender_id: string | null;
  is_admin: boolean;
  body: string;
  created_at: string;
};

export function Chat({ mode }: { mode: "user" | "admin" }) {
  const { user, isAdmin } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [names, setNames] = useState<Record<string, string>>({});
  const endRef = useRef<HTMLDivElement>(null);

  async function loadThreads() {
    const q = supabase.from("chat_threads").select("*").order("last_message_at", { ascending: false });
    const { data } = mode === "user" && user ? await q.eq("user_id", user.id) : await q;
    const list = (data ?? []) as Thread[];
    setThreads(list);
    if (!activeId && list.length) setActiveId(list[0].id);
    if (mode === "admin" && list.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,full_name,email")
        .in("id", list.map((t) => t.user_id));
      const map: Record<string, string> = {};
      (profs ?? []).forEach((p) => (map[p.id] = p.full_name || p.email || "Client"));
      setNames(map);
    }
  }

  async function loadMessages(id: string) {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", id)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as Message[]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, user?.id]);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
    const channel = supabase
      .channel(`chat-${activeId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `thread_id=eq.${activeId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeId]);

  async function newThread() {
    if (!user) return;
    const subject = prompt("What do you need help with?") || "New conversation";
    const { data } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, subject } as never)
      .select()
      .single();
    if (data) {
      await loadThreads();
      setActiveId((data as Thread).id);
    }
  }

  async function send() {
    if (!text.trim() || !activeId || !user) return;
    const body = text.trim();
    setText("");
    await supabase.from("chat_messages").insert({
      thread_id: activeId,
      sender_id: user.id,
      is_admin: isAdmin && mode === "admin",
      body,
    } as never);
  }

  return (
    <div className="grid gap-4 md:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-border bg-card p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessagesSquare className="size-4" /> Conversations
          </span>
          {mode === "user" && (
            <button onClick={newThread} className="inline-flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
              <Plus className="size-3" /> New
            </button>
          )}
        </div>
        <ul className="space-y-1">
          {threads.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setActiveId(t.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeId === t.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="block truncate font-medium">{t.subject}</span>
                {mode === "admin" && <span className="block truncate text-xs opacity-80">{names[t.user_id] ?? "Client"}</span>}
              </button>
            </li>
          ))}
          {threads.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">No conversations yet.</li>}
        </ul>
      </aside>

      <section className="flex h-[520px] flex-col rounded-2xl border border-border bg-card">
        {activeId ? (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => {
                const mine = mode === "admin" ? m.is_admin : !m.is_admin;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      {m.is_admin && !mine && <span className="mb-0.5 block text-xs font-semibold text-gold">Support</span>}
                      {m.body}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
            <div className="flex items-center gap-2 border-t border-border p-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message…"
                className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <button onClick={send} aria-label="Send" className="rounded-full bg-primary p-2.5 text-primary-foreground">
                <Send className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            {mode === "user" ? "Start a new conversation with our team." : "Select a conversation."}
          </div>
        )}
      </section>
    </div>
  );
}
