"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md px-6 py-3 text-[0.95rem] font-sans transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-ink text-paper hover:bg-accent",
    secondary: "bg-transparent text-ink border border-ink hover:border-accent hover:text-accent",
    ghost: "bg-transparent text-ink-soft hover:text-ink",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
