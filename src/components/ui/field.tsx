// src/components/ui/field.tsx
import { useId } from "react";
import { cn } from "@/lib/utils";

export function controlStyles(hasError: boolean, className?: string) {
  return cn(
    "block min-h-11 w-full rounded-md border bg-canvas px-3 text-base text-ink placeholder:text-muted/70",
    hasError ? "border-berry" : "border-line hover:border-ink",
    className,
  );
}

export function FieldMessage({
  id,
  error,
  hint,
}: {
  id: string;
  error?: string | undefined;
  hint?: string | undefined;
}) {
  if (error) return <p id={id} className="text-sm text-berry">{error}</p>;
  if (hint) return <p id={id} className="text-sm text-muted">{hint}</p>;
  return null;
}

type FieldProps = React.ComponentProps<"input"> & {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  trailing?: React.ReactNode;
};

export function Field({ label, error, hint, trailing, id, className, ...props }: FieldProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const descId = `${inputId}-desc`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? descId : undefined}
          className={controlStyles(Boolean(error), cn(trailing ? "pr-12" : "", className))}
          {...props}
        />
        {trailing ? <div className="absolute inset-y-0 right-0">{trailing}</div> : null}
      </div>
      <FieldMessage id={descId} error={error} hint={hint} />
    </div>
  );
}