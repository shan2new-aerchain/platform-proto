"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Tick02Icon,
  ThumbsUpIcon,
  ViewIcon,
  UserAdd01Icon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  GridIcon,
  ArrowDown02Icon,
} from "@hugeicons/core-free-icons"
import type { Step, StepType, WorkflowDefinition } from "@/lib/workflow-types"
import { roles } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const stepIconMap: Record<StepType, typeof Tick02Icon> = {
  approval: Tick02Icon,
  acknowledgement: ThumbsUpIcon,
  review: ViewIcon,
  assignment: UserAdd01Icon,
}

const stepColorMap: Record<StepType, string> = {
  approval: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20",
  acknowledgement: "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-500/20",
  review: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20",
  assignment: "bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-200 dark:border-purple-500/20",
}

interface WorkflowCanvasProps {
  workflow: WorkflowDefinition
  selectedStepId: string | null
  onSelectStep: (stepId: string | null) => void
  onAddStep: () => void
}

function StepNode({
  step,
  isSelected,
  onClick,
}: {
  step: Step
  isSelected: boolean
  onClick: () => void
}) {
  const Icon = stepIconMap[step.type]
  const colorClasses = stepColorMap[step.type]

  const assignmentLabel =
    step.config.actors.assignmentType === 'roles' && step.config.actors.roleIds
      ? step.config.actors.roleIds
          .map((id) => roles.find((r) => r.id === id)?.name || id)
          .join(', ')
      : step.config.actors.assignmentType === 'dynamic'
      ? 'Dynamic Assignment'
      : step.config.actors.assignmentType === 'specific_users'
      ? 'Specific Users'
      : 'Not configured'

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        "w-[280px] cursor-pointer rounded-xl border-2 bg-white p-4 shadow-sm",
        "transition-all hover:shadow-md",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/30"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("flex size-10 items-center justify-center rounded-lg border", colorClasses)}>
            <HugeiconsIcon icon={Icon} size={20} />
          </div>
          <div>
            <h3 className="font-medium leading-tight">{step.name}</h3>
            <p className="text-xs capitalize text-muted-foreground">{step.type}</p>
          </div>
        </div>
      </div>

      {/* Assignment Info */}
      <div className="mt-3 flex items-center gap-2">
        <Badge variant="secondary" className="text-xs font-normal">
          {assignmentLabel}
        </Badge>
        {step.config.completion.criteria === 'all' && (
          <Badge variant="secondary" className="text-xs font-normal">
            All required
          </Badge>
        )}
      </div>

      {/* Timeout & Conditions */}
      <div className="mt-2 flex flex-wrap gap-1">
        {step.config.completion.enableTimeout && step.config.completion.timeoutHours && (
          <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {step.config.completion.timeoutHours}h timeout
          </span>
        )}
        {step.config.conditions.rules.length > 0 && (
          <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {step.config.conditions.rules.length} condition{step.config.conditions.rules.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

function StartEndNode({ type }: { type: "start" | "end" }) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-full text-xs font-medium",
        type === "start"
          ? "bg-emerald-500 text-white dark:bg-emerald-600"
          : "bg-slate-500 text-white dark:bg-slate-600"
      )}
    >
      {type === "start" ? "Start" : "End"}
    </div>
  )
}

function ConnectionLine() {
  return (
    <div className="flex flex-col items-center py-2">
      <div className="h-8 w-0.5 bg-border" />
      <HugeiconsIcon icon={ArrowDown02Icon} size={16} className="text-muted-foreground" />
      <div className="h-8 w-0.5 bg-border" />
    </div>
  )
}

export function WorkflowCanvas({
  workflow,
  selectedStepId,
  onSelectStep,
  onAddStep,
}: WorkflowCanvasProps) {
  const [zoom, setZoom] = useState(80)
  const [showGrid, setShowGrid] = useState(true)

  return (
    <div className="relative flex-1 overflow-hidden bg-muted/30">
      {/* Controls */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setShowGrid(!showGrid)}
              className={showGrid ? 'bg-accent' : ''}
            >
              <HugeiconsIcon icon={GridIcon} size={14} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Grid</TooltipContent>
        </Tooltip>
        <div className="flex items-center rounded-md border bg-background">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            disabled={zoom <= 50}
          >
            <HugeiconsIcon icon={ZoomOutAreaIcon} size={14} />
          </Button>
          <span className="min-w-[3rem] text-center text-xs">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setZoom(Math.min(150, zoom + 10))}
            disabled={zoom >= 150}
          >
            <HugeiconsIcon icon={ZoomInAreaIcon} size={14} />
          </Button>
        </div>
      </div>

      {/* Canvas with Grid */}
      <div
        className={cn(
          "absolute inset-0 overflow-auto",
          showGrid && "bg-[radial-gradient(circle,_var(--tw-color-border)_1px,_transparent_1px)] bg-[length:24px_24px]"
        )}
        onClick={() => onSelectStep(null)}
      >
        <div
          className="flex min-h-full items-start justify-center p-8 pt-24"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
        >
          <div className="flex flex-col items-center">
            {/* Start Node */}
            <StartEndNode type="start" />

            {/* Steps */}
            {workflow.steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <ConnectionLine />
                <StepNode
                  step={step}
                  isSelected={selectedStepId === step.id}
                  onClick={() => onSelectStep(step.id)}
                />
                {index === workflow.steps.length - 1 && (
                  <>
                    <div className="flex flex-col items-center py-2">
                      <div className="h-4 w-0.5 bg-border" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddStep()
                      }}
                    >
                      <HugeiconsIcon icon={Add01Icon} size={14} />
                      Add Step
                    </Button>
                    <div className="flex flex-col items-center py-2">
                      <div className="h-4 w-0.5 bg-border" />
                    </div>
                  </>
                )}
              </div>
            ))}

            {workflow.steps.length === 0 && (
              <>
                <div className="flex flex-col items-center py-2">
                  <div className="h-8 w-0.5 bg-border" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddStep()
                  }}
                >
                  <HugeiconsIcon icon={Add01Icon} size={14} />
                  Add Step
                </Button>
                <div className="flex flex-col items-center py-2">
                  <div className="h-8 w-0.5 bg-border" />
                </div>
              </>
            )}

            {/* End Node */}
            <ConnectionLine />
            <StartEndNode type="end" />
          </div>
        </div>
      </div>
    </div>
  )
}
