# Keyboard Layout Lab

Aplicação web para comparar o desempenho de digitação em três disposições de
teclado — **QWERTY**, **Alfabético** e **Dvorak** — mais um editor para criar
disposições personalizadas. Pensada para gravar como demonstração em vídeo.

## Como correr o projeto

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000`. Em computador, usa o teclado físico — a app lê
a posição real das teclas. Em telemóvel/tablet, toca diretamente nas teclas
desenhadas no ecrã: cada toque simula a mesma posição física que um
`KeyboardEvent.code` reportaria.

Outros comandos:

```bash
pnpm build   # build de produção
pnpm start   # corre o build de produção
pnpm lint    # eslint
```

## A ideia central: `KeyboardEvent.code`, não `KeyboardEvent.key`

Cada tecla física dispara sempre o mesmo `code` (ex.: `KeyQ` para a tecla
onde está o Q num teclado QWERTY), independentemente do layout ativo no
sistema operativo. A app ignora por completo `event.key` e usa só `event.code`
para saber **qual posição física** foi premida, depois consulta o mapa do
layout ativo (`lib/layouts.ts`) para saber que carácter essa posição produz
nesse layout. É assim que premir a tecla física do Q insere "A" quando o
layout Alfabético está ativo.

## Estrutura de ficheiros

```
keyboard-layout-lab/
├── app/
│   ├── layout.tsx            # fontes, metadata, SessionProvider
│   ├── globals.css           # tailwind + resets
│   ├── page.tsx               # tela inicial
│   ├── experiment/page.tsx    # ronda de digitação em curso
│   ├── results/page.tsx       # comparação final + heatmap de erros
│   └── editor/page.tsx        # editor de layout personalizado
├── components/
│   ├── Key.tsx                # uma tecla (com drag-and-drop opcional)
│   ├── PhysicalKeyboard.tsx    # teclado completo, a partir de um LayoutMap
│   ├── TypingArea.tsx          # frase-alvo com cores por caractere
│   ├── ResultCard.tsx          # card grande de resultado por layout
│   ├── ErrorHeatmap.tsx        # teclado sombreado pelas posições mais erradas
│   ├── LayoutEditor.tsx        # drag-and-drop + guardar/testar layout
│   ├── ProgressDots.tsx        # indicador de ronda
│   └── Button.tsx
├── hooks/
│   └── useTypingEngine.ts     # captura de teclas físicas + métricas da ronda
├── lib/
│   ├── types.ts                # tipos partilhados
│   ├── layouts.ts              # geometria física + mapas QWERTY/Alfabético/Dvorak
│   ├── phrases.ts               # banco de frases + baralhar ordem dos layouts
│   ├── metrics.ts               # WPM, precisão, agregação por layout
│   ├── storage.ts               # localStorage do layout personalizado
│   └── session-context.tsx      # estado global da sessão (React Context)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Fluxo

1. **Início** — título, "Iniciar experimento" e "Criar o meu próprio layout".
2. **Experimento** — a ordem dos três layouts é baralhada a cada sessão
   (reduz o efeito de ordem); cada layout tem 3 rondas com frases de
   comprimento semelhante. Erros ficam marcados até serem corrigidos com
   backspace; colar texto está bloqueado.
3. **Resultado** — um card grande por layout com WPM, precisão, tempo e
   erros (médias das 3 rondas), mais um mapa de calor das posições físicas
   onde mais erraste, e o aviso sobre familiaridade vs. desempenho.
4. **Editor** — arrasta uma tecla para cima de outra para trocar letras,
   repõe o QWERTY, guarda no `localStorage` ou testa o layout diretamente.

## Notas de implementação

- Sem backend: tudo corre no browser; o único armazenamento persistente é o
  `localStorage` do layout personalizado.
- As frases usadas no teste são propositadamente sem acentos e sem
  pontuação, para que o desafio dependa só da disposição das letras.
- Motion é mínimo (uma transição de entrada por frase, feedback de tecla
  premida) e respeita `prefers-reduced-motion`.
- Mobile-first: o teclado no ecrã usa variáveis CSS (`--key-unit`,
  `--key-gap`, `--key-height`, `--key-font` em `app/globals.css`) que
  começam pequenas para telemóvel e crescem em `sm:`/`lg:`, e cada tecla
  responde a toque (`hooks/useTypingEngine.ts` → `pressVirtualKey`) da mesma
  forma que a um `keydown` físico. Em ecrãs maiores, o desktop continua a
  ter prioridade visual (~1440px), mas a app é totalmente utilizável só por
  toque.
