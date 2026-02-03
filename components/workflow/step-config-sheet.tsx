"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  ThumbsUpIcon,
  ViewIcon,
  UserAdd01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { getStepDefinitionById } from "@/lib/mock-data"
import type { Step, StepType } from "@/lib/workflow-types"
import { cn } from "@/lib/utils"
import { StepConfigPanel } from "./step-config-panel"
import { DeleteStepDialog } from "./delete-step-dialog"
import { useCanvasDialogContainer } from "./flow-canvas"

export type StepConfigFocus =
  | "actors"
  | "conditions"
  | "completion"
  | "notifications"
  | "visibility"
  | null

const stepIconMap: Record<StepType, typeof Tick02Icon> = {
  approval: Tick02Icon,
  acknowledgement: ThumbsUpIcon,
  review: ViewIcon,
  assignment: UserAdd01Icon,
}

const stepLabelMap: Record<StepType, string> = {
  approval: "Approval",
  acknowledgement: "Acknowledgement",
  review: "Review",
  assignment: "Assignment",
}

interface StepConfigSheetProps {
  step: Step | null | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (step: Step) => void
  onDeleteStep?: (stepId: string) => void
  initialFocus?: StepConfigFocus
}

export function StepConfigSheet({
  step,
  open,
  onOpenChange,
  onUpdate,
  onDeleteStep,
  initialFocus = null,
}: StepConfigSheetProps) {
  const canvasContainer = useCanvasDialogContainer()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  if (!step) return null

  const Icon = stepIconMap[step.type]
  const stepLabel = stepLabelMap[step.type]
  const definition = getStepDefinitionById(step.definitionId)
  const actorLabel = definition?.actorsLabel ?? "Assignees"

  const headerTitle =
    initialFocus === "conditions"
      ? "Configure Trigger"
      : initialFocus === "actors"
      ? `Configure ${actorLabel}`
      : initialFocus === "completion"
      ? "Configure Completion"
      : stepLabel

  const headerDescription =
    initialFocus === "conditions" || initialFocus === "actors" || initialFocus === "completion"
      ? "Adjust settings for this step."
      : "Trigger, actors, and completion criteria."

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={canvasContainer ?? undefined}
        className={cn(
          "w-[min(36rem,calc(100vw-2rem))] sm:max-w-none",
          "max-h-[calc(100vh-2rem)]",
          "p-0 gap-0 overflow-hidden"
        )}
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <DialogHeader className="pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <HugeiconsIcon icon={Icon} size={18} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle>{headerTitle}</DialogTitle>
                <DialogDescription>
                  {headerDescription}
                </DialogDescription>
              </div>
            </div>
            <Input
              value={step.name}
              onChange={(event) => onUpdate({ ...step, name: event.target.value })}
            />
          </DialogHeader>

          {/* Content */}
          <div className="min-h-[280px] flex-1 overflow-y-auto pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-2 pb-4">
            <StepConfigPanel
              step={step}
              onUpdate={onUpdate}
              initialFocus={
                initialFocus === "actors" || initialFocus === "completion" || initialFocus === "conditions"
                  ? initialFocus
                  : null
              }
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-muted/20 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={12} />
              Delete Step
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
        <DeleteStepDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          step={step}
          onConfirm={() => {
            onDeleteStep?.(step.id)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
