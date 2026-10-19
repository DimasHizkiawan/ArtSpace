import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { ProjectShelf } from "@/components/projects/project-shelf";
import { DISCIPLINES, type Discipline } from "@/lib/constants";
import { getProjects } from "@/lib/data/repository";

const SHELF_COPY: Record<Discipline, string> = {
  desain: "Identitas visual, poster, dan layout.",
  ilustrasi: "Karakter, suasana, dan cerita bergambar.",
  fotografi: "Cerita kecil dari ruang kota dan sekitarnya.",
  seni: "Bentuk, material, dan eksperimen visual.",
};

export default async function GalleryPage() {
  const projects = await getProjects();
  const shelves = DISCIPLINES.map((d) => ({
    ...d,
    projects: projects.filter((p) => p.discipline === d.value),
  })).filter((shelf) => shelf.projects.length > 0);

  return (
    <div className="space-y-12 pb-8 sm:space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-line bg-surface px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-iris/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 left-1/2 size-64 rounded-full bg-berry/10 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Temukan karya yang membuatmu <span className="text-iris">berhenti sejenak.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Jelajahi portofolio desainer, ilustrator, fotografer, dan mahasiswa seni. Tidak perlu masuk untuk mulai menemukan inspirasi.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="#galeri" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-5 font-semibold text-canvas hover:opacity-90">
              Lihat galeri <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/explore" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-canvas px-5 font-semibold hover:bg-surface">
              <Compass className="size-4" aria-hidden="true" /> Cari di Eksplorasi
            </Link>
          </div>
        </div>
      </section>

      <section id="galeri" aria-labelledby="galeri-heading" className="scroll-mt-24 space-y-10">
        {/* <div>
          <h2 id="galeri-heading" className="font-display text-4xl">
            Karya pilihan
          </h2>
        </div> */}

        {shelves.map((shelf) => (
          <ProjectShelf
            key={shelf.value}
            id={`rak-${shelf.value}`}
            title={shelf.label}
            description={SHELF_COPY[shelf.value]}
            href={`/explore?disiplin=${shelf.value}`}
            projects={shelf.projects}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-line bg-canvas p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-display text-3xl">Mencari sesuatu yang spesifik?</h2>
          <p className="mt-1 text-sm text-muted">
            Cari berdasarkan judul, nama kreator, atau disiplin, dan temukan kreator baru.
          </p>
        </div>
        <Link
          href="/explore"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-5 font-semibold text-canvas hover:opacity-90"
        >
          Buka Eksplorasi <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}