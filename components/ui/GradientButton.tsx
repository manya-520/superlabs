"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface GradientButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "md" | "lg";
  variant?: "primary" | "ghost";
}

const sizeClasses = {
  md: "h-9 px-4 text-[13px]",
  lg: "h-10 px-5 text-[14px]",
};

export const GradientButton = forwardRef<
  HTMLButtonElement,
  GradientButtonProps
>(function GradientButton(
  { size = "md", variant = "primary", className = "", disabled, ...rest },
  ref,
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold select-none transition-[background,box-shadow,opacity] duration-200 ease-out";

  const variantClass =
    variant === "primary"
      ? "text-white bg-[linear-gradient(135deg,#8539FF,#B57FFF)] shadow-[0_6px_16px_rgba(133,57,255,0.28)] hover:shadow-[0_10px_22px_rgba(133,57,255,0.32)] active:translate-y-px"
      : "text-[color:var(--text-1)] bg-white/70 border border-black/10 hover:bg-white";

  const disabledClass = disabled
    ? "opacity-40 pointer-events-none shadow-none"
    : "";

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${base} ${sizeClasses[size]} ${variantClass} ${disabledClass} ${className}`}
      {...rest}
    />
  );
});
