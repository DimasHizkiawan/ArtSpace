"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";

import {
  loginSchema,
  toFieldErrors,
} from "@/lib/schemas/auth";

type Props = {
  onSuccess?: () => void;
};

const ORDER = ["email", "password"];

export function LoginForm({
  onSuccess,
}: Props) {
  const router = useRouter();

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [pending, setPending] = useState(false);

  async function onSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;

    const result = loginSchema.safeParse(
      Object.fromEntries(new FormData(form)),
    );

    if (!result.success) {
      const next = toFieldErrors(result.error);

      setErrors(next);

      const first = ORDER.find(
        (key) => key in next,
      );

      const element = first
        ? form.elements.namedItem(first)
        : null;

      if (element instanceof HTMLElement) {
        element.focus();
      }

      return;
    }

    setErrors({});
    setPending(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 800),
    );

    /*
     * Jika Login dipanggil dari AuthModal,
     * jangan pindah halaman.
     */
    if (onSuccess) {
      onSuccess();
      return;
    }

    /*
     * Jika Login digunakan sebagai halaman /masuk,
     * tetap gunakan behavior lama.
     */
    router.push("/studio");
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5"
    >
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
        className="w-full"
      >
        {pending ? (
          <>
            <Loader2
              className="size-4 animate-spin"
              aria-hidden="true"
            />
            Memproses…
          </>
        ) : (
          "Masuk"
        )}
      </Button>
    </form>
  );
}