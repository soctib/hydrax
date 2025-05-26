import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ProjectMeta = {
  id: string;
  name: string;
  created: string;
  graph?: unknown;
};

export type ProjectsState = {
  projects: ProjectMeta[];
};

export function createProjectsSlice(initialProjects: ProjectMeta[]) {
  return createSlice({
    name: 'projects',
    initialState: { projects: initialProjects },
    reducers: {
      setProjects(state, action: PayloadAction<ProjectMeta[]>) {
        state.projects = action.payload;
      },
    },
  });
}

export const PROJECT_PREFIX = 'hydrax.project.';

export function listProjects(): ProjectMeta[] {
  const projects: ProjectMeta[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PROJECT_PREFIX)) {
      try {
        const meta = JSON.parse(localStorage.getItem(key) || '{}');
        if (meta && meta.id && meta.name) {
          projects.push(meta);
        }
      } catch {
        // Ignore malformed project meta in localStorage
      }
    }
  }
  return projects;
}

export function getProject(id: string): ProjectMeta | undefined {
  const raw = localStorage.getItem(PROJECT_PREFIX + id);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function setProject(id: string, meta: ProjectMeta): void {
  localStorage.setItem(PROJECT_PREFIX + id, JSON.stringify(meta));
}
