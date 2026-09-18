"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { LayoutId, LayoutMap, RoundResult, SessionPlanItem } from "./types";
import { pickSessionPhrases, shuffledLayoutOrder } from "./phrases";
import { defaultCustomMap, getLayoutDefinition } from "./layouts";
import { loadCustomLayout, saveCustomLayout } from "./storage";

export const ROUNDS_PER_LAYOUT = 3;
const CORE_LAYOUTS: LayoutId[] = ["qwerty", "alphabetic", "dvorak"];

interface SessionState {
  plan: SessionPlanItem[];
  layoutIndex: number;
  roundIndex: number;
  results: RoundResult[];
  active: boolean;
}

const EMPTY_SESSION: SessionState = {
  plan: [],
  layoutIndex: 0,
  roundIndex: 0,
  results: [],
  active: false,
};

interface SessionContextValue {
  session: SessionState;
  customMap: LayoutMap;
  startStandardSession: () => void;
  startCustomSession: () => void;
  recordResult: (result: RoundResult) => void;
  resetSession: () => void;
  updateCustomMap: (map: LayoutMap) => void;
  currentLayoutId: LayoutId | null;
  currentPhrase: string | null;
  isSessionComplete: boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(EMPTY_SESSION);
  const [customMap, setCustomMap] = useState<LayoutMap>(() =>
    typeof window !== "undefined" ? loadCustomLayout() ?? defaultCustomMap() : defaultCustomMap()
  );

  const buildPlan = useCallback((layouts: LayoutId[]): SessionPlanItem[] => {
    const order = shuffledLayoutOrder(layouts);
    const phrasesByLayout = pickSessionPhrases(order.length, ROUNDS_PER_LAYOUT);
    return order.map((layoutId, i) => ({ layoutId, phrases: phrasesByLayout[i] }));
  }, []);

  const startStandardSession = useCallback(() => {
    setSession({
      plan: buildPlan(CORE_LAYOUTS),
      layoutIndex: 0,
      roundIndex: 0,
      results: [],
      active: true,
    });
  }, [buildPlan]);

  const startCustomSession = useCallback(() => {
    setSession({
      plan: buildPlan(["custom"]),
      layoutIndex: 0,
      roundIndex: 0,
      results: [],
      active: true,
    });
  }, [buildPlan]);

  const recordResult = useCallback((result: RoundResult) => {
    setSession((prev) => {
      const results = [...prev.results, result];
      const layoutRoundsDone = prev.roundIndex + 1;
      const currentLayoutRounds = prev.plan[prev.layoutIndex]?.phrases.length ?? ROUNDS_PER_LAYOUT;
      if (layoutRoundsDone < currentLayoutRounds) {
        return { ...prev, results, roundIndex: layoutRoundsDone };
      }
      const nextLayoutIndex = prev.layoutIndex + 1;
      if (nextLayoutIndex < prev.plan.length) {
        return { ...prev, results, layoutIndex: nextLayoutIndex, roundIndex: 0 };
      }
      return { ...prev, results, active: false };
    });
  }, []);

  const resetSession = useCallback(() => setSession(EMPTY_SESSION), []);

  const updateCustomMap = useCallback((map: LayoutMap) => {
    setCustomMap(map);
    saveCustomLayout(map);
  }, []);

  const currentPlanItem = session.plan[session.layoutIndex] ?? null;
  const currentLayoutId = currentPlanItem?.layoutId ?? null;
  const currentPhrase = currentPlanItem?.phrases[session.roundIndex] ?? null;

  const isSessionComplete =
    session.plan.length > 0 &&
    session.results.length === session.plan.reduce((n, p) => n + p.phrases.length, 0);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      customMap,
      startStandardSession,
      startCustomSession,
      recordResult,
      resetSession,
      updateCustomMap,
      currentLayoutId,
      currentPhrase,
      isSessionComplete,
    }),
    [
      session,
      customMap,
      startStandardSession,
      startCustomSession,
      recordResult,
      resetSession,
      updateCustomMap,
      currentLayoutId,
      currentPhrase,
      isSessionComplete,
    ]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

export function currentLayoutMap(layoutId: LayoutId, customMap: LayoutMap) {
  return getLayoutDefinition(layoutId, customMap).map;
}
