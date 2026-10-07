// src/components/projects/project-grid.tsx
import type { Project } from "@/types/project";
import { ProjectCard } from "./project-card";

export const gridClass =
  "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className={gridClass}>
      {projects.map((p) => (
        <li key={p.id}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  );
}