import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/presentation/lib/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 select-none ring-focus disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white shadow-[0_8px_24px_-8px_rgb(124_77_255/0.6)] hover:shadow-[0_10px_30px_-8px_rgb(124_77_255/0.7)] hover:brightness-110",
  secondary:
    "bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-100 dark:hover:bg-brand-500/25",
  ghost:
    "text-strong hover:bg-ink-100 dark:hover:bg-white/5",
  danger:
    "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-[0_8px_24px_-8px_rgb(244_63_94/0.6)] hover:brightness-110",
  outline:
    "border border-soft bg-surface text-strong hover:border-brand-400/60 hover:text-brand-700 dark:hover:text-brand-200",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(base, variants[variant], sizes[size], className)}
        {...rest}
      >
        {loading ? <Spinner size="sm" /> : leftIcon}
        <span className="flex items-center gap-2">{children}</span>
        {!loading ? rightIcon : null}
      </button>
    );
  },
);
Button.displayName = "Button";
