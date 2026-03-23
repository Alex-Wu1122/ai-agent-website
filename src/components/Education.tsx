"use client";

import { education } from "@/data/resume";

interface EducationProps {
  highlighted: boolean;
}

export default function Education({ highlighted }: EducationProps) {
  return (
    <section
      id="education"
      className={`scroll-mt-8 rounded-2xl p-8 transition-all duration-500 ${
        highlighted
          ? "ring-2 ring-blue-500 bg-blue-950/30"
          : "bg-neutral-900"
      }`}
    >
      <h2 className="text-2xl font-bold text-white mb-4">Education</h2>
      <div className="flex flex-col gap-3">
        {education.map((edu, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl bg-neutral-800 px-5 py-3 border border-neutral-700"
          >
            <div>
              <p className="text-white font-medium">{edu.degree}</p>
              <p className="text-neutral-400 text-sm">{edu.institution}</p>
            </div>
            <span className="text-neutral-500 text-sm">{edu.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
