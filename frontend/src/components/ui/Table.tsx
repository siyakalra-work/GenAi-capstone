import { PropsWithChildren } from "react";

export function Table({ children }: PropsWithChildren) {
  return (
    <div className="overflow-auto rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: PropsWithChildren) {
  return <thead className="text-left text-muted bg-white/40 dark:bg-white/5">{children}</thead>;
}

export function TH({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <th className={`py-3 px-4 font-medium ${className ?? ""}`}>{children}</th>;
}

export function TR({ children }: PropsWithChildren) {
  return <tr className="border-t border-slate-200/60 dark:border-slate-800/60">{children}</tr>;
}

export function TD({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <td className={`py-3 px-4 ${className ?? ""}`}>{children}</td>;
}

