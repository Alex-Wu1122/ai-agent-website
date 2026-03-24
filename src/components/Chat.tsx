"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, UIAction } from "@/types";
import { profile } from "@/data/profile";

type StatusEvent = { type: string; model?: string; status?: string; [k: string]: unknown };
type Status = "idle" | "loading" | "active" | "failed";

const DOT: Record<Status, string> = {
  idle:    "bg-neutral-600",
  loading: "bg-blue-400 animate-pulse",
  active:  "bg-green-400",
  failed:  "bg-yellow-500",
};

const LABEL: Record<Status, string> = {
  idle:    "text-neutral-600",
  loading: "text-blue-400",
  active:  "text-green-400",
  failed:  "text-yellow-500",
};

interface ChatProps {
  onActions: (actions: UIAction[]) => void;
  onStatusEvent?: (event: StatusEvent) => void;
  groqStatus: Status;
  cerebrasStatus: Status;
  localStatus: Status;
}

const SUGGESTIONS = [
  "Show me your AI projects",
  "What's your most recent work experience?",
  "What languages and frameworks do you know?",
  "What kind of backend systems have you built?",
];

export default function Chat({ onActions, onStatusEvent, groqStatus, cerebrasStatus, localStatus }: ChatProps) {
  const [open, setOpen] = useState(true);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  async function send(message: string) {
    if (!message.trim() || loading) return;
    setHistory((h) => [...h, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    onStatusEvent?.({ type: "reset" });

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let event: StatusEvent;
          try {
            event = JSON.parse(line.slice(6));
          } catch {
            continue;
          }
          onStatusEvent?.(event);
          if (event.type === "result") {
            const answer = event.answer as string;
            const uiActions = event.ui_actions as UIAction[] | undefined;
            setHistory((h) => [...h, { role: "assistant", content: answer }]);
            if (uiActions?.length) onActions(uiActions);
          } else if (event.type === "error") {
            setHistory((h) => [
              ...h,
              { role: "assistant", content: "Sorry, something went wrong. Please try again." },
            ]);
          }
        }
      }
    } catch {
      setHistory((h) => [
        ...h,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
      onStatusEvent?.({ type: "reset" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110"
        aria-label="Open AI assistant"
      >
        {open ? "×" : "✦"}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[22rem] flex flex-col rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ maxHeight: "70vh" }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-white">Ask about {profile.name.split(" ")[0]}</span>
          <span className="ml-auto text-xs text-neutral-500">AI assistant</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-[10rem]">
          {history.length === 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-neutral-400 text-xs">
                Ask me anything about {profile.name.split(" ")[0]}&apos;s background, projects, or skills.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-neutral-800 text-neutral-200 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Model status strip */}
        <div className="px-4 py-2 border-t border-neutral-800 flex gap-6 items-center">
          {([
            { label: "Groq", status: groqStatus },
            { label: "Cerebras", status: cerebrasStatus },
            { label: "Local", status: localStatus },
          ] as const).map(({ label, status }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT[status]}`} />
              <span className={`text-[10px] font-mono ${LABEL[status]}`}>
                {label}
                {status === "failed" && <span className="ml-1 opacity-70">(limit)</span>}
              </span>
              {status === "loading" && (
                <span className="flex items-end gap-px h-3 flex-shrink-0">
                  <span className="w-[3px] rounded-full bg-blue-400 animate-[modelbar_0.8s_ease-in-out_infinite]"        style={{ height: "60%" }} />
                  <span className="w-[3px] rounded-full bg-blue-400 animate-[modelbar_0.8s_ease-in-out_0.2s_infinite]"  style={{ height: "100%" }} />
                  <span className="w-[3px] rounded-full bg-blue-400 animate-[modelbar_0.8s_ease-in-out_0.4s_infinite]"  style={{ height: "40%" }} />
                  <span className="w-[3px] rounded-full bg-blue-400 animate-[modelbar_0.8s_ease-in-out_0.1s_infinite]"  style={{ height: "80%" }} />
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Input */}
        <div className="px-3 py-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-1 bg-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-neutral-500 outline-none border border-transparent focus:border-blue-600 transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm transition-colors font-medium"
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
