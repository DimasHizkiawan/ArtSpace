"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";

import {
  signupSchema,
  toFieldErrors,
} from "@/lib/schemas/auth";

type Props = {
  onSuccess?: () => void;
};

const ORDER = [
  "name",
  "email",
  "discipline",
  "password",
  "confirm",
];

export function SignupForm({
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

    const result = signupSchema.safeParse(
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
     * Jika Signup digunakan di AuthModal,
     * modal ditutup setelah berhasil.
     */
    if (onSuccess) {
      onSuccess();
      return;
    }

    /*
     * Jika Signup digunakan sebagai halaman /daftar,
     * tetap menuju halaman studio.
     */
    router.push("/studio/projects/new");
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5"
    >
      <Field
        label="Nama lengkap"
        name="name"
        autoComplete="name"
        error={errors.name}
      />

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        error={errors.email}
      />

      <div>
        <label
          htmlFor="discipline"
          className="mb-2 block text-sm font-semibold"
        >
          Disiplin utama
        </label>

        <select
          id="discipline"
          name="discipline"
          defaultValue=""
          className="min-h-11 w-full rounded-md border border-line bg-canvas px-3 text-sm"
          aria-invalid={Boolean(errors.discipline)}
        >
          <option value="" disabled>
            Pilih disiplin
          </option>

          <option value="desain">
            Desain
          </option>

          <option value="ilustrasi">
            Ilustrasi
          </option>

          <option value="fotografi">
            Fotografi
          </option>

          <option value="seni">
            Seni rupa
          </option>
        </select>

        {errors.discipline ? (
          <p className="mt-1 text-sm text-berry">
            {errors.discipline}
          </p>
        ) : null}
      </div>

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
        className="w-full"
      >
        {pending ? (
          <>
            <Loader2
              className="size-4 animate-spin"
              aria-hidden="true"
            />
            Membuat akun…
          </>
        ) : (
          "Buat akun"
        )}
      </Button>
    </form>
  );
}