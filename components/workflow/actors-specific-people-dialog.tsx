"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserMultiSelectCombobox } from "./step-config-panel"
import type { Step } from "@/lib/workflow-types"
import { useCanvasDialogContainer } from "./flow-canvas"

interface ActorsSpecificPeopleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: Step
  onUpdate: (step: Step) => void
}

export function ActorsSpecificPeopleDialog({
  open,
  onOpenChange,
  step,
  onUpdate,
}: ActorsSpecificPeopleDialogProps) {
  const canvasContainer = useCanvasDialogContainer()

  const updateActors = (updates: Partial<typeof step.config.actors>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        actors: { ...step.config.actors, ...updates },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={canvasContainer ?? undefined}
        className="w-[min(32rem,calc(100vw-2rem))] sm:max-w-none"
      >
        <DialogHeader>
          <DialogTitle>Pick users</DialogTitle>
          <DialogDescription>
            Choose specific people who can act on this step.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Select people</span>
            <div className="mt-2">
              <UserMultiSelectCombobox
                selectedUserIds={step.config.actors.userIds || []}
                onSelectedUserIdsChange={(userIds) => updateActors({ userIds })}
                placeholder="Search users…"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
