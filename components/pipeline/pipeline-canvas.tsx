"use client"

import { useCallback, useMemo, useEffect, useState, createContext, useContext, type ReactNode } from "react"
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
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { StageNode } from "./stage-node"
import type { PipelineDefinition } from "@/lib/workflow-types"

/** Context for the canvas container so dialogs can portal into it. */
const CanvasDialogContainerContext = createContext<HTMLElement | null>(null)

export function useCanvasDialogContainer() {
  return useContext(CanvasDialogContainerContext)
}

interface PipelineCanvasProps {
  pipeline: PipelineDefinition
  selectedStageId: string | null
  onSelectStage: (stageId: string | null) => void
  onStageClick?: (stageId: string) => void
  initialZoom?: number
  children?: ReactNode
}

const nodeTypes = {
  stageNode: StageNode,
}

export function PipelineCanvas({
  pipeline,
  selectedStageId,
  onSelectStage,
  onStageClick,
  initialZoom = 1,
  children,
}: PipelineCanvasProps) {
  // Convert pipeline stages to React Flow nodes (vertical layout)
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    const stageWidth = 180
    const stageHeight = 100
    const stageSpacing = 40
    const centerX = 400 - stageWidth / 2
    const startY = 60

    // Add stage nodes
    pipeline.stages.forEach((stage, index) => {
      const y = startY + index * (stageHeight + stageSpacing)

      nodes.push({
        id: stage.id,
        type: "stageNode",
        position: { x: centerX, y },
        data: {
          stage,
          isSelected: selectedStageId === stage.id,
          onClick: onStageClick,
        },
        draggable: false,
      })
    })

    // Add edges between stages (vertical flow)
    for (let i = 0; i < pipeline.stages.length - 1; i++) {
      const fromStage = pipeline.stages[i]
      const toStage = pipeline.stages[i + 1]

      edges.push({
        id: `${fromStage.id}-to-${toStage.id}`,
        source: fromStage.id,
        target: toStage.id,
        type: "straight",
        style: {
          stroke: "var(--color-border)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
      })
    }

    return { nodes, edges }
  }, [pipeline.stages, selectedStageId, onStageClick])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes when pipeline or selection changes
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onPaneClick = useCallback(() => {
    onSelectStage(null)
  }, [onSelectStage])

  // Handle node clicks - select the stage
  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      if (node.type === "stageNode") {
        onSelectStage(node.id)
      }
    },
    [onSelectStage]
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
          fitViewOptions={{ padding: 0.3, minZoom: initialZoom, maxZoom: initialZoom }}
          minZoom={0.3}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: initialZoom }}
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
