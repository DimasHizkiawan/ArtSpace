// src/app/(auth)/daftar/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Daftar | ArtSpace" };

export default function SignupPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-berry">SIGN UP</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">Start to publish</h1>
      <p className="mt-2 text-muted">Sign up for free, upload your first art.</p>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-8 text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-semibold text-iris underline underline-offset-4">
          Masuk
        </Link>
      </p>
    </>
  );
}