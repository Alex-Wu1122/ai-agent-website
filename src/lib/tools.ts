import type { UIAction } from "@/types";
import type OpenAI from "openai";

// ─── Tool schemas ─────────────────────────────────────────────────────────────

export const toolDefinitions: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "answer",
      description:
        "YOU MUST call this in every single response with a non-empty, helpful answer based on the candidate data. Never omit this call. Never leave text empty.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "Your response to the recruiter." },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "highlight_section",
      description:
        "Highlight a specific section of the portfolio page to draw the recruiter's attention.",
      parameters: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["about", "projects", "skills", "experience", "education"],
            description: "The section to highlight.",
          },
        },
        required: ["section"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "filter_projects",
      description:
        "Filter the projects grid to show only projects matching certain tags or technologies.",
      parameters: {
        type: "object",
        properties: {
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Filter by these tags (e.g. ['AI', 'Mobile']).",
          },
          tech: {
            type: "array",
            items: { type: "string" },
            description: "Filter by these technologies (e.g. ['React', 'Python']).",
          },
        },
        required: ["tags", "tech"],
      },
    },
  },
];

// ─── Tool executor ─────────────────────────────────────────────────────────────

export function executeTool(
  name: string,
  args: Record<string, unknown>,
  uiActions: UIAction[]
): string {
  switch (name) {
    case "highlight_section": {
      const section = args.section as
        | "about"
        | "projects"
        | "skills"
        | "experience"
        | "education";
      uiActions.push({ type: "highlight_section", payload: { section } });
      return JSON.stringify({ ok: true });
    }

    case "filter_projects": {
      const tags = Array.isArray(args.tags) ? (args.tags as string[]) : [];
      const tech = Array.isArray(args.tech) ? (args.tech as string[]) : [];
      uiActions.push({ type: "filter_projects", payload: { tags, tech } });
      return JSON.stringify({ ok: true });
    }

    case "answer":
      return JSON.stringify({ ok: true }); // text is extracted in agent.ts

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
