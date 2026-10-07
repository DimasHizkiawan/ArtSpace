import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bookmark, Heart, MessageCircle } from "lucide-react";
import { getProjectBySlug } from "@/lib/data/repository";
import { DISCIPLINES } from "@/lib/constants";
import { CoverArt } from "@/components/projects/cover-art";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const label = DISCIPLINES.find((item) => item.value === project.discipline)?.label;

  return (
    <article className="mx-auto max-w-5xl space-y-8 pb-10">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke galeri
      </Link>
      <div className="overflow-hidden rounded-[2rem] border border-line bg-canvas">
        <CoverArt tone={project.tone} shape={project.shape} className="aspect-[16/9]" />
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">{label} · {project.year}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{project.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Studi kasus ini menampilkan proses kreatif, keputusan visual, dan hasil akhir dari karya yang dipublikasikan di ArtSpace.
            </p>
            <Link href={`/creators/${project.creatorUsername}`} className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold hover:text-iris">
              Oleh {project.creatorName} →
            </Link>
          </div>
          <div className="flex items-start gap-2 lg:flex-col">
            <button className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-line" aria-label="Sukai karya"><Heart className="size-5 text-berry" /></button>
            <button className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-line" aria-label="Simpan karya"><Bookmark className="size-5" /></button>
            <button className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-line" aria-label="Komentar"><MessageCircle className="size-5" /></button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Tentang proyek</p>
        <p className="mt-3 max-w-3xl leading-7">Proyek ini merupakan contoh data dummy untuk prototipe frontend ArtSpace. Struktur halaman sudah disiapkan agar bagian cerita dapat dikembangkan menjadi editor studi kasus.</p>
      </div>
    </article>
  );
}
