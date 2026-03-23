import { NextRequest } from "next/server";
import { runAgent } from "@/lib/agent";
import type { ChatMessage } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, history = [] } = body as {
    message: string;
    history?: ChatMessage[];
  };

  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ error: "message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      try {
        const result = await runAgent(message, history, (model, status) => {
          send({ type: "status", model, status });
        });
        send({ type: "result", ...result });
      } catch (err) {
        console.error("/api/ask error:", err);
        send({ type: "error", message: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
