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
  Connection,
  addEdge,
  ConnectionMode,
  MarkerType,
  Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { StepNode } from "./step-node"
import { StartEndNode } from "./start-end-node"
import { AddNodeButton } from "./add-node-button"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { GridIcon, LayoutLeftIcon } from "@hugeicons/core-free-icons"
import type { WorkflowDefinition, TransitionDefinition } from "@/lib/workflow-types"
import type { StepConfigFocus } from "./step-config-sheet"
import { getLayoutedElements } from "@/lib/graph-layout"

/** Context for the canvas container so dialogs can portal into it. */
const CanvasDialogContainerContext = createContext<HTMLElement | null>(null)

export function useCanvasDialogContainer() {
  return useContext(CanvasDialogContainerContext)
}

interface DirectedFlowCanvasProps {
  workflow: WorkflowDefinition
  selectedStepId: string | null
  onSelectStep: (stepId: string | null) => void
  onOpenStepConfig?: (stepId: string, focus: StepConfigFocus) => void
  onAddStep: () => void
  onUpdateWorkflow: (workflow: WorkflowDefinition) => void
  /** Enable edge creation/deletion */
  editable?: boolean
  children?: ReactNode
}

const nodeTypes = {
  stepNode: StepNode,
  startEnd: StartEndNode,
  addButton: AddNodeButton,
}

export function DirectedFlowCanvas({
  workflow,
  selectedStepId,
  onSelectStep,
  onOpenStepConfig,
  onAddStep,
  onUpdateWorkflow,
  editable = true,
  children,
}: DirectedFlowCanvasProps) {
  // Convert workflow to React Flow format using transitions
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    const columnWidth = 200
    const columnCenterX = 400
    const columnX = columnCenterX - columnWidth / 2

    // Start node
    nodes.push({
      id: "start",
      type: "startEnd",
      position: { x: columnX, y: 60 },
      data: { type: "start" },
      draggable: editable,
    })

    // Step nodes - use positions from step definitions
    workflow.steps.forEach((step) => {
      nodes.push({
        id: step.id,
        type: "stepNode",
        position: step.position || { x: columnX, y: 150 },
        data: {
          step,
          isSelected: selectedStepId === step.id,
          onOpenStepConfig,
        },
        draggable: editable,
      })
    })

    // End node
    const maxY = Math.max(
      ...workflow.steps.map((s) => s.position?.y || 0),
      60
    )
    nodes.push({
      id: "end",
      type: "startEnd",
      position: { x: columnX, y: maxY + 200 },
      data: { type: "end" },
      draggable: editable,
    })

    // Create edges from transitions
    workflow.transitions.forEach((transition) => {
      edges.push({
        id: transition.id,
        source: transition.fromStepId,
        target: transition.toStepId,
        type: "smoothstep",
        label: transition.label,
        labelStyle: { fontSize: 10, fill: "var(--color-muted-foreground)" },
        labelBgStyle: { fill: "var(--color-background)" },
        style: {
          stroke: "var(--color-border)",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12,
          height: 12,
          color: "var(--color-border)",
        },
      })
    })

    // If no transitions exist, create default linear flow
    if (workflow.transitions.length === 0 && workflow.steps.length > 0) {
      // Start to first step
      edges.push({
        id: "default-start",
        source: "start",
        target: workflow.steps[0].id,
        type: "smoothstep",
        style: {
          stroke: "var(--color-border)",
          strokeWidth: 2,
          strokeDasharray: "4 4",
        },
      })

      // Between steps
      for (let i = 0; i < workflow.steps.length - 1; i++) {
        edges.push({
          id: `default-${i}`,
          source: workflow.steps[i].id,
          target: workflow.steps[i + 1].id,
          type: "smoothstep",
          style: {
            stroke: "var(--color-border)",
            strokeWidth: 2,
            strokeDasharray: "4 4",
          },
        })
      }

      // Last step to end
      edges.push({
        id: "default-end",
        source: workflow.steps[workflow.steps.length - 1].id,
        target: "end",
        type: "smoothstep",
        style: {
          stroke: "var(--color-border)",
          strokeWidth: 2,
          strokeDasharray: "4 4",
        },
      })
    }

    return { nodes, edges }
  }, [workflow, selectedStepId, onOpenStepConfig, editable])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update when workflow changes
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!editable) return

      // Create new transition
      const newTransition: TransitionDefinition = {
        id: `tr-${Date.now()}`,
        fromStepId: connection.source!,
        toStepId: connection.target!,
      }

      onUpdateWorkflow({
        ...workflow,
        transitions: [...workflow.transitions, newTransition],
      })

      // Add edge visually
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            style: {
              stroke: "var(--color-border)",
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: "var(--color-border)",
            },
          },
          eds
        )
      )
    },
    [workflow, onUpdateWorkflow, editable, setEdges]
  )

  // Handle edge deletion
  const onEdgeDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      if (!editable) return

      const edgeIds = new Set(edgesToDelete.map((e) => e.id))
      onUpdateWorkflow({
        ...workflow,
        transitions: workflow.transitions.filter((t) => !edgeIds.has(t.id)),
      })
    },
    [workflow, onUpdateWorkflow, editable]
  )

  // Handle node position change
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (!editable) return

      // Update step position in workflow
      if (node.type === "stepNode") {
        onUpdateWorkflow({
          ...workflow,
          steps: workflow.steps.map((s) =>
            s.id === node.id ? { ...s, position: node.position } : s
          ),
        })
      }
    },
    [workflow, onUpdateWorkflow, editable]
  )

  // Auto-layout function
  const handleAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      {
        direction: "TB",
        nodeWidth: 200,
        nodeHeight: 100,
        nodeSeparation: 60,
        rankSeparation: 100,
      }
    )

    setNodes(layoutedNodes)
    setEdges(layoutedEdges)

    // Update workflow with new positions
    const updatedSteps = workflow.steps.map((step) => {
      const node = layoutedNodes.find((n) => n.id === step.id)
      return node ? { ...step, position: node.position } : step
    })

    onUpdateWorkflow({
      ...workflow,
      steps: updatedSteps,
    })
  }, [nodes, edges, workflow, onUpdateWorkflow, setNodes, setEdges])

  const onPaneClick = useCallback(() => {
    onSelectStep(null)
  }, [onSelectStep])

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      if (node.type === "stepNode") {
        const target = event.target as HTMLElement
        const isActionButton = target.closest('button[type="button"]')
        if (!isActionButton) {
          onSelectStep(node.id)
        }
      }
    },
    [onSelectStep]
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
          onConnect={onConnect}
          onEdgesDelete={onEdgeDelete}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={editable}
          nodesConnectable={editable}
          connectionMode={ConnectionMode.Loose}
          selectNodesOnDrag={false}
          deleteKeyCode={editable ? "Backspace" : null}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls showInteractive={false} />

          {editable && (
            <Panel position="top-right" className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                onClick={handleAutoLayout}
              >
                <HugeiconsIcon icon={LayoutLeftIcon} size={14} />
                Auto Layout
              </Button>
            </Panel>
          )}
        </ReactFlow>
      </div>
      {children}
    </CanvasDialogContainerContext.Provider>
  )
}
