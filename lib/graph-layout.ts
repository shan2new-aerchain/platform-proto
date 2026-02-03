import dagre from "dagre"
import type { Node, Edge } from "@xyflow/react"

export interface LayoutOptions {
  direction?: "TB" | "LR" | "BT" | "RL"
  nodeWidth?: number
  nodeHeight?: number
  nodeSeparation?: number
  rankSeparation?: number
}

/**
 * Applies automatic layout to a graph using dagre algorithm.
 * Returns new nodes with updated positions.
 */
export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[] } {
  const {
    direction = "TB",
    nodeWidth = 200,
    nodeHeight = 100,
    nodeSeparation = 50,
    rankSeparation = 80,
  } = options

  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSeparation,
    ranksep: rankSeparation,
  })

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Run layout algorithm
  dagre.layout(dagreGraph)

  // Apply positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    if (!nodeWithPosition) return node

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}

/**
 * Finds nodes that can run in parallel (have the same source).
 */
export function findParallelNodes(edges: Edge[]): Map<string, string[]> {
  const sourceToTargets = new Map<string, string[]>()

  edges.forEach((edge) => {
    const existing = sourceToTargets.get(edge.source) || []
    existing.push(edge.target)
    sourceToTargets.set(edge.source, existing)
  })

  // Filter to only sources with multiple targets
  const parallelGroups = new Map<string, string[]>()
  sourceToTargets.forEach((targets, source) => {
    if (targets.length > 1) {
      parallelGroups.set(source, targets)
    }
  })

  return parallelGroups
}

/**
 * Validates that a graph has no cycles.
 * Returns true if the graph is acyclic (valid).
 */
export function isAcyclic(nodes: Node[], edges: Edge[]): boolean {
  const nodeIds = new Set(nodes.map((n) => n.id))
  const adjacencyList = new Map<string, string[]>()

  // Build adjacency list
  nodeIds.forEach((id) => adjacencyList.set(id, []))
  edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.source) || []
    neighbors.push(edge.target)
    adjacencyList.set(edge.source, neighbors)
  })

  // DFS-based cycle detection
  const WHITE = 0 // Not visited
  const GRAY = 1 // Currently visiting (in stack)
  const BLACK = 2 // Fully visited

  const color = new Map<string, number>()
  nodeIds.forEach((id) => color.set(id, WHITE))

  function hasCycle(nodeId: string): boolean {
    color.set(nodeId, GRAY)

    const neighbors = adjacencyList.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (color.get(neighbor) === GRAY) {
        // Back edge found - cycle detected
        return true
      }
      if (color.get(neighbor) === WHITE && hasCycle(neighbor)) {
        return true
      }
    }

    color.set(nodeId, BLACK)
    return false
  }

  for (const nodeId of nodeIds) {
    if (color.get(nodeId) === WHITE && hasCycle(nodeId)) {
      return false
    }
  }

  return true
}

/**
 * Validates that all nodes are reachable from a start node.
 */
export function allNodesReachable(
  nodes: Node[],
  edges: Edge[],
  startNodeId: string
): boolean {
  const nodeIds = new Set(nodes.map((n) => n.id))
  const adjacencyList = new Map<string, string[]>()

  // Build adjacency list
  nodeIds.forEach((id) => adjacencyList.set(id, []))
  edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.source) || []
    neighbors.push(edge.target)
    adjacencyList.set(edge.source, neighbors)
  })

  // BFS from start node
  const visited = new Set<string>()
  const queue = [startNodeId]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (visited.has(current)) continue
    visited.add(current)

    const neighbors = adjacencyList.get(current) || []
    neighbors.forEach((n) => {
      if (!visited.has(n)) queue.push(n)
    })
  }

  // Check if all nodes were visited
  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) return false
  }

  return true
}
