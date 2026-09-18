import { LayoutAggregate, LayoutId, RoundResult } from "./types";
import { getLayoutDefinition } from "./layouts";

export function calcWpm(charCount: number, ms: number): number {
  if (ms <= 0) return 0;
  const minutes = ms / 60000;
  const words = charCount / 5;
  return Math.round((words / minutes) * 10) / 10;
}

export function calcAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  return Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10;
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function aggregateRounds(layoutId: LayoutId, rounds: RoundResult[]): LayoutAggregate {
  const errorKeys: Record<string, number> = {};
  for (const r of rounds) {
    for (const [code, count] of Object.entries(r.errorKeys)) {
      errorKeys[code] = (errorKeys[code] ?? 0) + count;
    }
  }
  return {
    layoutId,
    layoutName: getLayoutDefinition(layoutId).name,
    avgWpm: Math.round(mean(rounds.map((r) => r.wpm)) * 10) / 10,
    avgAccuracy: Math.round(mean(rounds.map((r) => r.accuracy)) * 10) / 10,
    avgTimeMs: Math.round(mean(rounds.map((r) => r.totalTimeMs))),
    avgErrors: Math.round(mean(rounds.map((r) => r.errorCount)) * 10) / 10,
    errorKeys,
    rounds,
  };
}

export function formatTime(ms: number): string {
  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}m ${seconds}s`;
}
