"use client";

import { useState } from "react";
import { summary } from "@/data/resume";
import { profile } from "@/data/profile";

interface HeroProps {
  highlighted: boolean;
}

export default function Hero({ highlighted }: HeroProps) {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section
      id="about"
      className={`scroll-mt-8 rounded-2xl p-8 transition-all duration-500 ${
        highlighted
          ? "ring-2 ring-blue-500 bg-blue-950/30"
          : "bg-neutral-900"
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        {/* Avatar placeholder */}
        <div className="shrink-0">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-28 h-28 rounded-full object-cover object-center"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white select-none">
              {profile.initials}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
          <p className="text-blue-400 font-medium mt-1">
            {profile.title}
          </p>
          <p className="text-neutral-300 mt-3 leading-relaxed max-w-2xl">
            {summary}
          </p>

          <div className="flex gap-3 mt-4 flex-wrap items-center">
            <button
              onClick={copyEmail}
              className="text-sm px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {copied ? "Copied!" : "Copy email"}
            </button>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-sm px-4 py-1.5 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-sm px-4 py-1.5 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
