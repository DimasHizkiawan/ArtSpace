// src/app/(public)/profil/page.tsx
import type { Metadata } from "next";
import { ProfileScreen } from "@/components/profile/profile-editor";

export const metadata: Metadata = { title: "Profil | ArtSpace" };

export default function ProfilePage() {
  return <ProfileScreen />;
}