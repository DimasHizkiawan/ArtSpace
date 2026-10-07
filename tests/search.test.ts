import { describe, expect, it } from "vitest";
import { cleanQuery, firstParam, matchesQuery, normalize } from "../src/lib/search";

describe("normalize", () => {
  it("menurunkan huruf, membuang aksen, dan merapikan spasi", () => {
    expect(normalize("  Café   POSTER ")).toBe("cafe poster");
  });
});

describe("matchesQuery", () => {
  const fields = ["Editorial Poster Musim Hujan", "Raka Pratama", "Desain"];

  it("query kosong cocok dengan semua", () => {
    expect(matchesQuery(fields, "")).toBe(true);
    expect(matchesQuery(fields, "   ")).toBe(true);
  });
  it("tidak peduli huruf besar-kecil", () => {
    expect(matchesQuery(fields, "POSTER")).toBe(true);
  });
  it("semua kata harus ada, urutan bebas", () => {
    expect(matchesQuery(fields, "hujan poster")).toBe(true);
    expect(matchesQuery(fields, "poster raka")).toBe(true);
    expect(matchesQuery(fields, "poster foto")).toBe(false);
  });
  it("cocok sebagian kata", () => {
    expect(matchesQuery(fields, "prat")).toBe(true);
  });
});

describe("cleanQuery & firstParam", () => {
  it("memangkas dan membatasi 80 karakter", () => {
    expect(cleanQuery("  a   b ")).toBe("a b");
    expect(cleanQuery(undefined)).toBe("");
    expect(cleanQuery("x".repeat(200))).toHaveLength(80);
  });
  it("mengambil nilai pertama dari array", () => {
    expect(firstParam(["a", "b"])).toBe("a");
    expect(firstParam("a")).toBe("a");
    expect(firstParam(undefined)).toBeUndefined();
  });
});
