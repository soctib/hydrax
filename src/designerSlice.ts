import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DesignerState = {
  offset: { x: number; y: number };
  scale: number;
};

const initialState: DesignerState = {
  offset: { x: 0, y: 0 },
  scale: 1,
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
    setDesignerState(state, action: PayloadAction<DesignerState>) {
      state.offset = action.payload.offset;
      state.scale = action.payload.scale;
    },
  },
});

export const { setOffset, setScale, setDesignerState } = designerSlice.actions;
export default designerSlice.reducer;
