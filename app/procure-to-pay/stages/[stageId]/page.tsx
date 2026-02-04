"use client"

import { useState, use, useMemo } from "react"
import { notFound, useRouter } from "next/navigation"
import { ReactFlowProvider } from "@xyflow/react"
import { SiteHeader } from "@/components/site-header"
import { StageWorkflowCanvas } from "@/components/stage/stage-workflow-canvas"
import { AddWorkflowDialog } from "@/components/stage/add-workflow-dialog"
import { DeleteWorkflowDialog } from "@/components/stage/delete-workflow-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"
import {
  getStageById,
  getStageWorkflowGraph,
  getWorkflowsForStage,
} from "@/lib/mock-data"
import type { StageWorkflowGraph, WorkflowDefinition } from "@/lib/workflow-types"

type OperationFilter = "create" | "amend" | "cancel"

export default function StagePage({
  params,
}: {
  params: Promise<{ stageId: string }>
}) {
  const { stageId } = use(params)
  const router = useRouter()

  const stage = getStageById(stageId)
  const initialGraph = getStageWorkflowGraph(stageId)
  const initialWorkflows = getWorkflowsForStage(stageId)

  const [graph, setGraph] = useState<StageWorkflowGraph>(
    initialGraph || {
      stageId,
      workflows: [],
      transitions: [],
    }
  )
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(initialWorkflows)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeOperation, setActiveOperation] = useState<OperationFilter>("create")
  const [deleteWorkflowId, setDeleteWorkflowId] = useState<string | null>(null)

  if (!stage) {
    notFound()
  }

  // Redirect if stage is disabled
  if (stage.status === "disabled") {
    router.push("/procure-to-pay")
    return null
  }

  // Filter workflows by selected operation
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => wf.operation === activeOperation)
  }, [workflows, activeOperation])

  // Create a filtered graph with only the workflows for the active operation
  const filteredGraph = useMemo((): StageWorkflowGraph => {
    const filteredWorkflowIds = new Set(filteredWorkflows.map((wf) => wf.id))

    return {
      stageId: graph.stageId,
      workflows: graph.workflows.filter((wfNode) =>
        filteredWorkflowIds.has(wfNode.workflowId)
      ),
      transitions: graph.transitions.filter(
        (t) =>
          (t.fromWorkflowId === "stage_start" ||
            filteredWorkflowIds.has(t.fromWorkflowId)) &&
          (t.toWorkflowId === "stage_end" ||
            filteredWorkflowIds.has(t.toWorkflowId))
      ),
    }
  }, [graph, filteredWorkflows])

  // Count workflows per operation for tab badges
  const operationCounts = useMemo(() => {
    return {
      create: workflows.filter((wf) => wf.operation === "create").length,
      amend: workflows.filter((wf) => wf.operation === "amend").length,
      cancel: workflows.filter((wf) => wf.operation === "cancel").length,
    }
  }, [workflows])

  const deleteWorkflow = deleteWorkflowId
    ? workflows.find((wf) => wf.id === deleteWorkflowId)
    : null

  const handleWorkflowClick = (workflowId: string) => {
    router.push(`/procure-to-pay/stages/${stageId}/workflows/${workflowId}`)
  }

  const handleCreateWorkflow = (newWorkflow: {
    name: string
    description: string
    operation: "create" | "amend" | "cancel"
  }) => {
    const workflowId = `wf-${Date.now()}`

    // Create new workflow definition
    const workflow: WorkflowDefinition = {
      id: workflowId,
      name: newWorkflow.name,
      description: newWorkflow.description,
      version: "v1.0",
      appId: stage.appId,
      entityType: stage.appId,
      operation: newWorkflow.operation,
      steps: [],
      transitions: [],
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to workflows list
    setWorkflows((prev) => [...prev, workflow])

    // Add to graph
    const workflowsOfSameOperation = workflows.filter(
      (wf) => wf.operation === newWorkflow.operation
    )
    const newPosition = {
      x: 300,
      y: 150 + workflowsOfSameOperation.length * 190,
    }

    setGraph((prev) => ({
      ...prev,
      workflows: [...prev.workflows, { workflowId, position: newPosition }],
      transitions: [
        ...prev.transitions,
        {
          id: `wt-${Date.now()}`,
          fromWorkflowId: "stage_start",
          toWorkflowId: workflowId,
          relationType: "sequential" as const,
        },
        {
          id: `wt-${Date.now() + 1}`,
          fromWorkflowId: workflowId,
          toWorkflowId: "stage_end",
          relationType: "sequential" as const,
        },
      ],
    }))

    // Switch to the operation tab of the new workflow
    setActiveOperation(newWorkflow.operation)

    // Select the new workflow
    setSelectedWorkflowId(workflowId)
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows((prev) => prev.filter((wf) => wf.id !== workflowId))
    setGraph((prev) => ({
      ...prev,
      workflows: prev.workflows.filter((node) => node.workflowId !== workflowId),
      transitions: prev.transitions.filter(
        (transition) =>
          transition.fromWorkflowId !== workflowId &&
          transition.toWorkflowId !== workflowId
      ),
    }))
    setSelectedWorkflowId((prev) => (prev === workflowId ? null : prev))
    setDeleteWorkflowId(null)
  }

  return (
    <div className="flex h-screen flex-col">
      <SiteHeader
        title={stage.name}
        breadcrumbs={[{ label: "Core Pipeline", href: "/procure-to-pay" }]}
        actions={
          <Button size="sm" className="h-7" onClick={() => setShowAddDialog(true)}>
            <HugeiconsIcon icon={Add01Icon} size={14} />
            Add Workflow
          </Button>
        }
      />

      {/* Operation Tabs */}
      <div className="px-4 bg-background">
        <Tabs
          value={activeOperation}
          onValueChange={(v) => setActiveOperation(v as OperationFilter)}
        >
          <TabsList variant="line" className="w-full justify-start border-b">
            <TabsTrigger value="create">
              On Create
              {operationCounts.create > 0 && (
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                  {operationCounts.create}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="amend">
              On Amend
              {operationCounts.amend > 0 && (
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                  {operationCounts.amend}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cancel">
              On Cancel
              {operationCounts.cancel > 0 && (
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                  {operationCounts.cancel}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative flex-1">
        <ReactFlowProvider>
          <StageWorkflowCanvas
            key={activeOperation} // Force re-mount on tab change for proper fitView
            stageId={stageId}
            workflows={filteredWorkflows}
            graph={filteredGraph}
            selectedWorkflowId={selectedWorkflowId}
            onSelectWorkflow={setSelectedWorkflowId}
            onWorkflowClick={handleWorkflowClick}
            onDeleteWorkflow={(workflowId) => setDeleteWorkflowId(workflowId)}
            onAddWorkflow={() => setShowAddDialog(true)}
          >
            <AddWorkflowDialog
              open={showAddDialog}
              onOpenChange={setShowAddDialog}
              onCreateWorkflow={handleCreateWorkflow}
              stageName={stage.name}
              defaultOperation={activeOperation}
            />
            {deleteWorkflow && (
              <DeleteWorkflowDialog
                open={!!deleteWorkflow}
                onOpenChange={(open) => {
                  if (!open) setDeleteWorkflowId(null)
                }}
                workflow={deleteWorkflow}
                onConfirm={() => handleDeleteWorkflow(deleteWorkflow.id)}
              />
            )}
          </StageWorkflowCanvas>
        </ReactFlowProvider>
      </div>
    </div>
  )
}
