import { createContext, useContext } from 'react';
import type { LGraph } from 'litegraph.js';

export const DesignerGraphContext = createContext<LGraph | null>(null);

export function useDesignerGraph() {
  return useContext(DesignerGraphContext);
}
