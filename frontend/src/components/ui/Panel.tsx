import { PropsWithChildren } from "react";
import clsx from "clsx";

export function Panel({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("glass rounded-2xl p-4 shadow-[0_22px_70px_-45px_rgba(0,0,0,0.6)]", className)}>{children}</div>;
}

