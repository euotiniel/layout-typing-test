"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PhysicalKeyboard from "@/components/PhysicalKeyboard";
import Button from "@/components/Button";
import { LAYOUTS } from "@/lib/layouts";
import { useSession } from "@/lib/session-context";

export default function HomePage() {
  const router = useRouter();
  const { startStandardSession, resetSession } = useSession();

  function handleStart() {
    resetSession();
    startStandardSession();
    router.push("/experiment");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-editorial flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <p className="font-mono text-xs tracking-wide text-ink-soft">
            um pequeno laboratório de digitação
          </p>
          <h1 className="font-serif text-[2.1rem] leading-[1.08] sm:text-[2.7rem] lg:text-[3.4rem]">
            Qual teclado funciona melhor para ti?
          </h1>
          <p className="max-w-md font-sans text-[0.95rem] text-ink-soft sm:text-base lg:text-lg">
            Digita a mesma frase em três disposições diferentes — QWERTY, Alfabético e Dvorak —
            e vê como a familiaridade muda o teu ritmo, os teus erros e a tua velocidade.
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-2">
            <Button onClick={handleStart}>Iniciar experimento</Button>
            <Link
              href="/editor"
              className="font-sans text-sm text-ink-soft underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-ink"
            >
              Criar meu próprio layout
            </Link>
          </div>

          <p className="pt-4 font-sans text-xs text-ink-soft">
            Num computador, usa o teu teclado físico — lemos a posição real das teclas, não o
            layout ativo no sistema. No telemóvel, toca diretamente nas teclas do ecrã.
          </p>
        </div>

        <div className="flex justify-center overflow-x-auto lg:justify-end">
          <PhysicalKeyboard map={LAYOUTS.qwerty.map} />
        </div>
      </div>
    </main>
  );
}
