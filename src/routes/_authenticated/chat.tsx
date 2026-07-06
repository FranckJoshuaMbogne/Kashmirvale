import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Chat } from "@/components/Chat";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "Messages — KashmirVale" }, { name: "robots", content: "noindex" }] }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-foreground">Messages</h1>
          <Link to="/dashboard" className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
            <ArrowLeft className="size-4" /> Back
          </Link>
        </header>
        <Chat mode="user" />
      </div>
    </main>
  );
}
