import { DISCIPLINES, type Discipline } from "@/lib/constants";
import { matchesQuery } from "@/lib/search";
import type { Project } from "@/types/project";
import type { Creator } from "@/types/creator";
import { MOCK_PROJECTS } from "./mock-projects";
import { MOCK_CREATORS } from "./mock-creators";

export async function getProjects(discipline?: Discipline): Promise<Project[]> {
  if (!discipline) return MOCK_PROJECTS;
  return MOCK_PROJECTS.filter((p) => p.discipline === discipline);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return MOCK_PROJECTS.find((project) => project.slug === slug);
}

export async function getCreatorByUsername(username: string): Promise<Creator | undefined> {
  return MOCK_CREATORS.find((creator) => creator.username === username);
}

export async function getProjectsByCreator(username: string): Promise<Project[]> {
  return MOCK_PROJECTS.filter((project) => project.creatorUsername === username);
}

type SearchParams = {
  q?: string | undefined;
  discipline?: Discipline | undefined;
};

function disciplineLabel(value: Discipline): string {
  return DISCIPLINES.find((d) => d.value === value)?.label ?? value;
}

export async function searchProjects({ q = "", discipline }: SearchParams): Promise<Project[]> {
  return MOCK_PROJECTS.filter((p) => {
    if (discipline && p.discipline !== discipline) return false;
    return matchesQuery(
      [p.title, p.creatorName, p.creatorUsername, disciplineLabel(p.discipline), String(p.year)],
      q,
    );
  });
}

// Creator belum punya disiplin sendiri, jadi filter disiplin memakai
// karya mereka: kreator tampil jika punya minimal satu karya di disiplin itu.
export async function searchCreators({ q = "", discipline }: SearchParams): Promise<Creator[]> {
  return MOCK_CREATORS.filter((c) => {
    if (
      discipline &&
      !MOCK_PROJECTS.some((p) => p.creatorUsername === c.username && p.discipline === discipline)
    ) {
      return false;
    }
    // Nama disiplin dari karya mereka ikut dicari, jadi "ilustrasi" menemukan para ilustrator.
    const disciplines = MOCK_PROJECTS.filter((p) => p.creatorUsername === c.username).map((p) =>
      disciplineLabel(p.discipline),
    );
    return matchesQuery([c.name, c.username, c.bio, ...disciplines], q);
  });
}
