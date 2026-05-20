import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function ProtectedShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 sm:py-10">{children}</main>
      <footer className="border-t border-soft py-6 text-center text-xs text-muted">
        Mi Boleta · Hecho con Next.js + Clean Architecture
      </footer>
    </div>
  );
}
