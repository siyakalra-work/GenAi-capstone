import { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="glass rounded-2xl p-4 shadow-[0_22px_70px_-45px_rgba(0,0,0,0.6)]">
      {children}
    </div>
  );
}
