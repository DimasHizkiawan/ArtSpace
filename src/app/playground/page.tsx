import type { Metadata } from "next";
import PlaygroundClient from "./playground-client";

export const metadata: Metadata = { title: "Pratinjau Karya Saya | ArtSpace" };

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
