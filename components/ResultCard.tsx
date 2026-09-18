"use client";

import { LayoutAggregate } from "@/lib/types";
import { formatTime } from "@/lib/metrics";

interface ResultCardProps {
  aggregate: LayoutAggregate;
  isBest?: boolean;
}

export default function ResultCard({ aggregate, isBest }: ResultCardProps) {
  return (
    <div
      className={[
        "relative flex flex-col gap-6 rounded-lg border px-7 py-8",
        isBest ? "border-ink bg-sand/60" : "border-rule bg-white",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-2xl">{aggregate.layoutName}</h3>
        {isBest && (
          <span className="font-sans text-xs text-ink-soft">o teu melhor resultado</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 font-mono">
        <Metric label="Palavras / min" value={aggregate.avgWpm.toFixed(1)} />
        <Metric label="Precisão" value={`${aggregate.avgAccuracy.toFixed(1)}%`} />
        <Metric label="Tempo" value={formatTime(aggregate.avgTimeMs)} />
        <Metric label="Erros" value={aggregate.avgErrors.toFixed(1)} />
      </div>

      <p className="font-sans text-xs text-ink-soft">
        Média de {aggregate.rounds.length} rondas
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xl sm:text-3xl">{value}</span>
      <span className="font-sans text-xs text-ink-soft">{label}</span>
    </div>
  );
}
