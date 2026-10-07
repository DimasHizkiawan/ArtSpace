import type { Project } from "@/types/project";

export type ProjectDetail = {
  story: string[];
  tools: string[];
  duration: string;
  role: string;
};

// DATA DUMMY: ganti dengan data asli saat backend siap.
const TOOL_SETS: ReadonlyArray<ReadonlyArray<string>> = [
  ["Figma", "Adobe Illustrator", "Procreate"],
  ["Adobe Photoshop", "Lightroom", "Capture One"],
  ["Blender", "Cinema 4D", "After Effects"],
  ["Procreate", "Clip Studio Paint", "Photoshop"],
];
const DURATIONS = ["6 hari", "2 minggu", "3 minggu", "1 bulan"];
const ROLES = ["Konsep & eksekusi", "Art direction", "Ilustrasi utama", "Desain visual"];

function seedOf(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getProjectDetail(project: Project, disciplineLabel: string): ProjectDetail {
  const seed = seedOf(project.slug);
  const topic = disciplineLabel.toLowerCase();

  return {
    story: [
      `“${project.title}” adalah karya ${topic} yang dikerjakan ${project.creatorName} pada ${project.year}. Karya ini berangkat dari keinginan untuk menangkap suasana sehari-hari dengan cara yang tenang namun tetap berkarakter.`,
      `Proses dimulai dari riset referensi dan sketsa kasar, lalu dipersempit ke satu arah visual yang konsisten. Palet warna dan komposisi dipilih agar karya tetap terbaca baik di layar kecil maupun saat dicetak.`,
      `Teks ini masih contoh. Deskripsi asli akan tampil di sini setelah kreator mengunggah karyanya.`,
    ],
    tools: [...(TOOL_SETS[seed % TOOL_SETS.length] ?? [])],
    duration: DURATIONS[seed % DURATIONS.length] ?? "2 minggu",
    role: ROLES[seed % ROLES.length] ?? "Konsep & eksekusi",
  };
}