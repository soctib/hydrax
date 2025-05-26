import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export type DesignerState = {
  offset: { x: number; y: number };
  scale: number;
  activeProjectId: string | null;
};

const initialState: DesignerState = {
  offset: { x: 0, y: 0 },
  scale: 1,
  activeProjectId: null,
};

const designerSlice = createSlice({
  name: 'designer',
  initialState,
  reducers: {
    setOffset(state, action: PayloadAction<{ x: number; y: number }>) {
      state.offset = action.payload;
    },
    setScale(state, action: PayloadAction<number>) {
      state.scale = action.payload;
    },
    setDesignerState(state, action: PayloadAction<Omit<DesignerState, 'activeProjectId'>>) {
      state.offset = action.payload.offset;
      state.scale = action.payload.scale;
    },
    setActiveProjectId(state, action: PayloadAction<string | null>) {
      state.activeProjectId = action.payload;
    },
  },
});

export const saveProjectGraphThunk = createAsyncThunk<void, { graphData: unknown }>(
  'designer/saveProjectGraph',
  async ({ graphData }, thunkAPI) => {
    const state = thunkAPI.getState() as { designer: DesignerState };
    const projectId = state.designer.activeProjectId;
    if (!projectId) return;
    const PREFIX = 'hydrax.project.';
    const raw = localStorage.getItem(PREFIX + projectId);
    if (!raw) return;
    let meta;
    try {
      meta = JSON.parse(raw);
    } catch {
      return;
    }
    const updated = { ...meta, graph: graphData };
    localStorage.setItem(PREFIX + projectId, JSON.stringify(updated));
  }
);

export const { setOffset, setScale, setDesignerState, setActiveProjectId } = designerSlice.actions;
export default designerSlice.reducer;
