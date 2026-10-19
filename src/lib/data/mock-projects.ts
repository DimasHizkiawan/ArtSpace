// src/lib/data/mock-projects.ts
import type { Project } from "@/types/project";

export const MOCK_PROJECTS: Project[] = [
  { id: "1", slug: "brand-identity-kopi-senja", title: "Brand Identity Kopi Senja", creatorName: "Adik Christian", creatorUsername: "chrss", discipline: "desain", year: 2026, likes: 128, tone: "iris", shape: "circles", 
    cover: {  src: "/images/kopi.jpg",
  alt: "Ilustrasi cangkir kopi di meja kayu saat senja",
  width: 1600,
  height: 1200,}  },
  { id: "2", slug: "editorial-poster-musim-hujan", title: "Editorial Poster Musim Hujan", creatorName: "Indragiri Bhakti", creatorUsername: "indragb", discipline: "desain", year: 2026, likes: 94, tone: "berry", shape: "arc"
    ,cover: {  src: "/images/rain.jpg",
  alt: "-",
  width: 1600,
  height: 1200,} },
  { id: "3", slug: "3d-experiment-bunga-kristal", title: "3D Experiment: Bunga Kristal", creatorName: "Firdhan Abivandya", creatorUsername: "frdvn", discipline: "seni", year: 2025, likes: 211, tone: "cobalt", shape: "bars"
     ,cover: {  src: "/images/crystal.jpg",
  alt: "-",
  width: 1600,
  height: 1200,}
  },
  { id: "4", slug: "ilustrasi-pasar-pagi", title: "Ilustrasi Pasar Pagi", creatorName: "Timothy Widiawan", creatorUsername: "timmyqt", discipline: "ilustrasi", year: 2026, likes: 76, tone: "iris", shape: "arc"
     ,cover: {  src: "/images/market.jpg",
  alt: "-",
  width: 1600,
  height: 1200,}
   },
  { id: "5", slug: "seri-foto-jalanan-semarang", title: "Seri Foto Jalanan Semarang", creatorName: "Jedidia Mozes", creatorUsername: "motzy", discipline: "fotografi", year: 2025, likes: 163, tone: "cobalt", shape: "circles"
     ,cover: {  src: "/images/city.jpg",
  alt: "-",
  width: 1600,
  height: 1200,}
   },
  { id: "6", slug: "karakter-maskot-nusa", title: "Karakter Maskot Nusa", creatorName: "Hizkia Evan", creatorUsername: "hizzz", discipline: "ilustrasi", year: 2026, likes: 87, tone: "berry", shape: "bars"
     ,cover: {  src: "/images/char.jpg",
  alt: "-",
  width: 1600,
  height: 1200,}
   },
     { id: "7", slug: "kastil-estetik-cerah", title: "Kastil Bernuansa Cerah", creatorName: "Hizkia Evan", creatorUsername: "hizzz", discipline: "desain", year: 2025, likes: 204, tone: "berry", shape: "arc"
    ,cover: {  src: "/images/castle.jpg",
  alt: "-",
  width: 1600,
  height: 1200,} },
  { id: "8", slug: "pagi-hari", title: "Pagi Hari yang Cerah", creatorName: "Hizkia Evan", creatorUsername: "hizzz", discipline: "ilustrasi", year: 2024, likes: 95, tone: "berry", shape: "bars"
     ,cover: {  src: "/images/pagi.jpg",
  alt: "-",
  width: 1600,
  height: 1200,}
   },
];