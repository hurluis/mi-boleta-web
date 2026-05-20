import type { ReactNode } from "react";
import { RequireAdmin } from "@/presentation/guards/RequireAdmin";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>;
}
