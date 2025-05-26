import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { DesignerGraphContext } from './DesignerGraphContext';
import { LGraph } from 'litegraph.js';
import { LiteGraphReactWrapper } from './LiteGraphReactWrapper';
import { saveProjectGraphThunk } from './designerSlice';

export function DesignerScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const graphRef = useRef<LGraph | null>(null);
  if (!graphRef.current) {
    graphRef.current = new LGraph();
  }

  function handleSave() {
    const graph = graphRef.current;
    if (graph && typeof graph.serialize === 'function') {
      dispatch(
        saveProjectGraphThunk({
          graphData: graph.serialize(),
        })
      );
    } else {
      console.warn('[DesignerScreen] No graph instance found to save.');
    }
  }

  return (
    <DesignerGraphContext.Provider value={graphRef.current}>
      <div className="designer-container padding-xl margin-x-auto">
        <h2>Designer</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <button onClick={handleSave} className="defaultButton padding-x-xl">
            Save
          </button>
          {/* Add more toolbar buttons here as needed */}
        </div>
        <LiteGraphReactWrapper />
      </div>
    </DesignerGraphContext.Provider>
  );
}
