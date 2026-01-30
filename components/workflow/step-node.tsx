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
  GitCompareIcon,
  Notification02Icon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import type { Step, StepType } from "@/lib/workflow-types"
import { roles } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const stepIconMap: Record<StepType, typeof Tick02Icon> = {
  approval: Tick02Icon,
  acknowledgement: ThumbsUpIcon,
  review: ViewIcon,
  assignment: UserAdd01Icon,
}

const stepColorMap: Record<StepType, { bg: string; icon: string }> = {
  approval: { bg: "bg-amber-50", icon: "text-amber-600" },
  acknowledgement: { bg: "bg-blue-50", icon: "text-blue-600" },
  review: { bg: "bg-violet-50", icon: "text-violet-600" },
  assignment: { bg: "bg-amber-50", icon: "text-amber-600" },
}

interface StepNodeProps {
  data: {
    step: Step
    isSelected: boolean
  }
}

export const StepNode = memo(function StepNode({ data }: StepNodeProps) {
  const { step, isSelected } = data
  const Icon = stepIconMap[step.type]
  const colors = stepColorMap[step.type]

  const assignmentLabel =
    step.config.actors.assignmentType === "roles" && step.config.actors.roleIds && step.config.actors.roleIds.length > 0
      ? step.config.actors.roleIds
          .map((id) => roles.find((r) => r.id === id)?.name || id)
          .join(", ")
      : "No users / roles are added"

  const hasAssignment = step.config.actors.roleIds && step.config.actors.roleIds.length > 0
  const hasRules = step.config.conditions.rules.length > 0
  const hasNotifications = step.config.notifications.onEntry.notifyActors || step.config.notifications.onCompletion.notifyRequester
  const hasVisibility = step.config.visibility.type === 'specific_roles'

  return (
    <>
      <Handle type="target" position={Position.Top} className="bg-transparent! border-0! w-0! h-0!" />
      <div
        className={cn(
          "w-[200px] cursor-pointer rounded-lg border bg-white shadow-sm transition-all overflow-hidden",
          isSelected
            ? "border-primary ring-2 ring-primary/20 shadow-md"
            : "border-stone-200 hover:border-stone-300 hover:shadow-md"
        )}
      >
        {/* Header */}
        <div className="p-2.5 space-y-0.5">
          <div className="flex items-center gap-2">
            <div className={cn("flex size-5 shrink-0 items-center justify-center rounded", colors.bg)}>
              <HugeiconsIcon icon={Icon} size={11} className={colors.icon} />
            </div>
            <h3 className="text-[11px] font-medium leading-tight truncate">{step.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground pl-7">
            <HugeiconsIcon icon={UserGroupIcon} size={9} />
            <span className="truncate">{assignmentLabel}</span>
          </div>
        </div>

        {/* Action Bar - Compact */}
        <div className="flex items-center justify-around border-t border-stone-100 bg-stone-50/50 px-1 py-1">
          <div 
            className={cn(
              "flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded",
              hasAssignment ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <HugeiconsIcon icon={UserGroupIcon} size={11} />
            <span className="text-[8px]">Assignment</span>
          </div>
          <div 
            className={cn(
              "flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded",
              hasRules ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <HugeiconsIcon icon={GitCompareIcon} size={11} />
            <span className="text-[8px]">Rules</span>
          </div>
          <div 
            className={cn(
              "flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded",
              hasNotifications ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <HugeiconsIcon icon={Notification02Icon} size={11} />
            <span className="text-[8px]">Notify</span>
          </div>
          <div 
            className={cn(
              "flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded",
              hasVisibility ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <HugeiconsIcon icon={ViewOffSlashIcon} size={11} />
            <span className="text-[8px]">Visibility</span>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="bg-transparent! border-0! w-0! h-0!" />
    </>
  )
})
