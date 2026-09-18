import { LayoutMap } from "./types";

const CUSTOM_LAYOUT_KEY = "kll:custom-layout";

export function loadCustomLayout(): LayoutMap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CUSTOM_LAYOUT_KEY);
    return raw ? (JSON.parse(raw) as LayoutMap) : null;
  } catch {
    return null;
  }
}

export function saveCustomLayout(map: LayoutMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CUSTOM_LAYOUT_KEY, JSON.stringify(map));
  } catch {
    // storage unavailable — ignore silently, editor still works in-session
  }
}

export function clearCustomLayout(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CUSTOM_LAYOUT_KEY);
}
