// src/components/ui/button.tsx
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline";

export function buttonStyles(variant: Variant = "primary", className?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary"
      ? "bg-iris text-on-accent hover:brightness-90"
      : "border border-ink text-ink hover:bg-ink hover:text-canvas",
    className,
  );
}

type Props = React.ComponentProps<"button"> & { variant?: Variant | undefined };

export function Button({ variant = "primary", className, ...props }: Props) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}