import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/presentation/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-strong placeholder:text-muted transition-colors",
          "border-soft hover:border-brand-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15",
          invalid &&
            "border-rose-400/70 focus:border-rose-500 focus:ring-rose-500/15",
          className,
        )}
        {...rest}
      />
    );
  },
);
Input.displayName = "Input";
