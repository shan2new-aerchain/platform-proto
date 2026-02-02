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
import { cn } from "@/lib/utils"
import { useCanvasDialogContainer } from "./flow-canvas"

interface ConditionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: Step
  onUpdate: (step: Step) => void
}

export function ConditionsDialog({
  open,
  onOpenChange,
  step,
  onUpdate,
}: ConditionsDialogProps) {
  const canvasContainer = useCanvasDialogContainer()
  const updateConditions = (updates: Partial<typeof step.config.conditions>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        conditions: { ...step.config.conditions, ...updates },
      },
    })
  }

  const toggleAppliesTo = (value: "create" | "amend" | "cancel") => {
    const current = new Set(step.config.conditions.appliesTo)
    if (current.has(value)) {
      current.delete(value)
    } else {
      current.add(value)
    }
    updateConditions({ appliesTo: Array.from(current) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={canvasContainer ?? undefined}
        className="w-[min(36rem,calc(100vw-2rem))] sm:max-w-none max-h-[85vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Configure Conditions</DialogTitle>
          <DialogDescription>
            When should this step apply?
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Applies to</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["create", "amend", "cancel"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAppliesTo(item)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    step.config.conditions.appliesTo.includes(item)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-muted-foreground/60"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-muted-foreground">Rules</span>
            <div className="mt-2">
              <RuleBuilder
                rules={step.config.conditions.rules}
                onRulesChange={(rules) => updateConditions({ rules })}
                fields={defaultRuleFields}
                emptyState="No rules for this step yet."
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
