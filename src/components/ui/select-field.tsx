// src/components/ui/select-field.tsx
import { useId } from "react";
import { controlStyles, FieldMessage } from "./field";

type Option = { value: string; label: string };

type Props = React.ComponentProps<"select"> & {
  label: string;
  options: readonly Option[];
  placeholder: string;
  error?: string | undefined;
};

export function SelectField({ label, options, placeholder, error, id, ...props }: Props) {
  const auto = useId();
  const selectId = id ?? auto;
  const descId = `${selectId}-desc`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? descId : undefined}
        className={controlStyles(Boolean(error))}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldMessage id={descId} error={error} />
    </div>
  );
}