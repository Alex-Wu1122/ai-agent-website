"use client";

import { experience } from "@/data/resume";

interface ExperienceProps {
  highlighted: boolean;
}

export default function Experience({ highlighted }: ExperienceProps) {
  return (
    <section
      id="experience"
      className={`scroll-mt-8 rounded-2xl p-8 transition-all duration-500 ${
        highlighted
          ? "ring-2 ring-blue-500 bg-blue-950/30"
          : "bg-neutral-900"
      }`}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Experience</h2>

      <div className="flex flex-col gap-6">
        {experience.map((job, i) => (
          <div key={i} className="flex gap-4">
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              {i < experience.length - 1 && (
                <div className="w-px flex-1 bg-neutral-700 mt-1" />
              )}
            </div>

            <div className="pb-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="font-semibold text-white">{job.role}</h3>
                <span className="text-neutral-400 text-sm">@ {job.company}</span>
                <span className="text-neutral-500 text-xs ml-auto">{job.period}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {job.bullets.map((b, j) => (
                  <li key={j} className="text-sm text-neutral-300 flex gap-2">
                    <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
