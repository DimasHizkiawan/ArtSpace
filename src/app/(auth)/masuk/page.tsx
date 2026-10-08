// src/app/(auth)/masuk/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Masuk | ArtSpace" };

export default function LoginPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">Masuk</p>
      <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight">
        Selamat datang <span className="text-iris">kembali.</span>
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Masuk untuk menyukai dan menyimpan karya, serta mengelola portofoliomu.
      </p>

      <div className="mt-7">
        <LoginForm />
      </div>

      <p className="mt-7 border-t border-line pt-5 text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-iris underline underline-offset-4">
          Daftar gratis
        </Link>
      </p>
    </>
  );
}