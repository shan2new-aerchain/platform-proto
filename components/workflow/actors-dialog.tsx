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
import { Switch } from "@/components/ui/switch"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroupIcon,
  UserIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons"
import type { AssignmentType, Step } from "@/lib/workflow-types"
import { cn } from "@/lib/utils"
import { useCanvasDialogContainer } from "./flow-canvas"
import { RoleMultiSelectCombobox, UserMultiSelectCombobox } from "./step-config-panel"
import { RuleBuilder, defaultRuleFields } from "./rule-builder"
import { getStepDefinitionById } from "@/lib/mock-data"

const stepLabelMapFallback = {
  approval: { actors: "Approvers", description: "Who can approve this step" },
  acknowledgement: { actors: "Acknowledgers", description: "Who must acknowledge this step" },
  review: { actors: "Reviewers", description: "Who can review this step" },
  assignment: { actors: "Assignees", description: "Who can claim this step" },
}

interface ActorsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: Step
  onUpdate: (step: Step) => void
}

export function ActorsDialog({
  open,
  onOpenChange,
  step,
  onUpdate,
}: ActorsDialogProps) {
  const canvasContainer = useCanvasDialogContainer()

  const stepDefinition = getStepDefinitionById(step.definitionId)
  const labels = stepDefinition
    ? { actors: stepDefinition.actorsLabel, description: stepDefinition.actorsDescription }
    : stepLabelMapFallback[step.type]
  const supportsReassignment = stepDefinition?.configSchema.supportsReassignment ?? true

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
          <DialogTitle>Configure {labels.actors}</DialogTitle>
          <DialogDescription>
            {labels.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Choose by</span>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { value: "roles", label: "Role groups", desc: "Assign by role", icon: UserGroupIcon },
                { value: "specific_users", label: "Specific people", desc: "Pick users", icon: UserIcon },
                { value: "dynamic", label: "Rule based", desc: "Select by rules", icon: Settings02Icon },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateActors({ assignmentType: option.value as AssignmentType })
                  }}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-lg border-2 p-2.5 transition-all text-left min-w-0",
                    step.config.actors.assignmentType === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg shrink-0",
                      step.config.actors.assignmentType === option.value ? "bg-primary/10" : "bg-muted"
                    )}
                  >
                    <HugeiconsIcon
                      icon={option.icon}
                      size={16}
                      className={
                        step.config.actors.assignmentType === option.value
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                  </div>
                  <div className="min-w-0 w-full">
                    <div className="font-medium truncate">{option.label}</div>
                    <div className="text-muted-foreground text-xs">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {step.config.actors.assignmentType === "roles" && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Select roles</span>
              <div className="mt-2">
                <RoleMultiSelectCombobox
                  selectedRoleIds={step.config.actors.roleIds || []}
                  onSelectedRoleIdsChange={(roleIds) => updateActors({ roleIds })}
                  placeholder="Search roles…"
                />
              </div>
            </div>
          )}

          {step.config.actors.assignmentType === "specific_users" && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Select people</span>
              <div className="mt-2">
                <UserMultiSelectCombobox
                  selectedUserIds={step.config.actors.userIds || []}
                  onSelectedUserIdsChange={(userIds) => updateActors({ userIds })}
                  placeholder="Search users…"
                />
              </div>
            </div>
          )}

          {step.config.actors.assignmentType === "dynamic" && (
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
              {step.config.actors.dynamicRule && !(step.config.actors.dynamicRules?.length) && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Legacy rule: {step.config.actors.dynamicRule}
                </p>
              )}
            </div>
          )}

          {supportsReassignment && (
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium">Allow reassignment</span>
                  <p className="text-xs text-muted-foreground">
                    Enable reassignment for this step
                  </p>
                </div>
                <Switch
                  checked={step.config.actors.allowReassignment}
                  onCheckedChange={(checked) =>
                    updateActors({
                      allowReassignment: checked,
                      reassignmentType: checked ? "roles" : undefined,
                    })
                  }
                />
              </div>
              {step.config.actors.allowReassignment && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Reassign to roles
                  </span>
                  <div className="mt-2">
                    <RoleMultiSelectCombobox
                      selectedRoleIds={step.config.actors.reassignmentRoleIds || []}
                      onSelectedRoleIdsChange={(roleIds) =>
                        updateActors({ reassignmentRoleIds: roleIds, reassignmentType: "roles" })
                      }
                      placeholder="Search roles…"
                    />
                  </div>
                </div>
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
