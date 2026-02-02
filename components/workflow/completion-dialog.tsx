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
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { Step, CompletionCriteria } from "@/lib/workflow-types"
import { getStepDefinitionById } from "@/lib/mock-data"
import { roles } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useCanvasDialogContainer } from "./flow-canvas"

interface CompletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: Step
  onUpdate: (step: Step) => void
}

export function CompletionDialog({
  open,
  onOpenChange,
  step,
  onUpdate,
}: CompletionDialogProps) {
  const canvasContainer = useCanvasDialogContainer()
  const stepDefinition = getStepDefinitionById(step.definitionId)
  const supportsCompletion = stepDefinition?.configSchema.supportsCompletion ?? true
  const supportsTimeout = stepDefinition?.configSchema.supportsTimeout ?? true

  const updateCompletion = (updates: Partial<typeof step.config.completion>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        completion: { ...step.config.completion, ...updates },
      },
    })
  }

  if (!supportsCompletion) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          container={canvasContainer ?? undefined}
          className="w-[min(32rem,calc(100vw-2rem))] sm:max-w-none"
        >
          <DialogHeader>
            <DialogTitle>Configure Completion</DialogTitle>
            <DialogDescription>
              Completion rules are not supported for this step type.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={canvasContainer ?? undefined}
        className="w-[min(36rem,calc(100vw-2rem))] sm:max-w-none max-h-[85vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Configure Completion</DialogTitle>
          <DialogDescription>
            Define when this step is complete.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Criteria</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { value: "any", label: "Any actor", desc: "Completes when any acts" },
                { value: "all", label: "All actors", desc: "Completes when all act" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateCompletion({ criteria: option.value as CompletionCriteria })}
                  className={cn(
                    "flex flex-col items-start rounded-lg border-2 p-2.5 transition-all text-left min-w-0",
                    step.config.completion.criteria === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full border-2 mb-1.5 shrink-0",
                      step.config.completion.criteria === option.value
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {step.config.completion.criteria === option.value && (
                      <div className="size-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {supportsTimeout && (
            <div className="rounded-lg border divide-y">
              <div className="flex items-center justify-between p-3 gap-3">
                <div>
                  <span className="font-medium text-sm">Enable timeout</span>
                  <span className="ml-1.5 text-xs text-muted-foreground">Auto-escalate</span>
                </div>
                <Switch
                  checked={step.config.completion.enableTimeout}
                  onCheckedChange={(checked) => updateCompletion({ enableTimeout: checked })}
                />
              </div>
              {step.config.completion.enableTimeout && (
                <>
                  <div className="flex items-center gap-2 p-3 text-sm">
                    <span className="text-muted-foreground">Timeout after</span>
                    <Input
                      type="number"
                      value={step.config.completion.timeoutHours || 24}
                      onChange={(event) =>
                        updateCompletion({
                          timeoutHours: parseInt(event.target.value, 10) || 24,
                        })
                      }
                      className="w-16 text-center"
                    />
                    <span className="text-muted-foreground">hours</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 text-sm">
                    <span className="text-muted-foreground">Escalate to</span>
                    <select
                      className="h-8 rounded-md border border-border bg-background px-2 text-sm"
                      value={step.config.completion.escalateTo || ""}
                      onChange={(event) =>
                        updateCompletion({
                          escalateTo: event.target.value || undefined,
                        })
                      }
                    >
                      <option value="">Select role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
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
