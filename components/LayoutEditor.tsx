"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhysicalKeyboard from "./PhysicalKeyboard";
import Button from "./Button";
import { LayoutMap } from "@/lib/types";
import { defaultCustomMap } from "@/lib/layouts";
import { useSession } from "@/lib/session-context";

export default function LayoutEditor() {
  const { customMap, updateCustomMap, startCustomSession } = useSession();
  const [map, setMap] = useState<LayoutMap>(customMap);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const router = useRouter();

  function swap(a: string, b: string) {
    if (a === b) return;
    setMap((prev) => ({ ...prev, [a]: prev[b], [b]: prev[a] }));
  }

  function handleDrop(target: string) {
    if (dragSource) swap(dragSource, target);
    setDragSource(null);
    setDropTarget(null);
  }

  function handleReset() {
    setMap(defaultCustomMap());
  }

  function handleSave() {
    updateCustomMap(map);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  }

  function handleTest() {
    updateCustomMap(map);
    startCustomSession();
    router.push("/experiment");
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="w-full overflow-x-auto pb-2">
        <div className="mx-auto w-fit">
          <PhysicalKeyboard
            map={map}
            draggable
            dragSource={dragSource}
            dropTarget={dropTarget}
            onDragStart={setDragSource}
            onDragOverKey={setDropTarget}
            onDrop={handleDrop}
            onDragEnd={() => {
              setDragSource(null);
              setDropTarget(null);
            }}
          />
        </div>
      </div>

      <p className="max-w-md text-center font-sans text-sm text-ink-soft">
        Arrasta uma tecla para cima de outra para trocar as letras entre as duas posições físicas.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button variant="secondary" onClick={handleReset}>
          Repor QWERTY
        </Button>
        <Button variant="secondary" onClick={handleSave}>
          {savedFlash ? "Guardado" : "Guardar layout"}
        </Button>
        <Button variant="primary" onClick={handleTest}>
          Testar este layout
        </Button>
      </div>
    </div>
  );
}
