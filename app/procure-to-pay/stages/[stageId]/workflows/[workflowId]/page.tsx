"use client"

import { useState, use, useRef } from "react"
import { notFound } from "next/navigation"
import { ReactFlowProvider } from "@xyflow/react"
import { SiteHeader } from "@/components/site-header"
import { FlowCanvas } from "@/components/workflow/flow-canvas"
import { ConditionsDialog } from "@/components/workflow/conditions-dialog"
import { ActorsDialog } from "@/components/workflow/actors-dialog"
import { CompletionDialog } from "@/components/workflow/completion-dialog"
import { NotificationsDialog } from "@/components/workflow/notifications-dialog"
import { VisibilityDialog } from "@/components/workflow/visibility-dialog"
import { AddStepDialog } from "@/components/workflow/add-step-dialog"
import { DeleteStepDialog } from "@/components/workflow/delete-step-dialog"
import { HistoryDialog } from "@/components/workflow/history-dialog"
import { TestDialog } from "@/components/workflow/test-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FloppyDiskIcon,
  PlayIcon,
  TimeQuarterPassIcon,
} from "@hugeicons/core-free-icons"
import {
  getStageById,
  getWorkflowsForStage,
  allWorkflowDefinitions,
} from "@/lib/mock-data"
import type { Step, StepType, WorkflowDefinition } from "@/lib/workflow-types"
import type { StepConfigFocus } from "@/components/workflow/step-config-sheet"

