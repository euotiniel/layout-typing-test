"use client";

import PhysicalKeyboard from "./PhysicalKeyboard";
import { LayoutMap } from "@/lib/types";

interface ErrorHeatmapProps {
  map: LayoutMap;
  errorKeys: Record<string, number>;
}

export default function ErrorHeatmap({ map, errorKeys }: ErrorHeatmapProps) {
  const total = Object.values(errorKeys).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <PhysicalKeyboard map={map} errorKeys={errorKeys} />
      {total === 0 ? (
        <p className="font-sans text-sm text-ink-soft">Sem erros registados neste layout.</p>
      ) : (
        <p className="font-sans text-sm text-ink-soft">
          Quanto mais escura a tecla, mais vezes falhaste nessa posição.
        </p>
      )}
    </div>
  );
}
