import OpenAI from "openai";
import type { ChatMessage, AgentResponse, UIAction, ModelSource } from "@/types";
import { toolDefinitions, executeTool } from "./tools";
import { projects } from "@/data/projects";
import { experience, education, summary } from "@/data/resume";
import { skills } from "@/data/skills";
import { profile } from "@/data/profile";

// ─── Clients ───────────────────────────────────────────────────────────────────

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const cerebrasClient = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: "https://api.cerebras.ai/v1",
});

const localClient = new OpenAI({
  apiKey: "local",
  baseURL: process.env.LOCAL_MODEL_URL,
});

const GROQ_MODEL = "llama-3.3-70b-versatile";
const CEREBRAS_MODEL = "llama3.1-8b";
const LOCAL_MODEL = "qwen2.5-7b-instruct-1m";

// ─── Compact markdown formatters ───────────────────────────────────────────────

function formatProjects(): string {
  return projects
    .map(
      (p) =>
        `**${p.title}** [${p.tags.join(", ")}]\nTech: ${p.tech.join(", ")}\n${p.description}`
    )
    .join("\n\n");
}

function formatExperience(): string {
  return experience
    .map(
      (e) =>
        `**${e.role} @ ${e.company}** (${e.period})\n${e.bullets.map((b) => `- ${b}`).join("\n")}`
    )
    .join("\n\n");
}

function formatEducation(): string {
  return education
    .map((e) => `- ${e.degree}, ${e.institution} (${e.year})`)
    .join("\n");
}

function formatSkills(): string {
  return skills.map((g) => `**${g.category}:** ${g.items.join(", ")}`).join("\n");
}

function buildFilterValues(): string {
  const allTags = [...new Set(projects.flatMap((p) => p.tags))];
  const allTech = [...new Set(projects.flatMap((p) => p.tech))];
  return `Available tags: ${allTags.join(", ")}\nAvailable tech: ${allTech.join(", ")}`;
}

function buildSystemPrompt(): string {
  return `You are an AI assistant on a software engineer's portfolio website. Recruiters ask you questions about the candidate's background, projects, and skills.

Important: the candidate's name is ${profile.name}. When a recruiter uses "you" or "your" (e.g. "What have you built?"), they refer to ${profile.name.split(" ")[0]} — not to you.

All candidate data is below. Use it to answer accurately — do not invent anything.

## Summary
${summary}

## Projects
${formatProjects()}

## Work Experience
${formatExperience()}

## Education
${formatEducation()}

## Skills
${formatSkills()}

---

RULES — follow all of them, every time, no exceptions:

Rule 1 (CRITICAL): You MUST call "answer" in every single response — no exceptions. If you forget, the recruiter sees nothing. Always call it, even for simple or vague questions. Use the candidate data above to give a helpful 1-2 sentence response.

Rule 2: Call "highlight_section" on every response, pointing to the most relevant section.

Rule 3: Call "filter_projects" ONLY when the question is about a specific technology, topic, or subset of projects (e.g. "AI projects", "React work", "mobile apps"). Do NOT call it when the question asks for all projects, an overview, or a summary of everything (e.g. "summarize all projects", "what have you built?", "list your projects"). In those cases, answer with a full overview without filtering.
When calling filter_projects, ONLY use values from the lists below — do not invent new ones:
${buildFilterValues()}

Mapping:
- Specific topic / tech   → answer + filter_projects(tags, tech) + highlight_section("projects")
- All projects / overview → answer + highlight_section("projects")
- Work experience / jobs  → answer + highlight_section("experience")
- Education / school / degree → answer + highlight_section("education")
- Skills                  → answer + highlight_section("skills")
- About / general         → answer + highlight_section("about")`;
}

// ─── Single-call execution ─────────────────────────────────────────────────────

type OpenAIMessage = OpenAI.Chat.ChatCompletionMessageParam;

