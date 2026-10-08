// src/components/studio/upload-form.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { controlStyles, Field, FieldMessage } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { DISCIPLINES, type Discipline } from "@/lib/constants";
import { processImage, type ProcessedImage } from "@/lib/local/image";
import { useAuth } from "@/lib/local/auth";
import { addLocalProject } from "@/lib/local/projects";
import { toFieldErrors } from "@/lib/schemas/auth";
import { uploadSchema } from "@/lib/schemas/project";
import { cn } from "@/lib/utils";

const ORDER = ["title", "discipline", "description", "image"];

export function UploadForm() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const imageInput = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  async function onPickImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      setImage(await processImage(file));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    } catch (e) {
      setImage(null);
      setErrors((prev) => ({
        ...prev,
        image: e instanceof Error ? e.message : "Gambar tidak bisa diproses.",
      }));
    } finally {
      setProcessing(false);
    }
  }

  function focusField(form: HTMLFormElement, name: string) {
    if (name === "image") {
      imageInput.current?.focus();
      return;
    }
    const element = form.elements.namedItem(name);
    if (element instanceof HTMLElement) element.focus();
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const result = uploadSchema.safeParse(Object.fromEntries(new FormData(form)));
    const next = result.success ? {} : toFieldErrors(result.error);
    if (!image) next.image = "Pilih gambar karya terlebih dahulu.";
    if (processing) next.image = "Gambar masih diproses, tunggu sebentar.";

    if (!result.success || !image || processing) {
      setErrors(next);
      const first = ORDER.find((k) => k in next);
      if (first) focusField(form, first);
      return;
    }

    setErrors({});
    setSaving(true);
    const saved = addLocalProject({
      title: result.data.title,
      description: result.data.description,
      discipline: result.data.discipline as Discipline,
      image: image.dataUrl,
      width: image.width,
      height: image.height,
    });

    if (!saved.ok) {
      setSaving(false);
      setErrors({ image: saved.message });
      focusField(form, "image");
      return;
    }
    router.push(`/projects/${saved.project.slug}`);
  }

  if (!ready) {
    return <div aria-busy="true" aria-label="Memuat form" className="h-64 animate-pulse rounded-2xl bg-surface" />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-line bg-surface p-6">
        <p className="text-muted">Masuk dulu untuk mengunggah karya.</p>
        <Button type="button" onClick={() => setAuthOpen(true)}>
          Masuk atau daftar
        </Button>
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          title="Masuk untuk mengunggah karya"
        />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="space-y-1.5">
        <span id="image-label" className="text-sm font-medium">
          Gambar karya
        </span>
        <input
          ref={imageInput}
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={onPickImage}
          aria-labelledby="image-label"
          aria-invalid={errors.image ? true : undefined}
          aria-describedby="image-pesan"
          className="peer sr-only"
        />
        <label
          htmlFor="image"
          className={cn(
            "flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed px-4 text-center peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt",
            errors.image ? "border-berry" : "border-line hover:border-ink",
          )}
        >
          {processing ? (
            <>
              <Loader2 className="size-6 animate-spin text-iris" aria-hidden="true" />
              <span className="text-sm text-muted">Memproses gambar…</span>
            </>
          ) : image ? (
            <>
              <Image
                src={image.dataUrl}
                alt="Pratinjau gambar karya"
                width={image.width}
                height={image.height}
                unoptimized
                className="h-auto max-h-80 w-auto max-w-full object-contain"
              />
              <span className="py-2 text-sm font-medium text-iris">Ganti gambar</span>
            </>
          ) : (
            <>
              <ImagePlus className="size-6 text-iris" aria-hidden="true" />
              <span className="font-medium">Pilih gambar karya</span>
              <span className="text-sm text-muted">JPG, PNG, atau WebP. Maksimal 10 MB.</span>
            </>
          )}
        </label>
        <FieldMessage
          id="image-pesan"
          error={errors.image}
          hint="Gambar diperkecil otomatis agar muat di penyimpanan browser."
        />
      </div>

      <Field label="Judul karya" name="title" maxLength={80} error={errors.title} />

      <SelectField
        label="Disiplin"
        name="discipline"
        options={DISCIPLINES}
        placeholder="Pilih disiplin"
        defaultValue=""
        error={errors.discipline}
      />

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Cerita di balik karya
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={1000}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby="description-pesan"
          className={controlStyles(Boolean(errors.description), "py-2.5")}
        />
        <FieldMessage
          id="description-pesan"
          error={errors.description}
          hint="Proses, alat, atau inspirasi. Tampil di halaman karya."
        />
      </div>

      <Button type="submit" disabled={saving || processing} className="w-full sm:w-auto">
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Menyimpan…
          </>
        ) : (
          "Publikasikan karya"
        )}
      </Button>
    </form>
  );
}