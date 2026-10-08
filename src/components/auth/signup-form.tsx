"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { SelectField } from "@/components/ui/select-field";
import { DISCIPLINES } from "@/lib/constants";
import { signUp } from "@/lib/local/auth";
import { signupSchema, toFieldErrors } from "@/lib/schemas/auth";

type Props = {
  onSuccess?: () => void;
};

const ORDER = ["name", "email", "discipline", "password", "confirm"];

export function SignupForm({ onSuccess }: Props) {
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

    const result = signupSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) {
      const next = toFieldErrors(result.error);
      setErrors(next);
      const first = ORDER.find((key) => key in next);
      if (first) focusField(form, first);
      return;
    }

    setErrors({});
    setPending(true);

    const auth = await signUp({
      name: result.data.name,
      email: result.data.email,
      discipline: result.data.discipline,
      password: result.data.password,
    });
    if (!auth.ok) {
      setPending(false);
      setErrors({ [auth.field]: auth.message });
      focusField(form, auth.field);
      return;
    }

    // Di AuthModal: modal ditutup setelah berhasil.
    if (onSuccess) {
      onSuccess();
      return;
    }
    // Di halaman /daftar: lanjut ke beranda.
    router.push("/beranda");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Nama lengkap" name="name" autoComplete="name" error={errors.name} />

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        error={errors.email}
      />

      <SelectField
        label="Disiplin utama"
        name="discipline"
        options={DISCIPLINES}
        placeholder="Pilih disiplin"
        defaultValue=""
        error={errors.discipline}
      />

      <PasswordField
        label="Kata sandi"
        name="password"
        autoComplete="new-password"
        hint="Minimal 8 karakter."
        error={errors.password}
      />

      <PasswordField
        label="Ulangi kata sandi"
        name="confirm"
        autoComplete="new-password"
        error={errors.confirm}
      />

      <Button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-ink text-canvas hover:opacity-90 hover:brightness-100"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Membuat akun…
          </>
        ) : (
          "Buat akun"
        )}
      </Button>
    </form>
  );
}