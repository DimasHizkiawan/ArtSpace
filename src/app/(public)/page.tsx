import Link from "next/link";
import { ArrowRight, Compass, Search, Sparkles } from "lucide-react";
import { DisciplineFilter } from "@/components/projects/discipline-filter";
import { ProjectGrid } from "@/components/projects/project-grid";
import { EmptyState } from "@/components/feedback/empty-state";
import { isDiscipline } from "@/lib/constants";
import { getProjects } from "@/lib/data/repository";

type Props = { searchParams: Promise<{ disiplin?: string | string[] | undefined }> };

export default async function GalleryPage({ searchParams }: Props) {
  const { disiplin } = await searchParams;
  const raw = Array.isArray(disiplin) ? disiplin[0] : disiplin;
  const active = isDiscipline(raw) ? raw : undefined;
  const projects = await getProjects(active);

  return (
    <div className="space-y-12 pb-8 sm:space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-line bg-surface px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-iris/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 left-1/2 size-64 rounded-full bg-berry/10 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            <Sparkles className="size-3.5 text-berry" aria-hidden="true" /> Portofolio kreatif
          </div>
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Temukan karya yang membuatmu <span className="text-iris">berhenti sejenak.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Jelajahi portofolio desainer, ilustrator, fotografer, dan mahasiswa seni. Tidak perlu masuk untuk mulai menemukan inspirasi.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="#galeri" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-5 font-semibold text-canvas hover:opacity-90">
              Jelajahi karya <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/explore" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-canvas px-5 font-semibold hover:bg-surface">
              <Compass className="size-4" aria-hidden="true" /> Eksplorasi kreator
            </Link>
          </div>
        </div>
      </section>

      <section id="galeri" aria-labelledby="galeri-heading" className="scroll-mt-24 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">Discover</p>
            <h2 id="galeri-heading" className="mt-1 font-display text-3xl">Karya pilihan</h2>
            <p className="mt-1 text-sm text-muted">Lihat-lihat dulu. Login hanya saat kamu ingin berinteraksi.</p>
          </div>
          <Link href="/explore" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-iris hover:underline">
            Lihat semua <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-muted">
          <Search className="size-4" aria-hidden="true" />
          <span className="sr-only">Pencarian:</span>
          <span>Filter berdasarkan disiplin untuk mempersempit galeri</span>
        </div>
        <DisciplineFilter active={active} />
        {projects.length === 0 ? (
          <EmptyState title="Belum ada karya" description="Belum ada karya pada disiplin ini. Coba disiplin lain atau tampilkan semua." actionHref="/" actionLabel="Tampilkan semua" />
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </section>
    </div>
  );
}
