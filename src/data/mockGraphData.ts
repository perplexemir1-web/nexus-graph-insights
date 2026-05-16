import type { GraphNode } from '@/types/graph.types';

export interface GraphEdge {
  from: string;
  to: string;
  warm?: boolean;
}

export interface MockGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const mockGraphData: MockGraphData = {
  nodes: [
    { id: 'user', name: 'Ahmad K.', kind: 'user', sub: 'You' },
    { id: 'james', name: 'James T.', kind: 'person', sub: 'UM alum', warmness: 82 },
    { id: 'priya', name: 'Priya Sharma', kind: 'person', sub: 'SWE II · Google', warmness: 78 },
    { id: 'google', name: 'Google', kind: 'company' },
    { id: 'stripe', name: 'Stripe', kind: 'company' },
    { id: 'grab', name: 'Grab', kind: 'company' },
  ],
  edges: [
    { from: 'user', to: 'james', warm: true },
    { from: 'james', to: 'priya', warm: true },
    { from: 'priya', to: 'google', warm: true },
    { from: 'user', to: 'stripe' },
    { from: 'user', to: 'grab' },
  ],
};
