"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  ThumbsUpIcon,
  ViewIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { stepDefinitions } from "@/lib/mock-data"
import type { StepType } from "@/lib/workflow-types"
import { cn } from "@/lib/utils"

const stepIconMap: Record<StepType, typeof Tick02Icon> = {
  approval: Tick02Icon,
  acknowledgement: ThumbsUpIcon,
  review: ViewIcon,
  assignment: UserAdd01Icon,
}

interface AddStepDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectStepType: (type: StepType) => void
}

export function AddStepDialog({
  open,
  onOpenChange,
  onSelectStepType,
}: AddStepDialogProps) {
  const handleSelect = (type: StepType) => {
    onSelectStepType(type)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-1">
          <DialogTitle>Add a Step</DialogTitle>
          <DialogDescription>
            Choose a step type for your workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          {stepDefinitions.map((definition) => {
            const Icon = stepIconMap[definition.type]

            return (
              <button
                key={definition.id}
                onClick={() => handleSelect(definition.type)}
                className={cn(
                  "group flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all",
                  "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary/10">
                  <HugeiconsIcon icon={Icon} size={18} className="text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium">{definition.name}</h3>
                  <p className="text-muted-foreground mt-0.5 line-clamp-2">{definition.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
