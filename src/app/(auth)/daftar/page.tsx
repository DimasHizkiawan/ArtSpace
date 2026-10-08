// src/app/(auth)/daftar/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Daftar | ArtSpace" };

export default function SignupPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">SIGN UP</p>
      <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight">
        Mulai <span className="text-iris">publikasikan karyamu.</span>
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Daftar gratis, susun portofolio pertamamu, dan terima peluang kolaborasi.
      </p>

      <div className="mt-7">
        <SignupForm />
      </div>

      <p className="mt-7 border-t border-line pt-5 text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-semibold text-iris underline underline-offset-4">
          Masuk
        </Link>
      </p>
    </>
  );
}