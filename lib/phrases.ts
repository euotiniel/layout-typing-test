import { LayoutId } from "./types";

/**
 * Frases em portugues, propositadamente sem acentos nem pontuacao —
 * so letras minusculas e espacos — para que o desafio dependa apenas
 * da disposicao do teclado, e nao da capacidade de reproduzir acentos.
 * Mantidas com comprimento e dificuldade semelhantes entre si.
 */
export const PHRASE_POOL = [
  "o rato roeu a rolha da garrafa do rei",
  "uma boa ideia pode mudar um projeto",
  "o sol nasce sempre do lado leste",
  "duas maos digitam mais rapido que uma",
  "o teclado fisico guarda cada posicao",
  "medir o tempo ajuda a entender o erro",
  "a pratica constante cria memoria muscular",
  "um texto curto testa a mesma coisa sempre",
  "cada tecla tem um lugar fixo no espaco",
  "letras soltas formam frases completas",
  "o dedo minimo carrega pouco peso",
  "escrever rapido nem sempre e escrever bem",
  "um bom layout reduz o esforco das maos",
  "o habito muda a forma como as maos se movem",
  "tres rodadas bastam para medir a media",
  "a ordem dos testes muda a cada sessao",
  "um pequeno erro pode custar tempo real",
  "o ritmo entre teclas conta uma historia",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffledLayoutOrder(layouts: LayoutId[]): LayoutId[] {
  return shuffle(layouts);
}

/** Returns `layouts.length * roundsPerLayout` phrases, evenly drawn from the pool. */
export function pickSessionPhrases(layoutCount: number, roundsPerLayout: number): string[][] {
  const needed = layoutCount * roundsPerLayout;
  let pool = shuffle(PHRASE_POOL);
  while (pool.length < needed) pool = pool.concat(shuffle(PHRASE_POOL));
  const chosen = pool.slice(0, needed);
  const grouped: string[][] = [];
  for (let i = 0; i < layoutCount; i++) {
    grouped.push(chosen.slice(i * roundsPerLayout, (i + 1) * roundsPerLayout));
  }
  return grouped;
}