async function callModel(
  client: OpenAI,
  model: string,
  messages: OpenAIMessage[],
  uiActions: UIAction[],
  toolChoice: "required" | "auto" = "required"
): Promise<Omit<AgentResponse, "model" | "fallback">> {
  const response = await client.chat.completions.create({
    model,
    messages,
    tools: toolDefinitions,
    tool_choice: toolChoice,
  });

  const DEFAULT_ANSWER = "I'm not sure how to answer that.";
  let answer = DEFAULT_ANSWER;
  const assistantMsg = response.choices[0].message;

  for (const tc of assistantMsg.tool_calls ?? []) {
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(tc.function.arguments);
    } catch {
      // ignore
    }

    if (tc.function.name === "answer") {
      const text = args.text as string | undefined;
      if (text) answer = text;
    } else {
      executeTool(tc.function.name, args, uiActions);
    }
  }

  // If model forgot to call "answer", use message.content as first fallback
  if (answer === DEFAULT_ANSWER && assistantMsg.content) {
    answer = assistantMsg.content;
  }

  // Last resort: retry with answer tool forced
  if (answer === DEFAULT_ANSWER) {
    console.warn("[agent] retrying for answer...");
    const filterAction = uiActions.find((a) => a.type === "filter_projects");
    let retryHint = "Please call the answer tool now and give the recruiter a helpful 1-2 sentence response based on the candidate data above.";
    if (filterAction) {
      const { tags, tech } = filterAction.payload as { tags: string[]; tech: string[] };
      const parts: string[] = [];
      if (tags.length) parts.push(`tags: ${tags.join(", ")}`);
      if (tech.length) parts.push(`tech: ${tech.join(", ")}`);
      if (parts.length) {
        retryHint = `You already filtered projects for ${parts.join("; ")}. Now call the answer tool and summarize what Jane has built in that area, using the project data provided above.`;
      }
    }
    const retryMessages: OpenAIMessage[] = [
      ...messages,
      assistantMsg,
      { role: "user", content: `You forgot to call the answer tool. ${retryHint}` },
    ];
    try {
      const retryResponse = await client.chat.completions.create({
        model,
        messages: retryMessages,
        tools: toolDefinitions,
        tool_choice: { type: "function", function: { name: "answer" } },
      });
      const retryArgs = JSON.parse(
        retryResponse.choices[0].message.tool_calls?.[0]?.function.arguments ?? "{}"
      );
      answer = (retryArgs.text as string) || `Feel free to ask about ${profile.name.split(" ")[0]}'s projects, experience, or skills!`;
    } catch {
      answer = `Feel free to ask about ${profile.name.split(" ")[0]}'s projects, experience, or skills!`;
    }
  }

  // Guarantee highlight_section fires — infer it from other tool calls or message
  const alreadyHighlighted = uiActions.some((a) => a.type === "highlight_section");
  if (!alreadyHighlighted) {
    const hasFilterProjects = uiActions.some((a) => a.type === "filter_projects");
    const msg = messages[messages.length - 1];
    const q = typeof msg.content === "string" ? msg.content.toLowerCase() : "";

    let section: "about" | "projects" | "skills" | "experience" | "education" = "about";
    if (hasFilterProjects || /project|build|built|app|tool/i.test(q)) {
      section = "projects";
    } else if (/experience|job|company|role|career|intern/i.test(q)) {
      section = "experience";
    } else if (/education|school|university|degree|gpa|study|graduate/i.test(q)) {
      section = "education";
    } else if (/skill|tech|stack|language|framework/i.test(q)) {
      section = "skills";
    }
    uiActions.push({ type: "highlight_section", payload: { section } });
  }

  return { answer, ui_actions: uiActions };
}

// ─── Public entry point ────────────────────────────────────────────────────────

type StatusCallback = (model: ModelSource, status: "loading" | "failed") => void;

const MODEL_CHAIN: { client: OpenAI; model: string; source: ModelSource; toolChoice: "required" | "auto" }[] = [
  { client: groqClient,     model: GROQ_MODEL,     source: "groq",     toolChoice: "required" },
  { client: cerebrasClient, model: CEREBRAS_MODEL, source: "cerebras", toolChoice: "required" },
  { client: localClient,    model: LOCAL_MODEL,    source: "local",    toolChoice: "required" },
];

const HISTORY_LIMIT = 6;

export async function runAgent(
  userMessage: string,
  history: ChatMessage[],
  onStatus?: StatusCallback
): Promise<AgentResponse> {
  const uiActions: UIAction[] = [];

  const messages: OpenAIMessage[] = [
    { role: "system", content: buildSystemPrompt() },
    ...history
      .slice(-HISTORY_LIMIT)
      .map((m) => ({ role: m.role, content: m.content } as OpenAIMessage)),
    { role: "user", content: userMessage },
  ];

  for (const { client, model, source, toolChoice } of MODEL_CHAIN) {
    onStatus?.(source, "loading");
    try {
      const result = await callModel(client, model, messages, uiActions, toolChoice);
      return { ...result, model: source, fallback: source !== "groq" };
    } catch (err) {
      console.warn(`[agent] ${source} failed:`, err);
      onStatus?.(source, "failed");
    }
  }

  // All models failed
  return {
    answer: `All AI models are currently unavailable. You can reach Alex directly at ${profile.email}`,
    ui_actions: [],
    model: "local",
    fallback: true,
  };
}
