// Gaya bersama untuk semua card (karya & kreator) supaya selalu konsisten.

/** Grid yang sama untuk daftar karya maupun kreator. */
export const cardGrid = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

/** Kulit card. */
export const cardBase =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-canvas transition duration-200 hover:-translate-y-1 hover:border-ink hover:shadow-xl";

/** Isi card di bawah media. */
export const cardBody = "flex flex-1 flex-col gap-3 p-4";

/** Label kecil di atas judul. */
export const cardMeta = "text-xs font-semibold uppercase tracking-widest text-muted";

/** Judul card. */
export const cardTitle = "font-display text-xl leading-tight";

/** Baris bawah card, selalu menempel di dasar. */
export const cardFooter =
  "mt-auto flex min-h-10 items-center justify-between border-t border-line pt-3 text-sm";

/**
 * Pasang pada <Link> utama. Pseudo-element membuat SELURUH card bisa diklik.
 * Elemen interaktif lain di dalam card harus diberi `relative z-10`.
 */
export const cardLink =
  "after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-cobalt";