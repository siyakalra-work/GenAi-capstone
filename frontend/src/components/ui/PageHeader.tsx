import { PropsWithChildren } from "react";

export function PageHeader({
  title,
  subtitle,
  right,
}: PropsWithChildren<{ title: string; subtitle?: string; right?: React.ReactNode }>) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-2xl font-semibold tracking-tight">{title}</div>
        {subtitle ? <div className="text-sm text-muted mt-1">{subtitle}</div> : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

