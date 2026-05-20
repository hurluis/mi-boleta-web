import type { LabelHTMLAttributes } from "react";
import { cn } from "@/presentation/lib/cn";

export function Label({
  className,
  children,
  required,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label
      className={cn(
        "mb-1.5 inline-flex items-center gap-1 text-sm font-medium text-strong",
        className,
      )}
      {...rest}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-rose-500">
          *
        </span>
      )}
    </label>
  );
}
