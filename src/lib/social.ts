// src/lib/social.ts
// Tautan sosial di profil. Fungsi murni, tanpa React.

export const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "x", label: "X (Twitter)" },
  { value: "website", label: "Situs web" },
] as const;

export type SocialLink = { platform: string; url: string };

export const MAX_LINKS = 6;

/**
 * Merapikan tautan yang diketik pengguna. "instagram.com/nama" -> "https://instagram.com/nama".
 * Mengembalikan null jika tidak aman atau tidak valid (hanya http/https yang diterima,
 * jadi "javascript:..." ditolak).
 */
export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password) return null;
  if (!url.hostname.includes(".")) return null;
  return url.href;
}

/** Baris kosong diabaikan. Galat dikembalikan per nomor baris. */
export function validateLinks(rows: readonly SocialLink[]): {
  links: SocialLink[];
  errors: Record<number, string>;
} {
  const links: SocialLink[] = [];
  const errors: Record<number, string> = {};
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    if (!row.url.trim()) return;
    const href = normalizeUrl(row.url);
    if (!href) {
      errors[index] = "Tautan tidak valid. Contoh: instagram.com/namamu";
      return;
    }
    if (seen.has(href)) {
      errors[index] = "Tautan ini sudah ada di daftar.";
      return;
    }
    seen.add(href);
    const known = SOCIAL_PLATFORMS.some((p) => p.value === row.platform);
    links.push({ platform: known ? row.platform : "website", url: href });
  });

  if (links.length > MAX_LINKS) {
    errors[rows.length - 1] = `Maksimal ${MAX_LINKS} tautan.`;
  }
  return { links, errors };
}

/** Teks tautan: nama platform, atau nama situs untuk "Situs web". */
export function linkLabel(link: SocialLink): string {
  const platform = SOCIAL_PLATFORMS.find((p) => p.value === link.platform);
  if (platform && platform.value !== "website") return platform.label;
  try {
    return new URL(link.url).hostname.replace(/^www\./, "");
  } catch {
    return "Situs web";
  }
}