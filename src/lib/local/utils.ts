// src/lib/local/utils.ts
export function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** "Poster Hujan!" -> "poster-hujan". Pakai separator "" untuk "posterhujan". */
export function slugify(text: string, separator = "-"): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-/g, separator);
}