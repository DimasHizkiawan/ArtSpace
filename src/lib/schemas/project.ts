// src/lib/schemas/project.ts
import { z } from "zod";
import { isDiscipline } from "@/lib/constants";

export const uploadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(80, "Judul maksimal 80 karakter."),
  discipline: z.string().refine((v) => isDiscipline(v), "Pilih disiplin karya ini."),
  description: z
    .string()
    .trim()
    .min(10, "Ceritakan karyamu minimal 10 karakter.")
    .max(1000, "Deskripsi maksimal 1000 karakter."),
});

export const commentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Komentar tidak boleh kosong.")
    .max(500, "Komentar maksimal 500 karakter."),
});