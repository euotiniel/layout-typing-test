export type LayoutId = "qwerty" | "alphabetic" | "dvorak" | "custom";

export interface KeySpec {
  code: string; // KeyboardEvent.code — physical identity of the key
  row: number; // 0 = number row .. 4 = bottom row
  unit: number; // relative width, 1 unit = one standard keycap
  isLetter: boolean;
}

/** Maps a physical KeyboardEvent.code to the character that position produces. */
export type LayoutMap = Record<string, string>;

export interface LayoutDefinition {
  id: LayoutId;
  name: string;
  description: string;
  map: LayoutMap;
}

export interface RoundResult {
  layoutId: LayoutId;
  roundIndex: number;
  phrase: string;
  typed: string;
  totalTimeMs: number;
  timeToFirstKeyMs: number;
  avgIntervalMs: number;
  wpm: number;
  accuracy: number;
  errorCount: number;
  backspaceCount: number;
  errorKeys: Record<string, number>;
}

export interface LayoutAggregate {
  layoutId: LayoutId;
  layoutName: string;
  avgWpm: number;
  avgAccuracy: number;
  avgTimeMs: number;
  avgErrors: number;
  errorKeys: Record<string, number>;
  rounds: RoundResult[];
}

export interface SessionPlanItem {
  layoutId: LayoutId;
  phrases: string[]; // one phrase per round
}
