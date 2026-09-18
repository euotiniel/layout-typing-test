"use client";

import { ROW_1_CODES, ROW_2_CODES, ROW_3_CODES, SPACE_CODE, BACKSPACE_CODE } from "@/lib/layouts";
import { LayoutMap } from "@/lib/types";
import Key from "./Key";

interface PhysicalKeyboardProps {
  map: LayoutMap;
  activeCode?: string | null;
  errorKeys?: Record<string, number>;
  draggable?: boolean;
  dragSource?: string | null;
  dropTarget?: string | null;
  onDragStart?: (code: string) => void;
  onDragOverKey?: (code: string) => void;
  onDrop?: (code: string) => void;
  onDragEnd?: () => void;
  onKeyTap?: (code: string) => void;
  showControlRow?: boolean;
}

const ROWS = [ROW_1_CODES, ROW_2_CODES, ROW_3_CODES];
const ROW_OFFSET_FACTOR = [0, 0.3, 0.75]; // multiples of --key-unit, like a real keyboard's stagger

export default function PhysicalKeyboard({
  map,
  activeCode,
  errorKeys,
  draggable,
  dragSource,
  dropTarget,
  onDragStart,
  onDragOverKey,
  onDrop,
  onDragEnd,
  onKeyTap,
  showControlRow = true,
}: PhysicalKeyboardProps) {
  const maxErrors = errorKeys ? Math.max(1, ...Object.values(errorKeys)) : 1;

  return (
    <div className="flex flex-col items-center gap-[var(--key-gap)] select-none">
      {ROWS.map((row, i) => (
        <div
          key={i}
          className="flex"
          style={{ gap: "var(--key-gap)", marginLeft: `calc(var(--key-unit) * ${ROW_OFFSET_FACTOR[i]})` }}
        >
          {row.map((code) => (
            <Key
              key={code}
              code={code}
              label={map[code] ?? ""}
              unit={1}
              active={activeCode === code}
              intensity={errorKeys && errorKeys[code] ? errorKeys[code] / maxErrors : 0}
              draggable={draggable}
              isDragSource={dragSource === code}
              isDropTarget={dropTarget === code}
              onDragStart={onDragStart}
              onDragOver={onDragOverKey}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              onPress={onKeyTap}
            />
          ))}
        </div>
      ))}
      {showControlRow && (
        <div className="flex mt-1" style={{ gap: "var(--key-gap)" }}>
          <Key
            code={SPACE_CODE}
            label=" "
            unit={5}
            active={activeCode === SPACE_CODE}
            intensity={errorKeys && errorKeys[SPACE_CODE] ? errorKeys[SPACE_CODE] / maxErrors : 0}
            onPress={onKeyTap}
          />
          <Key
            code={BACKSPACE_CODE}
            label="⌫"
            unit={2}
            active={activeCode === BACKSPACE_CODE}
            onPress={onKeyTap}
          />
        </div>
      )}
    </div>
  );
}
