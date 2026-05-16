import type { MockGraphData } from '@/data/mockGraphData'

export function findWarmPath(
  graphData: MockGraphData,
  startId: string,
  targetCompanyId: string
): string[] {
  // Build adjacency map from edges (bidirectional)
  const adj = new Map<string, string[]>()
  for (const edge of graphData.edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, [])
    if (!adj.has(edge.to)) adj.set(edge.to, [])
    adj.get(edge.from)!.push(edge.to)
    adj.get(edge.to)!.push(edge.from)
  }

  // Get warmness of a node (higher = better, explore first)
  const getWarmness = (id: string) =>
    graphData.nodes.find(n => n.id === id)?.warmness ?? 0

  // BFS — explore warmer neighbors first
  const queue: string[][] = [[startId]]
  const visited = new Set<string>([startId])

  while (queue.length > 0) {
    const path = queue.shift()!
    const current = path[path.length - 1]

    // Found the target company
    if (current === targetCompanyId) return path

    // Also succeed if current person works at target company
    const currentNode = graphData.nodes.find(n => n.id === current)
    if (currentNode?.company === targetCompanyId) {
      // Extend path to include the company node
      return [...path, targetCompanyId]
    }

    if (path.length >= 5) continue // max 4 hops

    const neighbors = adj.get(current) ?? []
    // Sort by warmness descending so warmer paths explored first
    const sorted = [...neighbors]
      .filter(id => !visited.has(id))
      .sort((a, b) => getWarmness(b) - getWarmness(a))

    for (const neighbor of sorted) {
      visited.add(neighbor)
      queue.push([...path, neighbor])
    }
  }

  return [] // no path found
}
