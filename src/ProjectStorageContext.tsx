import { createContext, useContext } from 'react';
import type { ProjectMeta } from './projectStorage';
import { listProjects, getProject, setProject } from './projectStorage';

export type ProjectStorageApi = {
  list: () => ProjectMeta[];
  get: (id: string) => ProjectMeta | undefined;
  set: (id: string, meta: ProjectMeta) => void;
};

const defaultApi: ProjectStorageApi = {
  list: listProjects,
  get: getProject,
  set: setProject,
};

export const ProjectStorageContext = createContext<ProjectStorageApi>(defaultApi);
export const useProjectStorage = () => useContext(ProjectStorageContext);
