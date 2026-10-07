// src/app/(auth)/masuk/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Masuk | ArtSpace" };

export default function LoginPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-berry">Login</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">Welcome back.</h1>   
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-8 text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-iris underline underline-offset-4">
          Daftar
        </Link>
      </p>
    </>
  );
}