"use client"

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InboxIcon,
  ShoppingCart01Icon,
  FileSearchIcon,
  MessageMultiple02Icon,
  ShoppingBasket01Icon,
  PackageIcon,
  CheckmarkBadge01Icon,
  Invoice01Icon,
  Wallet02Icon,
  LockIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import type { PipelineStage } from "@/lib/workflow-types"
import { cn } from "@/lib/utils"
import { getWorkflowsForStage } from "@/lib/mock-data"

// Map of icon names to actual icon components
const iconMap: Record<string, typeof InboxIcon> = {
  InboxIcon,
  ShoppingCart01Icon,
  FileSearchIcon,
  MessageMultiple02Icon,
  ShoppingBasket01Icon,
  PackageIcon,
  CheckmarkBadge01Icon,
  Invoice01Icon,
  Wallet02Icon,
}


interface StageNodeProps {
  data: {
    stage: PipelineStage
    isSelected: boolean
    onClick?: (stageId: string) => void
  }
}

export const StageNode = memo(function StageNode({ data }: StageNodeProps) {
  const { stage, isSelected, onClick } = data
  const Icon = iconMap[stage.icon] || InboxIcon
  const isDisabled = stage.status === "disabled"
  const workflows = getWorkflowsForStage(stage.id)
  const workflowCount = workflows.length

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick(stage.id)
    }
  }

  const handleConfigureClick = () => {
    if (!isDisabled && onClick) {
      onClick(stage.id)
    }
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="bg-transparent! border-0! w-0! h-0!"
      />
      <div
        onClick={handleClick}
        className={cn(
          "w-[180px] rounded-lg border bg-card text-card-foreground shadow-sm transition-all overflow-hidden",
          isDisabled
            ? "opacity-50 cursor-not-allowed border-border"
            : isSelected
              ? "border-primary ring-2 ring-primary/20 shadow-md cursor-pointer"
              : "border-border hover:border-muted-foreground/30 hover:shadow-md cursor-pointer"
        )}
      >
        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Icon and name */}
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={Icon}
                size={18}
                className={isDisabled ? "text-muted-foreground" : "text-primary"}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "text-xs font-medium leading-tight truncate",
                  isDisabled && "text-muted-foreground"
                )}
              >
                {stage.name}
              </h3>
              <p className="text-[10px] text-muted-foreground truncate">
                {workflowCount} workflow{workflowCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Status indicator */}
          {isDisabled ? (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <HugeiconsIcon icon={LockIcon} size={10} />
              <span>Coming soon</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConfigureClick}
              className="flex items-center gap-1.5 text-[10px] text-primary"
            >
              <span>Configure</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={10} />
            </button>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-transparent! border-0! w-0! h-0!"
      />
    </>
  )
})
