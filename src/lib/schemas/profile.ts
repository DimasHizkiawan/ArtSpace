// src/lib/schemas/profile.ts
import { z } from "zod";
import { isDiscipline } from "@/lib/constants";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(40, "Nama maksimal 40 karakter."),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,20}$/, "Username 3 sampai 20 karakter: huruf kecil, angka, atau garis bawah."),
  discipline: z.string().refine((v) => isDiscipline(v), "Pilih disiplin utamamu."),
  location: z.string().trim().max(40, "Lokasi maksimal 40 karakter."),
  bio: z.string().trim().max(240, "Bio maksimal 240 karakter."),
});