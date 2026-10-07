// src/lib/schemas/auth.ts
import { z } from "zod";

const email = z
  .string()
  .min(1, "Email wajib diisi.")
  .email("Format email tidak valid, contoh: nama@email.com.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Nama lengkap minimal 2 karakter."),
    email,
    discipline: z.string().min(1, "Pilih disiplin utamamu."),
    password: z.string().min(8, "Kata sandi minimal 8 karakter."),
    confirm: z.string().min(1, "Ulangi kata sandimu."),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Kata sandi tidak sama.",
    path: ["confirm"],
  });

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !(key in out)) out[key] = issue.message;
  }
  return out;
}