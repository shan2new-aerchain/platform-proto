"use client"

import { useState, use } from "react"
import { notFound } from "next/navigation"
import { ReactFlowProvider } from "@xyflow/react"
import { SiteHeader } from "@/components/site-header"
import { FlowCanvas } from "@/components/workflow/flow-canvas"
import { StepConfigSheet } from "@/components/workflow/step-config-sheet"
import { StepSettingsDialog } from "@/components/workflow/step-settings-dialog"
import { AddStepDialog } from "@/components/workflow/add-step-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  FloppyDiskIcon, 
  PlayIcon, 
  TimeQuarterPassIcon,
} from "@hugeicons/core-free-icons"
import { getWorkflowById, getAppById } from "@/lib/mock-data"
import type { Step, StepType, WorkflowDefinition } from "@/lib/workflow-types"
import type { StepConfigFocus } from "@/components/workflow/step-config-sheet"

export default function WorkflowBuilderPage({
  params,
}: {
  params: Promise<{ appId: string; workflowId: string }>
}) {
  const { appId, workflowId } = use(params)
  const initialWorkflow = getWorkflowById(workflowId)
  const app = getAppById(appId)

  const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(
    initialWorkflow || null
  )
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
  const [selectedStepFocus, setSelectedStepFocus] = useState<StepConfigFocus>(null)
  const [showAddStepDialog, setShowAddStepDialog] = useState(false)
  const [settingsStepId, setSettingsStepId] = useState<string | null>(null)
  const [settingsFocus, setSettingsFocus] = useState<"notifications" | "visibility" | null>(null)

  if (!workflow || !app) {
    notFound()
  }

  const selectedStep = selectedStepId
    ? workflow.steps.find((s) => s.id === selectedStepId)
    : null

  const settingsStep = settingsStepId
    ? workflow.steps.find((s) => s.id === settingsStepId)
    : null

  const handleAddStep = (type: StepType) => {
    const stepNames: Record<StepType, string> = {
      approval: 'New approve step',
      acknowledgement: 'New acknowledge step',
      review: 'New review step',
      assignment: 'New assignment step',
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
          assignmentType: 'roles',
          roleIds: [],
          userIds: [],
          dynamicRules: [],
          allowReassignment: true,
        },
        completion: {
          criteria: 'any',
          enableTimeout: false,
        },
        conditions: {
          appliesTo: ['create'],
          rules: [],
        },
        notifications: {
          onEntry: { notifyActors: true, notifyRequester: false },
          onCompletion: { notifyRequester: true, notifyNextActors: true },
        },
        visibility: { type: 'all_participants' },
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
    setSelectedStepFocus(null)
  }

  return (
    <div className="flex h-screen flex-col">
      <SiteHeader
        title={workflow.name}
        breadcrumbs={[
          { label: "Apps", href: "/" },
          { label: app.name, href: `/apps/${appId}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={
                workflow.status === 'published'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 capitalize'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 capitalize'
              }
            >
              {workflow.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{workflow.version}</span>
            <Button variant="outline" size="sm" className="h-7">
              <HugeiconsIcon icon={TimeQuarterPassIcon} size={14} />
              History
            </Button>
            <Button variant="outline" size="sm" className="h-7">
              <HugeiconsIcon icon={PlayIcon} size={14} />
              Test
            </Button>
            <Button size="sm" className="h-7">
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
              setSelectedStepFocus(null)
            }}
            onOpenStepConfig={(stepId, focus) => {
              // Route notifications/visibility to the standalone settings dialog
              if (focus === "notifications" || focus === "visibility") {
                setSettingsStepId(stepId)
                setSettingsFocus(focus)
              } else {
                setSelectedStepId(stepId)
                setSelectedStepFocus(focus)
              }
            }}
            onAddStep={() => setShowAddStepDialog(true)}
            onUpdateWorkflow={setWorkflow}
          >
            <StepConfigSheet
              step={selectedStep}
              open={!!selectedStep}
              onOpenChange={(open) => {
                if (!open) {
                  setSelectedStepId(null)
                  setSelectedStepFocus(null)
                }
              }}
              onUpdate={handleUpdateStep}
              onDeleteStep={handleDeleteStep}
              initialFocus={selectedStepFocus}
            />
            <AddStepDialog
              open={showAddStepDialog}
              onOpenChange={setShowAddStepDialog}
              onSelectStepType={handleAddStep}
            />
            {settingsStep && (
              <StepSettingsDialog
                step={settingsStep}
                open={!!settingsStep}
                onOpenChange={(open) => {
                  if (!open) {
                    setSettingsStepId(null)
                    setSettingsFocus(null)
                  }
                }}
                onUpdate={handleUpdateStep}
                initialFocus={settingsFocus}
              />
            )}
          </FlowCanvas>
        </ReactFlowProvider>
      </div>
    </div>
  )
}
