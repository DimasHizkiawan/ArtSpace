// src/lib/search.ts
// Fungsi murni untuk pencarian: tanpa dependensi React, mudah diuji.

/** Huruf kecil, tanpa aksen, spasi berlebih dirapikan. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Kata kunci dari URL: dipotong, dibatasi panjangnya. */
export function cleanQuery(raw: string | undefined): string {
  return (raw ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
}

/** Ambil nilai pertama dari parameter URL yang bisa berupa array. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Cocok jika SETIAP kata dalam `query` ada di salah satu `fields`.
 * "poster hujan" menemukan "Editorial Poster Musim Hujan", dan
 * "alya kopi" menemukan karya Alya Putri berjudul Kopi Senja.
 * Query kosong cocok dengan semuanya.
 */
export function matchesQuery(fields: readonly string[], query: string): boolean {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalize(fields.join(" "));
  return terms.every((term) => haystack.includes(term));
}
