"use client"

import { useCallback, useMemo, useEffect } from "react"
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
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { StepNode } from "./step-node"
import { StartEndNode } from "./start-end-node"
import { AddNodeButton } from "./add-node-button"
import type { WorkflowDefinition } from "@/lib/workflow-types"

interface FlowCanvasProps {
  workflow: WorkflowDefinition
  selectedStepId: string | null
  onSelectStep: (stepId: string | null) => void
  onAddStep: () => void
  onUpdateWorkflow: (workflow: WorkflowDefinition) => void
}

const nodeTypes = {
  stepNode: StepNode,
  startEnd: StartEndNode,
  addButton: AddNodeButton,
}

export function FlowCanvas({
  workflow,
  selectedStepId,
  onSelectStep,
  onAddStep,
}: FlowCanvasProps) {
  // Convert workflow steps to React Flow nodes
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    
    const startY = 60
    const stepHeight = 120
    const addButtonSpacing = 40
    const columnWidth = 200
    const columnCenterX = 400
    const columnX = columnCenterX - columnWidth / 2

    // Start node
    nodes.push({
      id: "start",
      type: "startEnd",
      position: { x: columnX, y: startY },
      data: { type: "start" },
      draggable: false,
    })

    let currentY = startY + 50

    // Add button after start (if no steps)
    if (workflow.steps.length === 0) {
      nodes.push({
        id: "add-start",
        type: "addButton",
        position: { x: columnX, y: currentY },
        data: { onAdd: onAddStep },
        draggable: false,
      })

      edges.push({
        id: "start-to-add",
        source: "start",
        target: "add-start",
        type: "straight",
        style: { stroke: "#d1d5db", strokeWidth: 1, strokeDasharray: "4 4" },
      })

      edges.push({
        id: "add-to-end",
        source: "add-start",
        target: "end",
        type: "straight",
        style: { stroke: "#d1d5db", strokeWidth: 1, strokeDasharray: "4 4" },
      })

      currentY += addButtonSpacing
    } else {
      // First add button
      nodes.push({
        id: "add-0",
        type: "addButton",
        position: { x: columnX, y: currentY },
        data: { onAdd: onAddStep },
        draggable: false,
      })

      edges.push({
        id: "start-to-add-0",
        source: "start",
        target: "add-0",
        type: "straight",
        style: { stroke: "#d1d5db", strokeWidth: 1, strokeDasharray: "4 4" },
      })

      currentY += addButtonSpacing

      // Steps with add buttons between them
      workflow.steps.forEach((step, index) => {
        const stepId = step.id

        // Edge from add button to step
        edges.push({
          id: `add-${index}-to-${stepId}`,
          source: `add-${index}`,
          target: stepId,
          type: "straight",
          style: { stroke: "#d1d5db", strokeWidth: 1, strokeDasharray: "4 4" },
        })

        // Step node
        nodes.push({
          id: stepId,
          type: "stepNode",
          position: { x: columnX, y: currentY },
          data: {
            step,
            isSelected: selectedStepId === step.id,
          },
        })

        currentY += stepHeight

        // Add button after this step
        nodes.push({
          id: `add-${index + 1}`,
          type: "addButton",
          position: { x: columnX, y: currentY },
          data: { onAdd: onAddStep },
          draggable: false,
        })

        edges.push({
          id: `${stepId}-to-add-${index + 1}`,
          source: stepId,
          target: `add-${index + 1}`,
          type: "straight",
          style: { stroke: "#d1d5db", strokeWidth: 1, strokeDasharray: "4 4" },
        })

        currentY += addButtonSpacing
      })

      // Edge from last add button to end
      edges.push({
        id: `add-${workflow.steps.length}-to-end`,
        source: `add-${workflow.steps.length}`,
        target: "end",
        type: "straight",
        style: { stroke: "#d1d5db", strokeWidth: 1, strokeDasharray: "4 4" },
      })
    }

    // End node
    nodes.push({
      id: "end",
      type: "startEnd",
      position: { x: columnX, y: currentY + 30 },
      data: { type: "end" },
      draggable: false,
    })

    return { nodes, edges }
  }, [workflow.steps, selectedStepId, onAddStep])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes when workflow or selection changes
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onPaneClick = useCallback(() => {
    onSelectStep(null)
  }, [onSelectStep])

  // Handle node clicks
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    if (node.type === "stepNode") {
      onSelectStep(node.id)
    }
  }, [onSelectStep])

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        selectNodesOnDrag={false}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
        />
        <Controls 
          showInteractive={false} 
        />
      </ReactFlow>
    </div>
  )
}
