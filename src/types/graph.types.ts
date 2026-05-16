export type NodeKind = 'user' | 'person' | 'company' | 'skill' | 'community'

export interface GraphNode {
  id: string
  name: string
  kind: NodeKind
  sub?: string
  warmness?: number
  company?: string
  university?: string
  isOnWarmPath?: boolean
  val?: number
}
