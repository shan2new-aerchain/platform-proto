"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  GitCompareIcon,
  Notification02Icon,
  Tick02Icon,
  ThumbsUpIcon,
  UserAdd01Icon,
  UserGroupIcon,
  ViewIcon,
  ViewOffSlashIcon,
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

const getAssignmentLabel = (step: Step) => {
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
}

export function StepPreviewCard({ step }: { step: Step }) {
  const Icon = stepIconMap[step.type]
  const colors = stepColorMap[step.type]

  const assignmentLabel = getAssignmentLabel(step)
  const hasAssignment =
    (step.config.actors.roleIds && step.config.actors.roleIds.length > 0) ||
    (step.config.actors.userIds && step.config.actors.userIds.length > 0) ||
    (step.config.actors.dynamicRules && step.config.actors.dynamicRules.length > 0)
  const hasRules = step.config.conditions.rules.length > 0
  const hasNotifications =
    step.config.notifications.onEntry.notifyActors ||
    step.config.notifications.onCompletion.notifyRequester
  const hasVisibility = step.config.visibility.type === "specific_roles"
  const definition = getStepDefinitionById(step.definitionId)
  const actorsLabel = definition?.actorsLabel ?? "Assignees"

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-2">
          <div className={cn("flex size-6 shrink-0 items-center justify-center rounded", colors.bg)}>
            <HugeiconsIcon icon={Icon} size={12} className={colors.icon} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{step.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{step.type}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground pl-8">
          <HugeiconsIcon icon={UserGroupIcon} size={10} />
          <span className="truncate">{assignmentLabel}</span>
        </div>
      </div>

      <div className="flex items-center justify-around border-t border-border bg-muted/40 px-2 py-1.5">
        <div
          className={cn(
            "flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded",
            hasAssignment ? "text-primary" : "text-muted-foreground/60"
          )}
        >
          <HugeiconsIcon icon={UserGroupIcon} size={12} />
          <span className="text-[9px]">{actorsLabel}</span>
        </div>
        <div
          className={cn(
            "flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded",
            hasRules ? "text-primary" : "text-muted-foreground/60"
          )}
        >
          <HugeiconsIcon icon={GitCompareIcon} size={12} />
          <span className="text-[9px]">Conditions</span>
        </div>
        <div
          className={cn(
            "flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded",
            hasNotifications ? "text-primary" : "text-muted-foreground/60"
          )}
        >
          <HugeiconsIcon icon={Notification02Icon} size={12} />
          <span className="text-[9px]">Notify</span>
        </div>
        <div
          className={cn(
            "flex flex-col items-center gap-0.5 px-1.5 py-0.5 rounded",
            hasVisibility ? "text-primary" : "text-muted-foreground/60"
          )}
        >
          <HugeiconsIcon icon={ViewOffSlashIcon} size={12} />
          <span className="text-[9px]">Visibility</span>
        </div>
      </div>
    </div>
  )
}
