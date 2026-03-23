"use client";

import { projects } from "@/data/projects";
import type { FilterProjectsAction } from "@/types";

interface ProjectsProps {
  highlighted: boolean;
  filter: FilterProjectsAction["payload"] | null;
  onClearFilter: () => void;
}

export default function Projects({
  highlighted,
  filter,
  onClearFilter,
}: ProjectsProps) {
  const visible = projects.filter((p) => {
    if (!filter) return true;
    const hasTagFilter = (filter.tags?.length ?? 0) > 0;
    const hasTechFilter = (filter.tech?.length ?? 0) > 0;
    if (!hasTagFilter && !hasTechFilter) return true;
    const tagMatch =
      hasTagFilter &&
      filter.tags!.some((ft) =>
        p.tags.some((pt) => pt.toLowerCase() === ft.toLowerCase())
      );
    const techMatch =
      hasTechFilter &&
      filter.tech!.some((ft) =>
        p.tech.some((pt) => pt.toLowerCase() === ft.toLowerCase())
      );
    return tagMatch || techMatch;
  });

  const hasFilter =
    filter && ((filter.tags?.length ?? 0) > 0 || (filter.tech?.length ?? 0) > 0);

  return (
    <section
      id="projects"
      className={`scroll-mt-8 rounded-2xl p-8 transition-all duration-500 ${
        highlighted
          ? "ring-2 ring-blue-500 bg-blue-950/30"
          : "bg-neutral-900"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        {hasFilter && (
          <div className="flex items-center gap-2 flex-wrap">
            {filter?.tags?.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-full bg-violet-700 text-violet-100"
              >
                {t}
              </span>
            ))}
            {filter?.tech?.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-full bg-blue-700 text-blue-100"
              >
                {t}
              </span>
            ))}
            <button
              onClick={onClearFilter}
              className="text-xs text-neutral-400 hover:text-white ml-1 underline transition-colors"
            >
              clear
            </button>
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="text-neutral-400 text-sm">
          No projects match the current filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((p) => (
            <div
              key={p.id}
              className="rounded-xl bg-neutral-800 p-5 flex flex-col gap-3 hover:bg-neutral-750 transition-colors border border-neutral-700 hover:border-neutral-600"
            >
              <h3 className="font-semibold text-white">{p.title}</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {p.description}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 mt-auto pt-1">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    GitHub →
                  </a>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Live →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
