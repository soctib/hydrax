import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProjectMeta } from './projectStorage';
import { listProjects } from './projectStorage';

export type ProjectsState = {
  projects: ProjectMeta[];
};

const initialState: ProjectsState = {
  projects: listProjects(),
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<ProjectMeta[]>) {
      state.projects = action.payload;
    },
  },
});

export const { setProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
