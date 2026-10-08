"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { logIn } from "@/lib/local/auth";
import { loginSchema, toFieldErrors } from "@/lib/schemas/auth";

type Props = {
  onSuccess?: () => void;
};

const ORDER = ["email", "password"];

export function LoginForm({ onSuccess }: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  function focusField(form: HTMLFormElement, name: string) {
    const element = form.elements.namedItem(name);
    if (element instanceof HTMLElement) element.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const result = loginSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) {
      const next = toFieldErrors(result.error);
      setErrors(next);
      const first = ORDER.find((key) => key in next);
      if (first) focusField(form, first);
      return;
    }

    setErrors({});
    setPending(true);

    const auth = await logIn(result.data.email, result.data.password);
    if (!auth.ok) {
      setPending(false);
      setErrors({ [auth.field]: auth.message });
      focusField(form, auth.field);
      return;
    }

    // Di AuthModal: tutup modal, tetap di halaman yang sama.
    if (onSuccess) {
      onSuccess();
      return;
    }
    // Di halaman /masuk: lanjut ke beranda.
    router.push("/beranda");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        error={errors.email}
      />

      <PasswordField
        label="Kata sandi"
        name="password"
        autoComplete="current-password"
        error={errors.password}
      />

      <Button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-ink text-canvas hover:opacity-90 hover:brightness-100"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Memproses…
          </>
        ) : (
          "Masuk"
        )}
      </Button>
    </form>
  );
}