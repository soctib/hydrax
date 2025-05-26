import { LGraph } from 'litegraph.js';

export function initDesignerGraph(graph: LGraph, serializedGraph?: unknown) {
  if (serializedGraph && typeof graph.configure === 'function') {
    graph.clear();
    graph.configure(serializedGraph);
  }
}
