"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/authStore";
import { useToast } from "@/presentation/providers/ToastProvider";
import { Spinner } from "@/presentation/components/ui/Spinner";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { push } = useToast();
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
    } else if (user?.role !== "admin") {
      push("Acceso denegado: solo administradores", "error");
      router.replace("/dashboard");
    }
  }, [hydrated, token, user, router, push]);

  if (!hydrated || !token || user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
