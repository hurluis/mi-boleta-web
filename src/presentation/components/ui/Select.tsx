import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/presentation/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...rest }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-11 w-full appearance-none rounded-xl border bg-surface px-3.5 pr-10 text-sm text-strong transition-colors",
            "border-soft hover:border-brand-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15",
            invalid &&
              "border-rose-400/70 focus:border-rose-500 focus:ring-rose-500/15",
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="m5 7 5 5 5-5"
          />
        </svg>
      </div>
    );
  },
);
Select.displayName = "Select";
