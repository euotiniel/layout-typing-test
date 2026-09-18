"use client";

interface TypingAreaProps {
  phrase: string;
  typed: string;
}

export default function TypingArea({ phrase, typed }: TypingAreaProps) {
  return (
    <div className="w-full rounded-lg border border-rule bg-white px-4 py-6 sm:px-10 sm:py-9">
      <p className="font-mono text-[1.05rem] leading-relaxed tracking-wide sm:text-[1.3rem] lg:text-[1.55rem]">
        {phrase.split("").map((char, i) => {
          const isTyped = i < typed.length;
          const isCursor = i === typed.length;
          const isCorrect = isTyped && typed[i] === char;
          const isWrong = isTyped && typed[i] !== char;
          const display = char === " " ? "\u00A0" : char;

          return (
            <span
              key={i}
              className={[
                "relative",
                isCorrect ? "text-ink" : "",
                isWrong ? "text-wrong bg-wrong-soft rounded-[2px]" : "",
                !isTyped ? "text-ink-soft/50" : "",
                isCursor ? "border-l-2 border-accent" : "",
              ].join(" ")}
            >
              {display}
            </span>
          );
        })}
      </p>
    </div>
  );
}
