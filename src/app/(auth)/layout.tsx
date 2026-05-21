"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Search, ShieldCheck } from "lucide-react";
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgb(124_77_255/0.10),transparent_38%),linear-gradient(315deg,rgb(6_182_212/0.10),transparent_36%)]"
      />

      <header className="border-b border-soft glass">
        <Container size="wide" className="flex h-16 items-center justify-between">
          <Logo />
          <ThemeToggle />
        </Container>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="hidden lg:block">
            <p className="inline-block rounded-full border border-brand-400/20 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-200">
              Tu suerte, organizada
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-strong xl:text-6xl">
              Nunca más pierdas de vista una{" "}
              <span className="bg-gradient-to-br from-brand-500 via-teal-500 to-gold-500 bg-clip-text text-transparent">
                boleta importante.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-muted">
              Registra cada rifa, sorteo o juego ocasional en segundos. Conserva
              tus números, fechas, valores y resultados en una experiencia clara
              y lista para revisar.
            </p>
            <ul className="mt-7 grid max-w-lg gap-3 text-sm text-strong">
              <li className="flex items-center gap-3 rounded-lg border border-soft bg-surface/70 p-3">
                <CalendarCheck className="h-5 w-5 text-teal-500" />
                Dashboard con próximos sorteos
              </li>
              <li className="flex items-center gap-3 rounded-lg border border-soft bg-surface/70 p-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Sesión segura con JWT
              </li>
              <li className="flex items-center gap-3 rounded-lg border border-soft bg-surface/70 p-3">
                <Search className="h-5 w-5 text-gold-500" />
                Búsqueda y filtros avanzados
              </li>
            </ul>
          </div>

          <div className="relative w-full max-w-md justify-self-center">
            <div className="panel-sheen rounded-lg border border-soft p-6 shadow-glow sm:p-8 animate-in">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
