import { KeySpec, LayoutDefinition, LayoutId, LayoutMap } from "./types";

/**
 * Physical geometry of the block of keys the experiment uses.
 * Codes are KeyboardEvent.code values — they identify a PHYSICAL position,
 * independent of whatever the operating system's active layout is.
 */
export const ROW_1_CODES = [
  "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP",
];
export const ROW_2_CODES = [
  "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon",
];
export const ROW_3_CODES = [
  "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash",
];
export const SPACE_CODE = "Space";
export const BACKSPACE_CODE = "Backspace";

export const ALL_ROWS: string[][] = [ROW_1_CODES, ROW_2_CODES, ROW_3_CODES];

export const KEY_SPECS: KeySpec[] = [
  ...ROW_1_CODES.map((code) => ({ code, row: 0, unit: 1, isLetter: code.startsWith("Key") })),
  ...ROW_2_CODES.map((code) => ({ code, row: 1, unit: 1, isLetter: code.startsWith("Key") })),
  ...ROW_3_CODES.map((code) => ({ code, row: 2, unit: 1, isLetter: code.startsWith("Key") })),
  { code: SPACE_CODE, row: 3, unit: 6.25, isLetter: false },
];

export const LETTER_CODES_READING_ORDER = [
  ...ROW_1_CODES,
  ...ROW_2_CODES.filter((c) => c !== "Semicolon"),
  ...ROW_3_CODES.filter((c) => !["Comma", "Period", "Slash"].includes(c)),
];

const PUNCTUATION_IDENTITY: LayoutMap = {
  Semicolon: ";",
  Comma: ",",
  Period: ".",
  Slash: "/",
  [SPACE_CODE]: " ",
};

// ---------------------------------------------------------------------------
// QWERTY — identity mapping (physical code already names the QWERTY letter)
// ---------------------------------------------------------------------------
const QWERTY_MAP: LayoutMap = {
  ...Object.fromEntries(
    [...ROW_1_CODES, ...ROW_2_CODES.filter((c) => c !== "Semicolon"), ...ROW_3_CODES.filter((c) => !["Comma", "Period", "Slash"].includes(c))].map(
      (code) => [code, code.replace("Key", "").toLowerCase()]
    )
  ),
  ...PUNCTUATION_IDENTITY,
};

// ---------------------------------------------------------------------------
// ALFABÉTICO — A..Z laid out left-to-right, top-to-bottom across the same
// 26 physical positions QWERTY uses.
// ---------------------------------------------------------------------------
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const ALPHABETIC_MAP: LayoutMap = {
  ...Object.fromEntries(LETTER_CODES_READING_ORDER.map((code, i) => [code, ALPHABET[i]])),
  ...PUNCTUATION_IDENTITY,
};

// ---------------------------------------------------------------------------
// DVORAK — standard simplified Dvorak, by physical position.
// ---------------------------------------------------------------------------
const DVORAK_MAP: LayoutMap = {
  KeyQ: "'", KeyW: ",", KeyE: ".", KeyR: "p", KeyT: "y",
  KeyY: "f", KeyU: "g", KeyI: "c", KeyO: "r", KeyP: "l",
  KeyA: "a", KeyS: "o", KeyD: "e", KeyF: "u", KeyG: "i",
  KeyH: "d", KeyJ: "h", KeyK: "t", KeyL: "n", Semicolon: "s",
  KeyZ: ";", KeyX: "q", KeyC: "j", KeyV: "k", KeyB: "x",
  KeyN: "b", KeyM: "m", Comma: "w", Period: "v", Slash: "z",
  [SPACE_CODE]: " ",
};

export const LAYOUTS: Record<Exclude<LayoutId, "custom">, LayoutDefinition> = {
  qwerty: {
    id: "qwerty",
    name: "QWERTY",
    description: "A disposição padrão da maioria dos teclados.",
    map: QWERTY_MAP,
  },
  alphabetic: {
    id: "alphabetic",
    name: "Alfabético",
    description: "As letras A–Z em ordem, nas mesmas posições físicas do QWERTY.",
    map: ALPHABETIC_MAP,
  },
  dvorak: {
    id: "dvorak",
    name: "Dvorak",
    description: "Disposição otimizada para reduzir o movimento dos dedos.",
    map: DVORAK_MAP,
  },
};

export function getLayoutDefinition(id: LayoutId, customMap?: LayoutMap): LayoutDefinition {
  if (id === "custom") {
    return {
      id: "custom",
      name: "Meu layout",
      description: "Layout personalizado, criado por ti.",
      map: customMap ?? QWERTY_MAP,
    };
  }
  return LAYOUTS[id];
}

export function defaultCustomMap(): LayoutMap {
  return { ...QWERTY_MAP };
}

/** Character a physical key produces under a given layout map (space-safe). */
export function charForCode(map: LayoutMap, code: string): string | undefined {
  return map[code];
}
