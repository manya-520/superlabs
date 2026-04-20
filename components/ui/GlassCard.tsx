"use client";

import { forwardRef, type HTMLAttributes } from "react";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "subtle";
  interactive?: boolean;
}

const classes = {
  base: "rounded-xl border p-4",
  glass: "glass",
  solid: "bg-white border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
  subtle: "glass-subtle",
  interactive:
    "cursor-pointer transition-colors duration-200 hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-[color:var(--brand)]",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    { variant = "glass", interactive, className = "", ...rest },
    ref,
  ) {
    const variantClass = classes[variant];
    const interactiveClass = interactive ? classes.interactive : "";
    return (
      <div
        ref={ref}
        className={`${classes.base} ${variantClass} ${interactiveClass} ${className}`}
        {...rest}
      />
    );
  },
);
