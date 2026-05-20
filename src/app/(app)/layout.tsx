import type { ReactNode } from "react";
import { RequireAuth } from "@/presentation/guards/RequireAuth";
import { ProtectedShell } from "@/presentation/components/layout/ProtectedShell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <ProtectedShell>{children}</ProtectedShell>
    </RequireAuth>
  );
}
