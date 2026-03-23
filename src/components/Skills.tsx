"use client";

import { skills } from "@/data/skills";

interface SkillsProps {
  highlighted: boolean;
}

export default function Skills({ highlighted }: SkillsProps) {
  return (
    <section
      id="skills"
      className={`scroll-mt-8 rounded-2xl p-8 transition-all duration-500 ${
        highlighted
          ? "ring-2 ring-blue-500 bg-blue-950/30"
          : "bg-neutral-900"
      }`}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((group) => (
          <div key={group.category} className="rounded-xl bg-neutral-800 p-4 border border-neutral-700">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="text-sm px-2.5 py-1 rounded-lg bg-neutral-700 text-neutral-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
