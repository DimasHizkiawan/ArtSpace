import { cardGrid } from "@/components/ui/card-styles";
import type { Project } from "@/types/project";
import { ProjectCard } from "./project-card";

/** Dipakai juga oleh loading.tsx supaya skeleton punya grid yang sama dengan hasil asli. */
export const gridClass = cardGrid;

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className={gridClass}>
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}