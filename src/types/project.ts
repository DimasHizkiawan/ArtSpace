// src/types/project.ts
import type { Discipline } from "@/lib/constants";

export type Tone = "iris" | "cobalt" | "berry";
export type Shape = "circles" | "bars" | "arc";

export type ProjectCover = {
  src: string;
  alt: string;
  width: number;  // ukuran asli file, dalam piksel
  height: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  creatorName: string;
  creatorUsername: string;
  discipline: Discipline;
  year: number;
  likes: number;
  tone: Tone;
  shape: Shape;
  cover?: ProjectCover | undefined;
};