"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import ErrorHeatmap from "@/components/ErrorHeatmap";
import Button from "@/components/Button";
import { useSession } from "@/lib/session-context";
import { aggregateRounds } from "@/lib/metrics";
import { LAYOUTS } from "@/lib/layouts";
import { LayoutId } from "@/lib/types";

const CANONICAL_ORDER: LayoutId[] = ["qwerty", "alphabetic", "dvorak", "custom"];

export default function ResultsPage() {
  const router = useRouter();
  const { session, isSessionComplete, resetSession, startStandardSession } = useSession();

  useEffect(() => {
    if (session.results.length === 0) router.replace("/");
  }, [session.results.length, router]);

  const aggregates = useMemo(() => {
    const byLayout = new Map<LayoutId, typeof session.results>();
    for (const r of session.results) {
      const list = byLayout.get(r.layoutId) ?? [];
      list.push(r);
      byLayout.set(r.layoutId, list);
    }
    return CANONICAL_ORDER.filter((id) => byLayout.has(id)).map((id) =>
      aggregateRounds(id, byLayout.get(id)!)
    );
  }, [session.results]);

  const combinedErrorKeys = useMemo(() => {
    const combined: Record<string, number> = {};
    for (const agg of aggregates) {
      for (const [code, count] of Object.entries(agg.errorKeys)) {
        combined[code] = (combined[code] ?? 0) + count;
      }
    }
    return combined;
  }, [aggregates]);

  const bestId = useMemo(() => {
    if (aggregates.length < 2) return null;
    return aggregates.reduce((best, a) => (a.avgWpm > best.avgWpm ? a : best), aggregates[0])
      .layoutId;
  }, [aggregates]);

  if (session.results.length === 0) return null;

  function handleRepeat() {
    resetSession();
    startStandardSession();
    router.push("/experiment");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-editorial flex-col gap-14 px-6 py-16 sm:px-12 lg:px-20">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-wide text-ink-soft">resultado</p>
        <h1 className="font-serif text-3xl sm:text-4xl">
          {isSessionComplete ? "Como te saíste em cada disposição" : "Resultado parcial"}
        </h1>
      </header>

      <section
        className={`grid grid-cols-1 gap-6 ${
          aggregates.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {aggregates.map((agg) => (
          <ResultCard key={agg.layoutId} aggregate={agg} isBest={bestId === agg.layoutId} />
        ))}
      </section>

      <section className="flex flex-col items-center gap-5 border-t border-rule pt-12">
        <h2 className="font-serif text-2xl">Onde erraste mais</h2>
        <ErrorHeatmap map={LAYOUTS.qwerty.map} errorKeys={combinedErrorKeys} />
        <p className="max-w-md text-center font-sans text-xs text-ink-soft">
          As posições mostradas são físicas — a mesma tecla pode ter representado letras diferentes
          consoante o layout.
        </p>
      </section>

      <section className="rounded-lg border border-rule bg-sand/40 px-6 py-5">
        <p className="font-sans text-sm text-ink-soft">
          Este experimento mede o teu desempenho atual e é fortemente influenciado pela familiaridade
          com cada layout. Não determina qual layout é universalmente superior.
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-4 pb-8">
        <Button variant="secondary" onClick={() => router.push("/")}>
          Voltar ao início
        </Button>
        <Button onClick={handleRepeat}>Repetir experimento</Button>
      </div>
    </main>
  );
}
