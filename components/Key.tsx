"use client";

interface KeyProps {
  code: string;
  label: string;
  unit: number;
  active?: boolean;
  intensity?: number; // 0..1, used by the error heatmap
  draggable?: boolean;
  isDragSource?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (code: string) => void;
  onDragOver?: (code: string) => void;
  onDrop?: (code: string) => void;
  onDragEnd?: () => void;
  onPress?: (code: string) => void;
  fluid?: boolean;
}

export default function Key({
  code,
  label,
  unit,
  active,
  intensity,
  draggable,
  isDragSource,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onPress,
  fluid,
}: KeyProps) {
  const heat = intensity ?? 0;
  const tappable = Boolean(onPress) && !draggable;

  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={() => onDragStart?.(code)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(code);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(code);
      }}
      onDragEnd={() => onDragEnd?.()}
      onPointerDown={tappable ? (e) => {
        e.preventDefault();
        onPress?.(code);
      } : undefined}
      tabIndex={-1}
      aria-hidden={!draggable && !tappable}
      className={[
        "relative flex items-center justify-center select-none rounded-md border font-mono transition-colors duration-100",
        fluid ? "h-12 text-base sm:h-14 sm:text-lg" : "",
        active ? "bg-key-active border-key-active text-paper animate-press" : "bg-key border-rule text-ink",
        isDragSource ? "opacity-40" : "",
        isDropTarget ? "ring-2 ring-accent ring-offset-1 ring-offset-paper" : "",
        draggable ? "cursor-grab active:cursor-grabbing" : tappable ? "cursor-pointer touch-manipulation" : "cursor-default",
      ].join(" ")}
      style={
        fluid
          ? { flex: `${unit} 1 0%`, minWidth: 0, fontSize: undefined }
          : {
              width: `calc(var(--key-unit) * ${unit} + var(--key-gap) * ${unit - 1})`,
              height: "var(--key-height)",
              fontSize: "var(--key-font)",
            }
      }
    >
      {heat > 0 && !active && (
        <span
          className="absolute inset-0 rounded-md bg-wrong pointer-events-none"
          style={{ opacity: 0.12 + heat * 0.55 }}
        />
      )}
      <span className="relative uppercase">{label === " " ? "" : label}</span>
    </button>
  );
}