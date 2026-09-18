"use client";

interface ProgressDotsProps {
  total: number;
  current: number; // 0-indexed
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={[
            "h-1.5 w-1.5 rounded-full transition-colors",
            i < current ? "bg-ink" : i === current ? "bg-accent" : "bg-rule",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
