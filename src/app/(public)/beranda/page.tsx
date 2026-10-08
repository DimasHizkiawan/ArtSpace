// src/app/(public)/beranda/page.tsx
import type { Metadata } from "next";
import { MemberHome } from "@/components/home/member-home";
import { getProjects } from "@/lib/data/repository";

export const metadata: Metadata = { title: "Beranda | ArtSpace" };

export default async function BerandaPage() {
  const projects = await getProjects();
  return <MemberHome serverProjects={projects} />;
}