"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Loader2, History, Send } from "lucide-react";

interface DisplayMessage {
  role: "user" | "assistant" | "error";
  text: string;
}

interface RawMessage {
  role: string;
  content: unknown;
}

interface ChatLog {
  id: string;
  commandText: string;
  resultSummary: string;
  createdAt: string;
  user: { name: string } | null;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "logs">("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: "assistant", text: "أهلاً! أنا المحاسب الداخلي — اكتب لي أي أمر زي \"تم دفع فلان\" أو \"معايا كام؟\"." },
  ]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<ChatLog[] | null>(null);
  const historyRef = useRef<RawMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  useEffect(() => {
    if (tab === "logs" && open) {
      fetch("/api/chat/logs")
        .then((r) => r.json())
        .then((data) => setLogs(data.logs ?? []))
        .catch(() => setLogs([]));
    }
  }, [tab, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyRef.current }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "error", text: data.error || "حصل خطأ غير متوقع." }]);
        return;
      }

      historyRef.current = data.history ?? historyRef.current;
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || "تم." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "error", text: "مفيش اتصال بالسيرفر دلوقتي. حاول تاني." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {open && (
        <div className="mb-3 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-900 px-4 py-3 text-white">
            <span className="text-sm font-bold">المحاسب الداخلي</span>
            <button onClick={() => setOpen(false)} aria-label="إغلاق">
              <X size={18} />
            </button>
          </div>

          <div className="flex border-b border-gray-100 text-xs">
            <button
              onClick={() => setTab("chat")}
              className={`flex-1 py-2 font-medium ${tab === "chat" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400"}`}
            >
              محادثة
            </button>
            <button
              onClick={() => setTab("logs")}
              className={`flex flex-1 items-center justify-center gap-1 py-2 font-medium ${tab === "logs" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400"}`}
            >
              <History size={14} /> السجل
            </button>
          </div>

          {tab === "chat" ? (
            <>
              <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "mr-auto bg-gray-900 text-white"
                        : m.role === "error"
                          ? "ml-auto bg-red-50 text-red-700"
                          : "ml-auto bg-gray-100 text-gray-900"
                    } whitespace-pre-wrap`}
                  >
                    {m.text}
                  </div>
                ))}
                {loading && (
                  <div className="ml-auto flex w-fit items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-500">
                    <Loader2 size={14} className="animate-spin" /> بيفكر...
                  </div>
                )}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2 border-t border-gray-100 p-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب أمرك هنا..."
                  className="input flex-1"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-gray-900 p-2 text-white disabled:opacity-40"
                  aria-label="إرسال"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {logs === null && <p className="text-xs text-gray-400">جاري التحميل...</p>}
              {logs?.length === 0 && <p className="text-xs text-gray-400">لا يوجد أوامر مسجلة بعد.</p>}
              {logs?.map((log) => (
                <div key={log.id} className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-xs">
                  <p className="font-medium text-gray-900">{log.commandText}</p>
                  <p className="mt-1 text-gray-500 whitespace-pre-wrap">{log.resultSummary}</p>
                  <p className="mt-1 text-[10px] text-gray-300">
                    {log.user?.name ?? "—"} · {new Date(log.createdAt).toLocaleString("ar-AE")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800"
        aria-label="فتح الشات بوت"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
