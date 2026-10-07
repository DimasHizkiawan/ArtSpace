import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import { CoverArt } from "./cover-art";

type Props = {
  project: Project;
  className?: string;
  /** true = tampil utuh sesuai rasio asli (halaman detail). Bawaan: dipotong 4:3 untuk grid. */
  natural?: boolean;
  /** Beri true untuk gambar utama di atas lipatan layar. */
  priority?: boolean;
  sizes?: string;
};

export function ProjectCover({
  project,
  className = "",
  natural = false,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: Props) {
  const { cover } = project;

  if (!cover) {
    return <CoverArt tone={project.tone} shape={project.shape} className={className} />;
  }

  return (
    <Image
      src={cover.src}
      alt={cover.alt}
      width={cover.width}
      height={cover.height}
      sizes={sizes}
      priority={priority}
      className={cn(
        "w-full",
        natural ? "h-auto" : "aspect-[4/3] object-cover",
        className,
      )}
    />
  );
}