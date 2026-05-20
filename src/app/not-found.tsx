import Link from "next/link";
import { Container } from "@/presentation/components/layout/Container";
import { Logo } from "@/presentation/components/layout/Logo";

export default function NotFound() {
  return (
    <Container className="flex min-h-screen flex-col items-center justify-center text-center">
      <Logo />
      <p className="mt-8 font-display text-7xl font-semibold text-brand-600 dark:text-brand-300">
        404
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-strong">
        Esta página no existe
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Parece que la boleta se perdió en el sorteo. Vuelve al inicio para
        seguir administrando tus juegos.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-5 text-sm font-medium text-white shadow-glow"
      >
        Volver al inicio
      </Link>
    </Container>
  );
}
