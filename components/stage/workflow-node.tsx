"use client"

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons"
import type { WorkflowDefinition } from "@/lib/workflow-types"
import { cn } from "@/lib/utils"

interface WorkflowNodeProps {
  data: {
    workflow: WorkflowDefinition
    isSelected: boolean
    onClick?: (workflowId: string) => void
    onDelete?: (workflowId: string) => void
  }
}

export const WorkflowNode = memo(function WorkflowNode({ data }: WorkflowNodeProps) {
  const { workflow, isSelected, onClick, onDelete } = data
  const stepCount = workflow.steps.length

  const handleClick = () => {
    onClick?.(workflow.id)
  }

  const handleDelete = () => {
    onDelete?.(workflow.id)
  }

  const statusColors = {
    published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    draft: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    archived: "bg-muted text-muted-foreground",
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
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            handleClick()
          }
        }}
        role="button"
        tabIndex={0}
        className={cn(
          "w-[260px] cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm transition-all overflow-hidden",
          isSelected
            ? "border-primary ring-2 ring-primary/20 shadow-md"
            : "border-border hover:border-muted-foreground/30 hover:shadow-md"
        )}
      >
        {/* Header with workflow name */}
        <div className="p-3 space-y-2">
          <div className="flex items-start gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={Layers01Icon}
                size={16}
                className="text-primary"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-xs font-medium leading-tight line-clamp-2"
                title={workflow.name}
              >
                {workflow.name}
              </h3>
              <p
                className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5"
                title={workflow.description}
              >
                {workflow.description}
              </p>
            </div>
          </div>

          {/* Metadata row */}
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full capitalize",
                  statusColors[workflow.status]
                )}
              >
                {workflow.status}
              </span>
              <span className="text-muted-foreground">{workflow.version}</span>
            </div>
            <span className="text-muted-foreground">
              {stepCount} step{stepCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Footer action */}
        <div className="border-t border-border bg-muted/50 px-3 py-2">
          <div className="flex items-center justify-end gap-2 text-[10px]">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                handleClick()
              }}
              className="flex items-center gap-1 text-primary"
            >
              <span>Edit</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={10} />
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  handleDelete()
                }}
                className="text-destructive"
              >
                Delete
              </button>
            )}
          </div>
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
