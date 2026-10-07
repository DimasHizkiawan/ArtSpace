// src/lib/data/mock-projects.ts
import type { Project } from "@/types/project";

export const MOCK_PROJECTS: Project[] = [
  { id: "1", slug: "brand-identity-kopi-senja", title: "Brand Identity Kopi Senja", creatorName: "Alya Putri", creatorUsername: "alyaputri", discipline: "desain", year: 2026, likes: 128, tone: "iris", shape: "circles", 
    cover: {  src: "/images/kopi.jpg",
  alt: "Ilustrasi cangkir kopi di meja kayu saat senja",
  width: 1600,
  height: 1200,}  },
  { id: "2", slug: "editorial-poster-musim-hujan", title: "Editorial Poster Musim Hujan", creatorName: "Raka Pratama", creatorUsername: "rakap", discipline: "desain", year: 2026, likes: 94, tone: "berry", shape: "arc"
    ,cover: {  src: "/images/rain.jpg",
  alt: "-",
  width: 1600,
  height: 1200,} },
  { id: "3", slug: "3d-experiment-bunga-kristal", title: "3D Experiment: Bunga Kristal", creatorName: "Nadia Safira", creatorUsername: "nadias", discipline: "seni", year: 2025, likes: 211, tone: "cobalt", shape: "bars"
     ,cover: {  src: "/images/crystal.jpg",
  alt: "-",
  width: 1600,
  height: 1200,}
  },
  { id: "4", slug: "ilustrasi-pasar-pagi", title: "Ilustrasi Pasar Pagi", creatorName: "Bima Aditya", creatorUsername: "bimaa", discipline: "ilustrasi", year: 2026, likes: 76, tone: "iris", shape: "arc"
     ,cover: {  src: "/images/market.jpg",
  alt: "-",
  width: 1600,
  height: 1200,}
   },
  { id: "5", slug: "seri-foto-jalanan-semarang", title: "Seri Foto Jalanan Semarang", creatorName: "Sari Wulandari", creatorUsername: "sariw", discipline: "fotografi", year: 2025, likes: 163, tone: "cobalt", shape: "circles"
     ,cover: {  src: "/images/city.jpg",
  alt: "-",
  width: 1600,
  height: 1200,}
   },
  { id: "6", slug: "karakter-maskot-nusa", title: "Karakter Maskot Nusa", creatorName: "Dewi Anggraini", creatorUsername: "dewia", discipline: "ilustrasi", year: 2026, likes: 87, tone: "berry", shape: "bars"
     ,cover: {  src: "/images/char.jpg",
  alt: "-",
  width: 1600,
  height: 1200,}
   },
];