import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/presentation/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-strong placeholder:text-muted transition-colors resize-y",
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
Textarea.displayName = "Textarea";
