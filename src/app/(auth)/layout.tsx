"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/authStore";
import { Container } from "@/presentation/components/layout/Container";
import { Logo } from "@/presentation/components/layout/Logo";
import { ThemeToggle } from "@/presentation/components/layout/ThemeToggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (hydrated && token) {
      router.replace("/dashboard");
    }
  }, [hydrated, token, router]);

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl" />
      </div>

      <header className="border-b border-soft glass">
        <Container size="wide" className="flex h-16 items-center justify-between">
          <Logo />
          <ThemeToggle />
        </Container>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="hidden lg:block">
            <p className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-200">
              Tu suerte, organizada
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-strong xl:text-5xl">
              Nunca más te quedes con la duda de{" "}
              <span className="bg-gradient-to-br from-brand-500 via-brand-600 to-gold-500 bg-clip-text text-transparent">
                «¿y si sí me lo gané?»
              </span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted">
              Registra cada boleta, rifa o sorteo en segundos. Recibe el estado
              de tus juegos pendientes, próximos sorteos y un historial
              completo en un solo lugar.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-strong">
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-gold-500">
                  ★
                </span>
                Dashboard con próximos sorteos
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-gold-500">
                  ★
                </span>
                Sesión segura con JWT
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="text-gold-500">
                  ★
                </span>
                Búsqueda y filtros avanzados
              </li>
            </ul>
          </div>

          <div className="relative w-full max-w-md justify-self-center">
            <div className="rounded-3xl border border-soft bg-elevated p-6 shadow-glow sm:p-8 animate-in">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
