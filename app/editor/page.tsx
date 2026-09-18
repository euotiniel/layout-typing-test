"use client";

import Link from "next/link";
import LayoutEditor from "@/components/LayoutEditor";

export default function EditorPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-editorial flex-col gap-10 px-6 py-16 sm:px-12 lg:px-20">
      <header className="flex flex-col gap-3">
        <Link href="/" className="w-fit font-sans text-xs text-ink-soft hover:text-ink">
          ← voltar
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl">Cria o teu próprio layout</h1>
        <p className="max-w-lg font-sans text-base text-ink-soft">
          Parte do QWERTY e troca letras de posição até teres a disposição que queres testar.
          O layout fica guardado neste navegador.
        </p>
      </header>

      <LayoutEditor />
    </main>
  );
}
