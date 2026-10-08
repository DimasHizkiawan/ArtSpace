import Link from "next/link";
import { DISCIPLINES } from "@/lib/constants";

type FooterLink = { href: string; label: string };

const EXPLORE_LINKS: readonly FooterLink[] = [
  { href: "/", label: "Galeri" },
  { href: "/explore", label: "Eksplorasi" },
  { href: "/contact", label: "Kolaborasi" },
];

const DISCIPLINE_LINKS: readonly FooterLink[] = DISCIPLINES.map((d) => ({
  href: `/?disiplin=${d.value}#galeri`,
  label: d.label,
}));

const CREATOR_LINKS: readonly FooterLink[] = [
  { href: "/studio/projects/new", label: "Buat proyek" },
  { href: "/daftar", label: "Daftar gratis" },
  { href: "/masuk", label: "Masuk" },
];

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 transition hover:text-ink hover:underline";

function FooterColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  const id = `footer-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">
        {title}
      </h2>
      <ul className="mt-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-line bg-surface sm:mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl">
              <span aria-hidden="true" className="size-3 rounded-full bg-berry" />
              ArtSpace
            </Link>
            <p className="text-sm leading-6 text-muted">
              Ruang yang menonjolkan karya tanpa gangguan visual. Susun portofolio, temukan
              kreator, dan terima peluang kolaborasi.
            </p>
          </div>

          <FooterColumn title="Jelajahi" links={EXPLORE_LINKS} />
          <FooterColumn title="Disiplin" links={DISCIPLINE_LINKS} />
          <FooterColumn title="Untuk kreator" links={CREATOR_LINKS} />
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ArtSpace. Prototipe tugas mahasiswa.</p>
          <p>Portofolio kreatif untuk desainer, ilustrator, fotografer, dan seniman.</p>
        </div>
      </div>
    </footer>
  );
}