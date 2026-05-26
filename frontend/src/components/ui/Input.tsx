import clsx from "clsx";
import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl border border-slate-200/70 dark:border-slate-800/60 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400/40 backdrop-blur",
        props.className,
      )}
    />
  );
}
