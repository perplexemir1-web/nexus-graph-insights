export type NodeKind = 'user' | 'person' | 'company' | 'skill';

export interface GraphNode {
  id: string;
  name: string;
  kind: NodeKind;
  sub?: string;
  warmness?: number;
}
