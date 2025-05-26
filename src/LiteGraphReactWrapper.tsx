import { LGraph, LGraphCanvas } from 'litegraph.js';
import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { setOffset, setScale, setDesignerState } from './designerSlice';
import { initDesignerGraph } from './initDesignerGraph';
import { useDesignerGraph } from './DesignerGraphContext';
import { useProjectStorage } from './ProjectStorageContext';

export function LiteGraphReactWrapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<LGraphCanvas | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const offset = useSelector((state: RootState) => state.designer.offset);
  const scale = useSelector((state: RootState) => state.designer.scale);
  const activeProjectId = useSelector((state: RootState) => state.designer.activeProjectId);
  const graph = useDesignerGraph();
  const projectStorage = useProjectStorage();
  // Only get serializedGraph for the current project when switching projects
  useLiteGraphCanvas({
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
    dispatch,
    graph,
    activeProjectId,
    projectStorage,
    graphCanvasRef,
  });
  useSyncPanZoom(graphCanvasRef, offset, scale);
  return (
    <div
      style={{
        width: '100%',
        height: 600,
        background: '#181818',
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        width={1024}
        height={600}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: 8,
        }}
      />
    </div>
  );
}

type UseLiteGraphCanvasOpts = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  dispatch: AppDispatch;
  graph: LGraph | null;
  activeProjectId: string | null;
  projectStorage: ReturnType<typeof useProjectStorage>;
  graphCanvasRef: React.MutableRefObject<LGraphCanvas | null>;
};

// useLiteGraphCanvas: initializes the canvas and graph only when project changes
function useLiteGraphCanvas({
  canvasRef,
  dispatch,
  graph,
  activeProjectId,
  projectStorage,
  graphCanvasRef,
}: UseLiteGraphCanvasOpts) {
  useEffect(() => {
    const canvas = canvasRef.current;
    let graphCanvas: LGraphCanvas | null = null;
    let isDragging = false;
    function resizeCanvas() {
      if (canvas) {
        const parent = canvas.parentElement;
        if (parent) {
          const dpr = window.devicePixelRatio || 1;
          const width = parent.clientWidth;
          const height = parent.clientHeight;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = width + 'px';
          canvas.style.height = height + 'px';
          if (graphCanvas) {
            graphCanvas.resize();
          }
        }
      }
    }
    function handlePanZoomChange() {
      if (!graphCanvas) return;
      const [x, y] = graphCanvas.ds.offset;
      const s = graphCanvas.ds.scale;
      dispatch(setOffset({ x, y }));
      dispatch(setScale(s));
    }
    function onMouseDown() {
      if (graphCanvas && graphCanvas.dragging_canvas) {
        isDragging = true;
      }
    }
    function onMouseMove() {
      if (isDragging) {
        handlePanZoomChange();
      }
    }
    function onMouseUp() {
      if (isDragging) {
        handlePanZoomChange();
        isDragging = false;
      }
    }
    function onWheel() {
      handlePanZoomChange();
    }
    if (canvas && graph && activeProjectId) {
      graphCanvas = new LGraphCanvas(canvas, graph);
      graphCanvasRef.current = graphCanvas;
      // Listeners for pan/zoom changes
      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseup', onMouseUp);
      canvas.addEventListener('wheel', onWheel);
      // Only initialize graph when project changes
      const serializedGraph = projectStorage.get(activeProjectId)?.graph;
      initDesignerGraph(graph, serializedGraph);
      graph.start();
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }
    return () => {
      if (graph && typeof graph.stop === 'function') graph.stop();
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('wheel', onWheel);
      }
      // Save pan/zoom to Redux on unmount
      if (graphCanvas) {
        const [x, y] = graphCanvas.ds.offset;
        dispatch(setDesignerState({ offset: { x, y }, scale: graphCanvas.ds.scale }));
      }
      graphCanvasRef.current = null;
    };
  }, [canvasRef, dispatch, graph, activeProjectId, projectStorage, graphCanvasRef]);
}

// useSyncPanZoom: keeps the canvas pan/zoom in sync with Redux state
function useSyncPanZoom(
  graphCanvasRef: React.MutableRefObject<LGraphCanvas | null>,
  offset: { x: number; y: number },
  scale: number
) {
  useEffect(() => {
    const graphCanvas = graphCanvasRef.current;
    if (graphCanvas) {
      if (graphCanvas.ds.offset[0] !== offset.x || graphCanvas.ds.offset[1] !== offset.y) {
        console.log(graphCanvas.ds.offset[0], offset.x, graphCanvas.ds.offset[1], offset.y);
        graphCanvas.ds.offset = [offset.x, offset.y];
      }
      if (graphCanvas.ds.scale !== scale) {
        graphCanvas.ds.scale = scale;
        console.log(graphCanvas.ds.scale, scale);
      }
    }
  }, [graphCanvasRef, offset.x, offset.y, scale]);
}
