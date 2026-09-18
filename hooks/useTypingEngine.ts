"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutMap, RoundResult, LayoutId } from "@/lib/types";
import { calcAccuracy, calcWpm, mean } from "@/lib/metrics";

interface UseTypingEngineArgs {
  phrase: string;
  layoutMap: LayoutMap;
  layoutId: LayoutId;
  roundIndex: number;
  enabled: boolean;
  onComplete: (result: RoundResult) => void;
}

interface EngineCounters {
  startedAt: number | null;
  phraseShownAt: number;
  lastKeyAt: number | null;
  intervals: number[];
  totalKeystrokes: number;
  errorCount: number;
  backspaceCount: number;
  errorKeys: Record<string, number>;
}

function freshCounters(): EngineCounters {
  return {
    startedAt: null,
    phraseShownAt: performance.now(),
    lastKeyAt: null,
    intervals: [],
    totalKeystrokes: 0,
    errorCount: 0,
    backspaceCount: 0,
    errorKeys: {},
  };
}

export function useTypingEngine({
  phrase,
  layoutMap,
  layoutId,
  roundIndex,
  enabled,
  onComplete,
}: UseTypingEngineArgs) {
  const [typed, setTyped] = useState("");
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const counters = useRef<EngineCounters>(freshCounters());
  const completedRef = useRef(false);
  const layoutMapRef = useRef(layoutMap);
  layoutMapRef.current = layoutMap;
  const phraseRef = useRef(phrase);
  phraseRef.current = phrase;

  // Reset engine state whenever a new phrase/round starts.
  useEffect(() => {
    setTyped("");
    setActiveCode(null);
    setDone(false);
    completedRef.current = false;
    counters.current = freshCounters();
  }, [phrase, layoutId, roundIndex]);

  const finish = useCallback(
    (finalTyped: string) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const c = counters.current;
      const now = performance.now();
      const totalTimeMs = c.startedAt ? now - c.startedAt : 0;
      const timeToFirstKeyMs = c.startedAt ? c.startedAt - c.phraseShownAt : 0;
      const correctKeystrokes = c.totalKeystrokes - c.errorCount;
      const result: RoundResult = {
        layoutId,
        roundIndex,
        phrase: phraseRef.current,
        typed: finalTyped,
        totalTimeMs,
        timeToFirstKeyMs,
        avgIntervalMs: Math.round(mean(c.intervals)),
        wpm: calcWpm(phraseRef.current.length, totalTimeMs),
        accuracy: calcAccuracy(correctKeystrokes, c.totalKeystrokes),
        errorCount: c.errorCount,
        backspaceCount: c.backspaceCount,
        errorKeys: c.errorKeys,
      };
      setDone(true);
      onComplete(result);
    },
    [layoutId, roundIndex, onComplete]
  );

  /** Shared by real keydown events and virtual (on-screen) taps. */
  const applyCode = useCallback(
    (code: string) => {
      if (!enabled || completedRef.current) return;
      const map = layoutMapRef.current;
      const currentPhrase = phraseRef.current;
      const isBackspace = code === "Backspace";
      const char = map[code];
      if (!isBackspace && char === undefined) return;

      const c = counters.current;
      const now = performance.now();
      if (c.startedAt === null) c.startedAt = now;
      else if (c.lastKeyAt !== null) c.intervals.push(now - c.lastKeyAt);
      c.lastKeyAt = now;

      if (isBackspace) {
        c.backspaceCount += 1;
        setTyped((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
        return;
      }

      setTyped((prev) => {
        if (prev.length >= currentPhrase.length) {
          c.totalKeystrokes += 1;
          c.errorCount += 1;
          c.errorKeys[code] = (c.errorKeys[code] ?? 0) + 1;
          return prev;
        }
        const expected = currentPhrase[prev.length];
        const next = prev + char;
        c.totalKeystrokes += 1;
        if (char !== expected) {
          c.errorCount += 1;
          c.errorKeys[code] = (c.errorKeys[code] ?? 0) + 1;
        }
        if (next === currentPhrase) {
          queueMicrotask(() => finish(next));
        }
        return next;
      });
    },
    [enabled, finish]
  );

  // Real physical keyboard.
  useEffect(() => {
    if (!enabled || done) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return; // let shortcuts through
      const isBackspace = e.code === "Backspace";
      const char = layoutMapRef.current[e.code];
      if (!isBackspace && char === undefined) return;
      e.preventDefault();
      setActiveCode(e.code);
      applyCode(e.code);
    }

    function onKeyUp(e: KeyboardEvent) {
      setActiveCode((prev) => (prev === e.code ? null : prev));
    }

    function blockPaste(e: ClipboardEvent) {
      e.preventDefault();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("paste", blockPaste, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("paste", blockPaste, true);
    };
  }, [enabled, done, applyCode]);

  // Virtual (on-screen) key, for touch devices without a physical keyboard.
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressVirtualKey = useCallback(
    (code: string) => {
      if (!enabled || done) return;
      setActiveCode(code);
      applyCode(code);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      releaseTimer.current = setTimeout(() => {
        setActiveCode((prev) => (prev === code ? null : prev));
      }, 130);
    },
    [enabled, done, applyCode]
  );

  useEffect(() => {
    return () => {
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    };
  }, []);

  return { typed, activeCode, done, pressVirtualKey };
}
