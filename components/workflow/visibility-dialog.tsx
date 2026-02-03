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
import type { Step } from "@/lib/workflow-types"
import { cn } from "@/lib/utils"
import { useCanvasDialogContainer } from "./flow-canvas"
import { RoleMultiSelectCombobox } from "./step-config-panel"

interface VisibilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: Step
  onUpdate: (step: Step) => void
}

export function VisibilityDialog({
  open,
  onOpenChange,
  step,
  onUpdate,
}: VisibilityDialogProps) {
  const canvasContainer = useCanvasDialogContainer()

  const updateVisibility = (updates: Partial<Step["config"]["visibility"]>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        visibility: { ...step.config.visibility, ...updates },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={canvasContainer ?? undefined}
        className="w-[min(36rem,calc(100vw-2rem))] sm:max-w-none max-h-[85vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Configure Visibility</DialogTitle>
          <DialogDescription>
            Control who can see this step in the workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Who Can See This Step</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "all_participants", label: "All Participants", desc: "Everyone in workflow" },
                { value: "specific_roles", label: "Specific Roles", desc: "Selected roles only" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateVisibility({ type: option.value as "all_participants" | "specific_roles" })}
                  className={cn(
                    "flex flex-col items-start rounded-lg border-2 p-2.5 transition-all text-left min-w-0",
                    step.config.visibility.type === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <div className={cn(
                    "flex size-4 items-center justify-center rounded-full border-2 mb-1.5 shrink-0",
                    step.config.visibility.type === option.value
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}>
                    {step.config.visibility.type === option.value && (
                      <div className="size-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-muted-foreground text-sm mt-0.5">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {step.config.visibility.type === "specific_roles" && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                Select Roles With Visibility
              </h4>
              <RoleMultiSelectCombobox
                selectedRoleIds={step.config.visibility.roleIds || []}
                onSelectedRoleIdsChange={(roleIds) => updateVisibility({ roleIds })}
                placeholder="Search roles…"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t shrink-0">
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
