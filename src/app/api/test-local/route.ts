import { NextResponse } from "next/server";

/**
 * POST /api/test-local
 *
 * Sends a tool-calling test to the local model and returns the raw response.
 * Use this to verify whether the local model supports tool calling before
 * switching the main /api/ask route to use it.
 *
 * Does NOT touch /api/ask or the Groq path.
 */

const TEST_TOOL = {
  type: "function",
  function: {
    name: "highlight_section",
    description: "Highlight a section of the portfolio page.",
    parameters: {
      type: "object",
      properties: {
        section: {
          type: "string",
          enum: ["about", "projects", "skills", "experience"],
          description: "The section to highlight.",
        },
      },
      required: ["section"],
    },
  },
};

export async function POST() {
  const localUrl = process.env.LOCAL_MODEL_URL;
  if (!localUrl) {
    return NextResponse.json(
      { error: "LOCAL_MODEL_URL is not set in .env.local" },
      { status: 500 }
    );
  }

  const payload = {
    model: "qwen2.5-7b-instruct-1m",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant on a portfolio website. When asked about projects, call the highlight_section tool.",
      },
      {
        role: "user",
        content: "Can you highlight the projects section for me?",
      },
    ],
    tools: [TEST_TOOL],
    tool_choice: "auto",
  };

  let raw: unknown;
  try {
    const res = await fetch(localUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    raw = await res.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach local model", detail: String(err) },
      { status: 502 }
    );
  }

  // Pull out the fields we care about for the verdict
  const choice = (raw as { choices?: { message?: { content?: string; tool_calls?: unknown[] } }[] })
    ?.choices?.[0];
  const toolCalls = choice?.message?.tool_calls ?? [];
  const content = choice?.message?.content ?? "";

  const verdict =
    Array.isArray(toolCalls) && toolCalls.length > 0
      ? "✅ Tool calling WORKS — model returned tool_calls"
      : "❌ Tool calling did NOT fire — tool_calls is empty";

  return NextResponse.json({
    verdict,
    tool_calls: toolCalls,
    content,
    raw, // full response for inspection
  });
}
