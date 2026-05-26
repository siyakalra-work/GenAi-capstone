import { PropsWithChildren } from "react";
import clsx from "clsx";

export function Button({
  children,
  className,
  type = "button",
  onClick,
  disabled,
}: PropsWithChildren<{ className?: string; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean }>) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "rounded-xl px-3 py-2 text-sm border border-slate-200/70 dark:border-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-white/5 disabled:opacity-50 transition",
        className,
      )}
    >
      {children}
    </button>
  );
}