export default function ProcureToPayWorkflowBuilderPage({
  params,
}: {
  params: Promise<{ stageId: string; workflowId: string }>
}) {
  const { stageId, workflowId } = use(params)

  const stage = getStageById(stageId)
  const initialWorkflow = allWorkflowDefinitions.find((w) => w.id === workflowId)

  const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(
    initialWorkflow || null
  )
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
  const [showAddStepDialog, setShowAddStepDialog] = useState(false)

  // Separate state for each dialog type
  const [conditionsStepId, setConditionsStepId] = useState<string | null>(null)
  const [actorsStepId, setActorsStepId] = useState<string | null>(null)
  const [completionStepId, setCompletionStepId] = useState<string | null>(null)
  const [notificationsStepId, setNotificationsStepId] = useState<string | null>(null)
  const [visibilityStepId, setVisibilityStepId] = useState<string | null>(null)
  const [deleteStepId, setDeleteStepId] = useState<string | null>(null)
  const [showSaveToast, setShowSaveToast] = useState(false)
  const saveToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [showTestDialog, setShowTestDialog] = useState(false)

  if (!workflow || !stage) {
    notFound()
  }

  const conditionsStep = conditionsStepId
    ? workflow.steps.find((s) => s.id === conditionsStepId)
    : null

  const actorsStep = actorsStepId
    ? workflow.steps.find((s) => s.id === actorsStepId)
    : null

  const completionStep = completionStepId
    ? workflow.steps.find((s) => s.id === completionStepId)
    : null

  const notificationsStep = notificationsStepId
    ? workflow.steps.find((s) => s.id === notificationsStepId)
    : null

  const visibilityStep = visibilityStepId
    ? workflow.steps.find((s) => s.id === visibilityStepId)
    : null

  const deleteStep = deleteStepId
    ? workflow.steps.find((s) => s.id === deleteStepId)
    : null

  const handleAddStep = (type: StepType) => {
    const stepNames: Record<StepType, string> = {
      approval: "New approve step",
      acknowledgement: "New acknowledge step",
      review: "New review step",
      assignment: "New assignment step",
    }

    const newStep: Step = {
      id: `step-${Date.now()}`,
      definitionId: type,
      name: stepNames[type],
      type,
      position: {
        x: 400,
        y: (workflow.steps.length + 1) * 150,
      },
      config: {
        actors: {
          assignmentType: "roles",
          roleIds: [],
          userIds: [],
          dynamicRules: [],
          allowReassignment: true,
        },
        completion: {
          criteria: "any",
          enableTimeout: false,
        },
        conditions: {
          appliesTo: ["create"],
          rules: [],
        },
        notifications: {
          onEntry: { notifyActors: true, notifyRequester: false },
          onCompletion: { notifyRequester: true, notifyNextActors: true },
        },
        visibility: { type: "all_participants" },
      },
    }

    setWorkflow({
      ...workflow,
      steps: [...workflow.steps, newStep],
    })
    setSelectedStepId(newStep.id)
  }

  const handleUpdateStep = (updatedStep: Step) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map((s) =>
        s.id === updatedStep.id ? updatedStep : s
      ),
    })
  }

  const handleDeleteStep = (stepId: string) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.filter((s) => s.id !== stepId),
    })
    setSelectedStepId(null)
    setConditionsStepId(null)
    setActorsStepId(null)
    setCompletionStepId(null)
    setNotificationsStepId(null)
    setVisibilityStepId(null)
    setDeleteStepId(null)
  }

  const handleSave = () => {
    if (saveToastTimeoutRef.current) {
      clearTimeout(saveToastTimeoutRef.current)
    }
    setShowSaveToast(true)
    saveToastTimeoutRef.current = setTimeout(() => {
      setShowSaveToast(false)
    }, 2000)
  }

  return (
    <div className="flex h-screen flex-col">
      <SiteHeader
        title={workflow.name}
        breadcrumbs={[
          { label: "ProcureToPay", href: "/procure-to-pay" },
          { label: stage.name, href: `/procure-to-pay/stages/${stageId}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={
                workflow.status === "published"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 capitalize"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400 capitalize"
              }
            >
              {workflow.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{workflow.version}</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => setShowHistoryDialog(true)}
            >
              <HugeiconsIcon icon={TimeQuarterPassIcon} size={14} />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => setShowTestDialog(true)}
            >
              <HugeiconsIcon icon={PlayIcon} size={14} />
              Test
            </Button>
            <Button size="sm" className="h-7" onClick={handleSave}>
              <HugeiconsIcon icon={FloppyDiskIcon} size={14} />
              Save
            </Button>
          </div>
        }
      />

      <div className="relative flex-1">
        <ReactFlowProvider>
          <FlowCanvas
            workflow={workflow}
            selectedStepId={selectedStepId}
            onSelectStep={(stepId) => {
              setSelectedStepId(stepId)
            }}
            onOpenStepConfig={(stepId, focus) => {
              // Route each focus type to its own dialog
              if (focus === "conditions") {
                setConditionsStepId(stepId)
              } else if (focus === "actors") {
                setActorsStepId(stepId)
              } else if (focus === "completion") {
                setCompletionStepId(stepId)
              } else if (focus === "notifications") {
                setNotificationsStepId(stepId)
              } else if (focus === "visibility") {
                setVisibilityStepId(stepId)
              }
            }}
            onAddStep={() => setShowAddStepDialog(true)}
            onRequestDeleteStep={(stepId) => setDeleteStepId(stepId)}
            onUpdateWorkflow={setWorkflow}
          >
            {conditionsStep && (
              <ConditionsDialog
                step={conditionsStep}
                open={!!conditionsStep}
                onOpenChange={(open) => {
                  if (!open) setConditionsStepId(null)
                }}
                onUpdate={handleUpdateStep}
              />
            )}
            {actorsStep && (
              <ActorsDialog
                step={actorsStep}
                open={!!actorsStep}
                onOpenChange={(open) => {
                  if (!open) setActorsStepId(null)
                }}
                onUpdate={handleUpdateStep}
              />
            )}
            {completionStep && (
              <CompletionDialog
                step={completionStep}
                open={!!completionStep}
                onOpenChange={(open) => {
                  if (!open) setCompletionStepId(null)
                }}
                onUpdate={handleUpdateStep}
              />
            )}
            {notificationsStep && (
              <NotificationsDialog
                step={notificationsStep}
                open={!!notificationsStep}
                onOpenChange={(open) => {
                  if (!open) setNotificationsStepId(null)
                }}
                onUpdate={handleUpdateStep}
              />
            )}
            {visibilityStep && (
              <VisibilityDialog
                step={visibilityStep}
                open={!!visibilityStep}
                onOpenChange={(open) => {
                  if (!open) setVisibilityStepId(null)
                }}
                onUpdate={handleUpdateStep}
              />
            )}
            {deleteStep && (
              <DeleteStepDialog
                step={deleteStep}
                open={!!deleteStep}
                onOpenChange={(open) => {
                  if (!open) setDeleteStepId(null)
                }}
                onConfirm={() => handleDeleteStep(deleteStep.id)}
              />
            )}
            <AddStepDialog
              open={showAddStepDialog}
              onOpenChange={setShowAddStepDialog}
              onSelectStepType={handleAddStep}
            />
            <HistoryDialog
              open={showHistoryDialog}
              onOpenChange={setShowHistoryDialog}
            />
            <TestDialog
              open={showTestDialog}
              onOpenChange={setShowTestDialog}
            />
          </FlowCanvas>
        </ReactFlowProvider>
      </div>
      {showSaveToast && (
        <div
          className="fixed bottom-4 right-4 rounded-md border bg-background px-3 py-2 text-xs shadow-md"
          role="status"
          aria-live="polite"
        >
          Workflow saved
        </div>
      )}
    </div>
  )
}
