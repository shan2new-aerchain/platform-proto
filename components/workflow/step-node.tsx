"use client"

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  ThumbsUpIcon,
  ViewIcon,
  UserAdd01Icon,
  UserGroupIcon,
  Notification02Icon,
  ViewOffSlashIcon,
  FlashIcon,
  TimeQuarterPassIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import type { Step, StepType } from "@/lib/workflow-types"
import { getStepDefinitionById, roles, users } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const stepIconMap: Record<StepType, typeof Tick02Icon> = {
  approval: Tick02Icon,
  acknowledgement: ThumbsUpIcon,
  review: ViewIcon,
  assignment: UserAdd01Icon,
}

const stepColorMap: Record<StepType, { bg: string; icon: string }> = {
  approval: { bg: "bg-chart-1/10", icon: "text-chart-1" },
  acknowledgement: { bg: "bg-chart-2/10", icon: "text-chart-2" },
  review: { bg: "bg-chart-3/10", icon: "text-chart-3" },
  assignment: { bg: "bg-chart-4/10", icon: "text-chart-4" },
}

interface StepNodeProps {
  data: {
    step: Step
    isSelected: boolean
    onOpenStepConfig?: (stepId: string, focus: import("./step-config-sheet").StepConfigFocus) => void
    onRequestDelete?: (stepId: string) => void
  }
}

export const StepNode = memo(function StepNode({ data }: StepNodeProps) {
  const { step, isSelected, onOpenStepConfig, onRequestDelete } = data
  const Icon = stepIconMap[step.type]
  const colors = stepColorMap[step.type]

  const assignmentLabel = (() => {
    if (step.config.actors.assignmentType === "roles") {
      const roleNames = (step.config.actors.roleIds || [])
        .map((id) => roles.find((r) => r.id === id)?.name || id)
        .join(", ")
      return roleNames || "No roles selected"
    }
    if (step.config.actors.assignmentType === "specific_users") {
      const userNames = (step.config.actors.userIds || [])
        .map((id) => users.find((u) => u.id === id)?.name || id)
        .join(", ")
      return userNames || "No users selected"
    }
    return step.config.actors.dynamicRules?.length ? "Dynamic rules" : "Dynamic assignment"
  })()

  const hasAssignment =
    (step.config.actors.roleIds && step.config.actors.roleIds.length > 0) ||
    (step.config.actors.userIds && step.config.actors.userIds.length > 0) ||
    (step.config.actors.dynamicRules && step.config.actors.dynamicRules.length > 0) ||
    Boolean(step.config.actors.dynamicRule)
  const hasNotifications =
    step.config.notifications.onEntry.notifyActors ||
    step.config.notifications.onEntry.notifyRequester ||
    step.config.notifications.onCompletion.notifyRequester ||
    step.config.notifications.onCompletion.notifyNextActors
  const hasVisibility = step.config.visibility.type === 'specific_roles'
  const hasTrigger =
    step.config.conditions.rules.length > 0 ||
    step.config.conditions.appliesTo.length !== 3
  const hasCompletion =
    step.config.completion.criteria === "all" || step.config.completion.enableTimeout
  const definition = getStepDefinitionById(step.definitionId)
  const actorsLabel = definition?.actorsLabel ?? "Assignees"

  return (
    <>
      <Handle type="target" position={Position.Top} className="bg-transparent! border-0! w-0! h-0!" />
      <div
        className={cn(
          "w-[200px] cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm transition-all overflow-hidden",
          isSelected
            ? "border-primary ring-2 ring-primary/20 shadow-md"
            : "border-border hover:border-muted-foreground/30 hover:shadow-md"
        )}
      >
        {/* Header */}
        <div className="p-2.5 space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={cn("flex size-5 shrink-0 items-center justify-center rounded", colors.bg)}>
                <HugeiconsIcon icon={Icon} size={11} className={colors.icon} />
              </div>
              <h3 className="text-[11px] font-medium leading-tight truncate">{step.name}</h3>
            </div>
            {onRequestDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRequestDelete(step.id)
                }}
                className="rounded p-1 text-muted-foreground/70 hover:text-destructive"
              >
                <HugeiconsIcon icon={Delete02Icon} size={12} />
                <span className="sr-only">Delete step</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground pl-7">
            <HugeiconsIcon icon={UserGroupIcon} size={9} />
            <span className="truncate">{assignmentLabel}</span>
          </div>
        </div>

        {/* Action Bar - Compact */}
        <div className="grid grid-cols-5 border-t border-border bg-muted/50 px-1 py-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenStepConfig?.(step.id, "conditions")
            }}
            className={cn(
              "flex flex-col items-center gap-0.5 px-1 py-0.5 rounded",
              hasTrigger ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <HugeiconsIcon icon={FlashIcon} size={11} />
            <span className="text-[8px]">Trigger</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenStepConfig?.(step.id, "actors")
            }}
            className={cn(
              "flex flex-col items-center gap-0.5 px-1 py-0.5 rounded",
              hasAssignment ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <HugeiconsIcon icon={UserGroupIcon} size={11} />
            <span className="text-[8px]">{actorsLabel}</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenStepConfig?.(step.id, "notifications")
            }}
            className={cn(
              "flex flex-col items-center gap-0.5 px-1 py-0.5 rounded",
              hasNotifications ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <HugeiconsIcon icon={Notification02Icon} size={11} />
            <span className="text-[8px]">Notify</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenStepConfig?.(step.id, "completion")
            }}
            className={cn(
              "flex flex-col items-center gap-0.5 px-1 py-0.5 rounded",
              hasCompletion ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <HugeiconsIcon icon={TimeQuarterPassIcon} size={11} />
            <span className="text-[8px]">Complete</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenStepConfig?.(step.id, "visibility")
            }}
            className={cn(
              "flex flex-col items-center gap-0.5 px-1 py-0.5 rounded",
              hasVisibility ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <HugeiconsIcon icon={ViewOffSlashIcon} size={11} />
            <span className="text-[8px]">Visibility</span>
          </button>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="bg-transparent! border-0! w-0! h-0!" />
    </>
  )
})
