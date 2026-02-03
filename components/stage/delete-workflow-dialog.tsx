"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import type { WorkflowDefinition } from "@/lib/workflow-types"
import { useCanvasDialogContainer } from "./stage-workflow-canvas"

interface DeleteWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflow: WorkflowDefinition
  onConfirm: () => void
}

export function DeleteWorkflowDialog({
  open,
  onOpenChange,
  workflow,
  onConfirm,
}: DeleteWorkflowDialogProps) {
  const canvasContainer = useCanvasDialogContainer()

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        size="default"
        className="max-w-sm"
        container={canvasContainer ?? undefined}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <HugeiconsIcon icon={Delete02Icon} size={20} />
            </div>
            <div>
              <AlertDialogTitle>Delete workflow</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{workflow.name}&quot;? This cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
