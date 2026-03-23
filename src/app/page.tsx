"use client";

import { useState, useCallback } from "react";
import type { UIAction, FilterProjectsAction } from "@/types";

import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Chat from "@/components/Chat";
import ModelStatus from "@/components/ModelStatus";

type Section = "about" | "projects" | "skills" | "experience" | "education" | null;
type Status = "idle" | "loading" | "active" | "failed";

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>(null);
  const [projectFilter, setProjectFilter] = useState<FilterProjectsAction["payload"] | null>(null);
  const [groqStatus,     setGroqStatus]     = useState<Status>("idle");
  const [cerebrasStatus, setCerebrasStatus] = useState<Status>("idle");
  const [localStatus,    setLocalStatus]    = useState<Status>("idle");

  const setterFor = (model: string) => {
    if (model === "groq")     return setGroqStatus;
    if (model === "cerebras") return setCerebrasStatus;
    return setLocalStatus;
  };

  const handleStatusEvent = useCallback(
    (event: { type: string; model?: string; status?: string; [k: string]: unknown }) => {
      if (event.type === "reset") {
        setGroqStatus("idle"); setCerebrasStatus("idle"); setLocalStatus("idle");
      } else if (event.type === "status" && event.model) {
        setterFor(event.model)(event.status as Status);
      } else if (event.type === "result" && event.model) {
        setterFor(event.model as string)("active");
      }
    },
    []
  );

  const applyUIActions = useCallback((actions: UIAction[]) => {
    for (const action of actions) {
      if (action.type === "highlight_section") {
        setActiveSection(action.payload.section);
        setTimeout(() => {
          document
            .getElementById(action.payload.section)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else if (action.type === "filter_projects") {
        setProjectFilter(action.payload);
      }
    }
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6 pb-32">
      {/* Model status widget — fixed bottom-left */}
      <ModelStatus groqStatus={groqStatus} cerebrasStatus={cerebrasStatus} localStatus={localStatus} />

      {/* Nav */}
      <nav className="flex items-center justify-between px-1 mb-2">
        <span className="text-neutral-500 text-sm font-mono">portfolio.dev</span>
        <div className="flex gap-4 text-sm text-neutral-400">
          {(["about", "experience", "projects", "skills", "education"] as const).map((s) => (
            <a
              key={s}
              href={`#${s}`}
              onClick={() => setActiveSection(s)}
              className="hover:text-white transition-colors capitalize"
            >
              {s}
            </a>
          ))}
        </div>
      </nav>

      <Hero highlighted={activeSection === "about"} />
      <Experience highlighted={activeSection === "experience"} />
      <Projects
        highlighted={activeSection === "projects"}
        filter={projectFilter}
        onClearFilter={() => setProjectFilter(null)}
      />
      <Skills highlighted={activeSection === "skills"} />
      <Education highlighted={activeSection === "education"} />

      {/* AI Chat */}
      <Chat onActions={applyUIActions} onStatusEvent={handleStatusEvent} />
    </main>
  );
}
