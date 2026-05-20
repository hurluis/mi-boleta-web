"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/presentation/hooks/useAuth";
import { cn } from "@/presentation/lib/cn";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Container } from "./Container";
import { Button } from "@/presentation/components/ui/Button";

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tickets", label: "Mis boletas" },
  { href: "/tickets/new", label: "Registrar" },
];
const ADMIN_ITEM: NavItem = { href: "/admin", label: "Admin" };

function isActive(itemHref: string, pathname: string): boolean {
  if (itemHref === "/admin") return pathname.startsWith("/admin");
  if (itemHref === "/tickets/new") return pathname === "/tickets/new";
  if (itemHref === "/tickets")
    return (
      pathname === "/tickets" ||
      (pathname.startsWith("/tickets/") && pathname !== "/tickets/new")
    );
  return pathname === itemHref || pathname.startsWith(itemHref + "/");
}

export function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const items = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;
  const initials = (user?.name ?? "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-soft glass">
      <Container size="wide" className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="ring-focus rounded-lg" aria-label="Ir al dashboard">
            <Logo />
          </Link>

          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {items.map((item) => {
                const active = isActive(item.href, pathname);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-150 ring-focus",
                        active
                          ? "bg-brand-500/10 text-brand-700 dark:text-brand-200"
                          : "text-muted hover:bg-ink-100/60 hover:text-strong dark:hover:bg-white/5",
                      )}
                    >
                      {item.label}
                    </Link>
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-brand-500"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />

          <div className="hidden items-center gap-2.5 sm:flex">
            <div
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[11px] font-bold text-white ring-2 ring-brand-400/20"
            >
              {initials}
            </div>
            <div className="hidden flex-col leading-tight lg:flex">
              <span className="text-sm font-medium text-strong">{user?.name}</span>
              <span className="text-xs text-muted">{user?.email}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="hidden sm:inline-flex"
          >
            Salir
          </Button>

          <button
            type="button"
            aria-label={open ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-soft bg-surface text-strong transition-colors hover:bg-ink-100/60 dark:hover:bg-white/5 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {open ? (
                <path strokeLinecap="round" d="m6 6 12 12M6 18 18 6" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-soft lg:hidden animate-in">
          <Container size="wide" className="space-y-3 py-4">
            <nav aria-label="Menu movil">
              <ul className="grid gap-1">
                {items.map((item) => {
                  const active = isActive(item.href, pathname);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-brand-500/10 text-brand-700 dark:text-brand-200"
                            : "text-muted hover:bg-ink-100/60 hover:text-strong dark:hover:bg-white/5",
                        )}
                      >
                        {item.label}
                        {active && (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-brand-500"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center justify-between border-t border-soft pt-3">
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white ring-2 ring-brand-400/20"
                >
                  {initials}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-strong">{user?.name}</span>
                  <span className="text-xs text-muted">{user?.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={logout}>
                  Salir
                </Button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
