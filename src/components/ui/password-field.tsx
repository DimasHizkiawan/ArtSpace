// src/components/ui/password-field.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Field } from "./field";

type Props = Omit<React.ComponentProps<typeof Field>, "type" | "trailing">;

export function PasswordField(props: Props) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;
  return (
    <Field
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={visible}
          className="grid size-11 place-items-center text-muted hover:text-ink"
        >
          <Icon className="size-5" aria-hidden="true" />
        </button>
      }
    />
  );
}