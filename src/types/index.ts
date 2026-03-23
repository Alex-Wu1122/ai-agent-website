// ─── Data types ────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  tags: string[];
  link?: string;
  github?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

// ─── UI Actions ────────────────────────────────────────────────────────────────

export interface HighlightSectionAction {
  type: "highlight_section";
  payload: { section: "about" | "projects" | "skills" | "experience" | "education" };
}

export interface FilterProjectsAction {
  type: "filter_projects";
  payload: { tags?: string[]; tech?: string[] };
}

export interface ShowPanelAction {
  type: "show_panel";
  payload: { title: string; body: string; items?: string[] };
}

export type UIAction =
  | HighlightSectionAction
  | FilterProjectsAction
  | ShowPanelAction;

// ─── Agent I/O ─────────────────────────────────────────────────────────────────

export type ModelSource = "groq" | "cerebras" | "local";

export interface AgentResponse {
  answer: string;
  ui_actions: UIAction[];
  model: ModelSource;
  fallback?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
