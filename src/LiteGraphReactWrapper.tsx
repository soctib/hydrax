import { LiteGraph, LGraphCanvas, LGraph } from 'litegraph.js';
import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { setOffset, setScale, setDesignerState } from './designerSlice';

export function LiteGraphReactWrapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const offset = useSelector((state: RootState) => state.designer.offset);
  const scale = useSelector((state: RootState) => state.designer.scale);
  useLiteGraphCanvas(canvasRef as React.RefObject<HTMLCanvasElement>, offset, scale, dispatch);
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

function useLiteGraphCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  offset: { x: number; y: number },
  scale: number,
  dispatch: AppDispatch
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const graph = new LiteGraph.LGraph();
    let graphCanvas: LGraphCanvas | null = null;
    let lastOffset: [number, number] = [offset.x, offset.y];
    let lastScale: number = scale;
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
      if (x !== lastOffset[0] || y !== lastOffset[1]) {
        dispatch(setOffset({ x, y }));
        lastOffset = [x, y];
      }
      if (s !== lastScale) {
        dispatch(setScale(s));
        lastScale = s;
      }
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

    if (canvas) {
      graphCanvas = new LGraphCanvas(canvas, graph);
      // Restore pan/zoom from Redux
      graphCanvas.ds.offset = [offset.x, offset.y];
      graphCanvas.ds.scale = scale;
      // Listen for pan/zoom changes
      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseup', onMouseUp);
      canvas.addEventListener('wheel', onWheel);
      // Add demo nodes
      addDemoNodes(graph);
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
    };
  }, [canvasRef, offset.x, offset.y, scale, dispatch]);
}

function addDemoNodes(graph: LGraph) {
  const nodeConst = LiteGraph.createNode('basic/const');
  nodeConst.pos = [200, 200];
  graph.add(nodeConst);
  // @ts-expect-error: setValue exists on const node
  nodeConst.setValue(4.5);
  const nodeWatch = LiteGraph.createNode('basic/watch');
  nodeWatch.pos = [700, 200];
  graph.add(nodeWatch);
  nodeConst.connect(0, nodeWatch, 0);
}
