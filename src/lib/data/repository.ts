import type { Discipline } from "@/lib/constants";
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
