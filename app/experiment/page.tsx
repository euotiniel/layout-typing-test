"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TypingArea from "@/components/TypingArea";
import PhysicalKeyboard from "@/components/PhysicalKeyboard";
import ProgressDots from "@/components/ProgressDots";
import { useSession, currentLayoutMap, ROUNDS_PER_LAYOUT } from "@/lib/session-context";
import { getLayoutDefinition } from "@/lib/layouts";
import { useTypingEngine } from "@/hooks/useTypingEngine";

export default function ExperimentPage() {
  const router = useRouter();
  const { session, customMap, currentLayoutId, currentPhrase, recordResult, isSessionComplete } =
    useSession();

  useEffect(() => {
    if (session.plan.length === 0) {
      router.replace("/");
    } else if (isSessionComplete) {
      router.replace("/results");
    }
  }, [session.plan.length, isSessionComplete, router]);

  const layoutId = currentLayoutId ?? "qwerty";
  const layoutDef = getLayoutDefinition(layoutId, customMap);
  const map = currentLayoutMap(layoutId, customMap);
  const phrase = currentPhrase ?? "";

  const { typed, activeCode, pressVirtualKey } = useTypingEngine({
    phrase,
    layoutMap: map,
    layoutId,
    roundIndex: session.roundIndex,
    enabled: Boolean(currentPhrase) && !isSessionComplete,
    onComplete: recordResult,
  });

  if (!currentPhrase) return null;

  const layoutsTotal = session.plan.length;
  const layoutPosition = session.layoutIndex + 1;

  return (
    <main className="mx-auto flex min-h-dvh max-w-editorial flex-col justify-center gap-10 px-6 py-14 sm:px-12 lg:px-20">
      <header className="flex flex-col gap-3 text-center">
        <p className="font-mono text-xs tracking-wide text-ink-soft">
          layout {layoutPosition} de {layoutsTotal}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl">{layoutDef.name}</h1>
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="font-sans text-xs text-ink-soft">
            ronda {session.roundIndex + 1} de {ROUNDS_PER_LAYOUT}
          </span>
          <ProgressDots total={ROUNDS_PER_LAYOUT} current={session.roundIndex} />
        </div>
      </header>

      <div key={phrase} className="animate-rise">
        <TypingArea phrase={phrase} typed={typed} />
      </div>

      <div className="flex justify-center overflow-x-auto">
        <PhysicalKeyboard map={map} activeCode={activeCode} onKeyTap={pressVirtualKey} />
      </div>

      <p className="text-center font-sans text-xs text-ink-soft">
        Escreve a frase acima — no teclado físico do computador ou tocando nas teclas do ecrã. Um
        erro fica marcado até corrigires com backspace.
      </p>
    </main>
  );
}
