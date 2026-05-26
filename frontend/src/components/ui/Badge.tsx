import clsx from "clsx";
import { PropsWithChildren } from "react";

export function Badge({
  children,
  tone = "neutral",
  className,
}: PropsWithChildren<{ tone?: "neutral" | "good" | "warn" | "bad" | "info"; className?: string }>) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs border";
  const toneClass =
    tone === "good"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
      : tone === "warn"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
        : tone === "bad"
          ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
          : tone === "info"
            ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
            : "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";

  return <span className={clsx(base, toneClass, className)}>{children}</span>;
}

