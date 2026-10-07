import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { DisciplineFilter } from "@/components/projects/discipline-filter";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SearchBar } from "@/components/search/search-bar";
import { EmptyState } from "@/components/feedback/empty-state";
import { isDiscipline } from "@/lib/constants";
import { searchProjects } from "@/lib/data/repository";
import { cleanQuery, firstParam } from "@/lib/search";

type Props = {
  searchParams: Promise<{
    disiplin?: string | string[] | undefined;
    q?: string | string[] | undefined;
  }>;
};

export default async function GalleryPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = cleanQuery(firstParam(params.q));
  const raw = firstParam(params.disiplin);
  const active = isDiscipline(raw) ? raw : undefined;
  const projects = await searchProjects({ q, discipline: active });

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
        <SearchBar
          basePath="/"
          q={q}
          disiplin={active}
          label="Cari karya atau kreator"
          placeholder="Cari judul, kreator, atau disiplin"
        />
        <DisciplineFilter active={active} />
        <p role="status" className="text-sm text-muted">
          {q ? `${projects.length} karya untuk “${q}”` : `${projects.length} karya`}
        </p>
        {projects.length === 0 ? (
          <EmptyState
            title={q ? "Karya tidak ditemukan" : "Belum ada karya"}
            description={
              q
                ? `Tidak ada karya yang cocok dengan “${q}”. Coba kata kunci lain, atau lihat kreator di Eksplorasi.`
                : "Belum ada karya pada disiplin ini. Coba disiplin lain atau tampilkan semua."
            }
            actionHref="/"
            actionLabel={q ? "Hapus pencarian" : "Tampilkan semua"}
          />
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </section>
    </div>
  );
}
