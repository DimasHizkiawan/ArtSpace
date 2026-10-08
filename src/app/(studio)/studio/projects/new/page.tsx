// src/app/(studio)/studio/projects/new/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UploadForm } from "@/components/studio/upload-form";

export const metadata: Metadata = { title: "Unggah karya | ArtSpace" };

export default function NewProjectPage() {
  return (
    <div className="space-y-8 pb-8">
      <Link
        href="/beranda"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke beranda
      </Link>
      <header className="space-y-2">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">Unggah karya</h1>
        <p className="text-muted">
          Karya yang kamu unggah tampil di beranda dan bisa disukai, disimpan, dan dikomentari.
        </p>
      </header>
      <UploadForm />
    </div>
  );
}