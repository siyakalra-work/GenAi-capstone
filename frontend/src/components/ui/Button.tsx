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
        "rounded-lg px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

