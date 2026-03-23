"use client";

type Status = "idle" | "loading" | "active" | "failed";

interface ModelStatusProps {
  groqStatus: Status;
  cerebrasStatus: Status;
  localStatus: Status;
}

const DOT: Record<Status, string> = {
  idle:    "w-1.5 h-1.5 bg-neutral-600",
  loading: "w-1.5 h-1.5 bg-blue-400 animate-pulse",
  active:  "w-2 h-2 bg-green-400",
  failed:  "w-2 h-2 bg-yellow-500",
};

const LABEL: Record<Status, string> = {
  idle:    "text-neutral-500",
  loading: "text-blue-400",
  active:  "text-green-400",
  failed:  "text-yellow-500",
};

function Bars() {
  return (
    <span className="flex items-end gap-px h-3 ml-1.5 flex-shrink-0">
      <span className="w-[3px] rounded-full bg-blue-400 animate-[modelbar_0.8s_ease-in-out_infinite]"       style={{ height: "60%" }} />
      <span className="w-[3px] rounded-full bg-blue-400 animate-[modelbar_0.8s_ease-in-out_0.2s_infinite]" style={{ height: "100%" }} />
      <span className="w-[3px] rounded-full bg-blue-400 animate-[modelbar_0.8s_ease-in-out_0.4s_infinite]" style={{ height: "40%" }} />
      <span className="w-[3px] rounded-full bg-blue-400 animate-[modelbar_0.8s_ease-in-out_0.1s_infinite]" style={{ height: "80%" }} />
    </span>
  );
}

function ModelRow({ status, name, latency }: { status: Status; name: string; latency: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`rounded-full flex-shrink-0 ${DOT[status]}`} />
      <span className={`text-xs font-mono ${LABEL[status]}`}>
        {name}
        <span className="ml-1 opacity-40">{latency}</span>
        {status === "failed" && <span className="ml-1 opacity-70">(rate limited)</span>}
      </span>
      {status === "loading" && <Bars />}
    </div>
  );
}

export default function ModelStatus({ groqStatus, cerebrasStatus, localStatus }: ModelStatusProps) {
  return (
    <>
      <style>{`
        @keyframes modelbar {
          0%, 100% { transform: scaleY(0.4); }
          50%       { transform: scaleY(1); }
        }
      `}</style>
      <div className="fixed left-4 bottom-44 z-40 flex flex-col gap-1.5 select-none">
        <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-mono mb-0.5">
          Models
        </span>
        <ModelRow status={groqStatus}     name="Groq · llama-3.3-70b"  latency="" />
        <ModelRow status={cerebrasStatus} name="Cerebras · llama3.1-8b" latency="" />
        <ModelRow status={localStatus}    name="Local · qwen2.5-7b"     latency="< 30s" />
      </div>
    </>
  );
}
