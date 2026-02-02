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
import { RuleBuilder, defaultRuleFields } from "./rule-builder"
import type { Step } from "@/lib/workflow-types"
import { useCanvasDialogContainer } from "./flow-canvas"

interface ActorsRuleBasedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: Step
  onUpdate: (step: Step) => void
}

export function ActorsRuleBasedDialog({
  open,
  onOpenChange,
  step,
  onUpdate,
}: ActorsRuleBasedDialogProps) {
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
        className="w-[min(36rem,calc(100vw-2rem))] sm:max-w-none max-h-[85vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Select by rules</DialogTitle>
          <DialogDescription>
            Define rules to dynamically assign actors for this step.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Dynamic rules</span>
            <div className="mt-2">
              <RuleBuilder
                rules={step.config.actors.dynamicRules || []}
                onRulesChange={(dynamicRules) => updateActors({ dynamicRules })}
                fields={defaultRuleFields}
                emptyState="No dynamic rules yet."
              />
            </div>
          </div>
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
