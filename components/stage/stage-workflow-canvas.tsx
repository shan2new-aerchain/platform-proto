"use client"

import {
  useCallback,
  useMemo,
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react"
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
  NodeMouseHandler,
  MarkerType,
  addEdge,
  Connection,
  ConnectionMode,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { WorkflowNode } from "./workflow-node"
import { AddNodeButton } from "@/components/workflow/add-node-button"
import type { StageWorkflowGraph, WorkflowDefinition } from "@/lib/workflow-types"

/** Context for the canvas container so dialogs can portal into it. */
const CanvasDialogContainerContext = createContext<HTMLElement | null>(null)

export function useCanvasDialogContainer() {
  return useContext(CanvasDialogContainerContext)
}

interface StageWorkflowCanvasProps {
  stageId: string
  workflows: WorkflowDefinition[]
  graph: StageWorkflowGraph
  selectedWorkflowId: string | null
  onSelectWorkflow: (workflowId: string | null) => void
  onWorkflowClick?: (workflowId: string) => void
  onDeleteWorkflow?: (workflowId: string) => void
  onAddWorkflow?: () => void
  children?: ReactNode
}

const nodeTypes = {
  workflowNode: WorkflowNode,
  addButton: AddNodeButton,
}

export function StageWorkflowCanvas({
  stageId,
  workflows,
  graph,
  selectedWorkflowId,
  onSelectWorkflow,
  onWorkflowClick,
  onDeleteWorkflow,
  onAddWorkflow,
  children,
}: StageWorkflowCanvasProps) {
  // Convert workflow graph to React Flow nodes (vertical layout)
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    const startY = 60
    const workflowHeight = 140
    const addButtonSpacing = 50
    const columnWidth = 220
    const columnCenterX = 400
    const columnX = columnCenterX - columnWidth / 2

    // Start node position
    let currentY = startY

    // Add button at start
    nodes.push({
      id: "add-start",
      type: "addButton",
      position: { x: columnX, y: currentY },
      data: { onAdd: onAddWorkflow, label: "Add workflow" },
      draggable: false,
    })

    currentY += addButtonSpacing

    // Add workflow nodes
    graph.workflows.forEach((wfNode, index) => {
      const workflow = workflows.find((w) => w.id === wfNode.workflowId)
      if (!workflow) return

      // Edge from previous element to this workflow
      const prevId = index === 0 ? "add-start" : `add-${index}`

      edges.push({
        id: `${prevId}-to-${workflow.id}`,
        source: prevId,
        target: workflow.id,
        type: "straight",
        style: {
          stroke: "var(--color-border)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
      })

      // Workflow node
      nodes.push({
        id: workflow.id,
        type: "workflowNode",
        position: { x: columnX, y: currentY },
        data: {
          workflow,
          isSelected: selectedWorkflowId === workflow.id,
          onClick: onWorkflowClick,
          onDelete: onDeleteWorkflow,
        },
        draggable: false,
      })

      currentY += workflowHeight

      // Add button after this workflow
      nodes.push({
        id: `add-${index + 1}`,
        type: "addButton",
        position: { x: columnX, y: currentY },
        data: { onAdd: onAddWorkflow, label: "Add workflow" },
        draggable: false,
      })

      // Edge from workflow to add button
      edges.push({
        id: `${workflow.id}-to-add-${index + 1}`,
        source: workflow.id,
        target: `add-${index + 1}`,
        type: "straight",
        style: {
          stroke: "var(--color-border)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
      })

      currentY += addButtonSpacing
    })

    // If no workflows, just show add button
    if (graph.workflows.length === 0) {
      edges.push({
        id: "add-start-to-empty",
        source: "add-start",
        target: "add-start",
        type: "straight",
        style: {
          stroke: "transparent",
          strokeWidth: 0,
        },
      })
    }

    return { nodes, edges }
  }, [graph, workflows, selectedWorkflowId, onWorkflowClick, onDeleteWorkflow, onAddWorkflow])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes when graph changes
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onPaneClick = useCallback(() => {
    onSelectWorkflow(null)
  }, [onSelectWorkflow])

  // Handle node clicks
  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      if (node.type === "workflowNode") {
        const target = event.target as HTMLElement
        const isActionButton = target.closest('button[type="button"]')
        if (!isActionButton) {
          onSelectWorkflow(node.id)
        }
      }
    },
    [onSelectWorkflow]
  )

  const [container, setContainer] = useState<HTMLElement | null>(null)
  const setContainerRef = useCallback((el: HTMLDivElement | null) => {
    setContainer(el)
  }, [])

  return (
    <CanvasDialogContainerContext.Provider value={container}>
      <div
        ref={setContainerRef}
        className="h-full w-full"
        style={{ transform: "translateZ(0)" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
          minZoom={0.3}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          selectNodesOnDrag={false}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      {children}
    </CanvasDialogContainerContext.Provider>
  )
}
