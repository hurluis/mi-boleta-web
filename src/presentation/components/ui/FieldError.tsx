import type { ReactNode } from "react";
import { cn } from "@/presentation/lib/cn";

export function FieldError({
  id,
  children,
  className,
}: {
  id?: string;
  children?: ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn("mt-1.5 text-xs font-medium text-rose-500", className)}
    >
      {children}
    </p>
  );
}
