"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCanvasDialogContainer } from "./flow-canvas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  ThumbsUpIcon,
  ViewIcon,
  UserAdd01Icon,
  Cancel01Icon,
  Delete02Icon,
  UserGroupIcon,
  UserIcon,
  Settings02Icon,
  Notification02Icon,
  ViewOffSlashIcon,
  Time02Icon,
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
  Mail01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import { roles } from "@/lib/mock-data"
import type { Step, StepType, AssignmentType, CompletionCriteria } from "@/lib/workflow-types"
import { cn } from "@/lib/utils"

const stepIconMap: Record<StepType, typeof Tick02Icon> = {
  approval: Tick02Icon,
  acknowledgement: ThumbsUpIcon,
  review: ViewIcon,
  assignment: UserAdd01Icon,
}

const stepLabelMap: Record<StepType, string> = {
  approval: "Approval",
  acknowledgement: "Acknowledgement",
  review: "Review",
  assignment: "Assignment",
}

type RoleItem = { value: string; label: string }

function RoleMultiSelectCombobox({
  selectedRoleIds,
  onSelectedRoleIdsChange,
  placeholder,
}: {
  selectedRoleIds: string[]
  onSelectedRoleIdsChange: (nextRoleIds: string[]) => void
  placeholder: string
}) {
  const roleItems: RoleItem[] = roles.map((r) => ({ value: r.id, label: r.name }))
  // Preserve the order of `selectedRoleIds` so chip removal maps correctly.
  const selectedRoleItems: RoleItem[] = selectedRoleIds
    .map((id) => roleItems.find((r) => r.value === id))
    .filter((r): r is RoleItem => Boolean(r))
  const [inputValue, setInputValue] = React.useState("")
  const anchor = useComboboxAnchor()

  return (
    <div className="space-y-2">
      <Combobox
        items={roleItems}
        multiple
        value={selectedRoleItems}
        inputValue={inputValue}
        onInputValueChange={(next) => setInputValue(next)}
        isItemEqualToValue={(a, b) => a?.value === b?.value}
        onValueChange={(next) => {
          const nextArray = Array.isArray(next) ? next : next ? [next] : []
          onSelectedRoleIdsChange(nextArray.map((r) => r.value))
          // Keep the combobox ready for the next selection.
          setInputValue("")
        }}
      >
        <ComboboxChips ref={anchor} className="relative pr-14">
          {selectedRoleItems.map((item) => (
            <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
          ))}
          <ComboboxChipsInput
            placeholder={selectedRoleItems.length > 0 ? "" : placeholder}
            className="min-w-24"
          />

          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                onSelectedRoleIdsChange([])
                setInputValue("")
              }}
              disabled={selectedRoleItems.length === 0 && inputValue.length === 0}
              aria-label="Clear selection"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </Button>
          </div>
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No roles found.</ComboboxEmpty>
          <ComboboxList>
            {(item: RoleItem) => (
              <ComboboxItem key={item.value} value={item}>
                <span className="truncate">{item.label}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

interface StepConfigSheetProps {
  step: Step | null | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (step: Step) => void
}

export function StepConfigSheet({
  step,
  open,
  onOpenChange,
  onUpdate,
}: StepConfigSheetProps) {
  const canvasContainer = useCanvasDialogContainer()

  if (!step) return null

  const Icon = stepIconMap[step.type]
  const stepLabel = stepLabelMap[step.type]

  const updateActors = (updates: Partial<typeof step.config.actors>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        actors: { ...step.config.actors, ...updates },
      },
    })
  }

  const updateCompletion = (updates: Partial<typeof step.config.completion>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        completion: { ...step.config.completion, ...updates },
      },
    })
  }

  type NotificationKey = keyof Step["config"]["notifications"]
  type NotificationUpdates<K extends NotificationKey> = Partial<Step["config"]["notifications"][K]>

  const updateNotifications = <K extends NotificationKey>(
    key: K,
    updates: NotificationUpdates<K>
  ) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        notifications: {
          ...step.config.notifications,
          [key]: { ...step.config.notifications[key], ...updates },
        },
      },
    })
  }

  const selectedRoles = step.config.actors.roleIds || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={canvasContainer ?? undefined}
        className={cn(
          // Keep a stable, responsive dialog size without forcing full-width.
          "w-[min(36rem,calc(100vw-2rem))] sm:max-w-none",
          // Prevent the dialog itself from exceeding the viewport.
          "max-h-[calc(100vh-2rem)]",
          // Custom layout (we manage padding per-section for safe areas).
          "p-0 gap-0 overflow-hidden"
        )}
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <DialogHeader className="pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <HugeiconsIcon icon={Icon} size={18} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle>{stepLabel}</DialogTitle>
                <DialogDescription>
                  Configure assignment, completion, notifications, and visibility.
                </DialogDescription>
              </div>
            </div>
            <Input
              value={step.name}
              onChange={(e) => onUpdate({ ...step, name: e.target.value })}
            />
          </DialogHeader>

          {/* Tabs */}
          <Tabs defaultValue="assignment" className="flex flex-1 flex-col overflow-hidden">
            <TabsList
              variant={'line'}
              className="w-full pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))]"
            >
            <TabsTrigger value="assignment" className="flex-1 flex items-center justify-center gap-1.5 py-2 data-[state=active]:bg-transparent">
              <HugeiconsIcon icon={UserGroupIcon} size={14} />
              <span>Assignment</span>
            </TabsTrigger>
            <TabsTrigger value="completion" className="flex-1 flex items-center justify-center gap-1.5 py-2 data-[state=active]:bg-transparent">
              <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} />
              <span>Completion</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 flex items-center justify-center gap-1.5 py-2 data-[state=active]:bg-transparent">
              <HugeiconsIcon icon={Notification02Icon} size={14} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="visibility" className="flex-1 flex items-center justify-center gap-1.5 py-2 data-[state=active]:bg-transparent">
              <HugeiconsIcon icon={ViewOffSlashIcon} size={14} />
              <span>Visibility</span>
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <div className="min-h-[400px] flex-1 overflow-y-auto pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-2 pb-4">
            {/* Assignment Tab */}
            <TabsContent value="assignment" className="mt-0">
              <div className="space-y-4">
              {/* Assignment Type */}
              <div>
                <h3 className="text-muted-foreground uppercase tracking-wide mb-2">
                  Assignment Type
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "roles", label: "By Role", desc: "Assign to roles", icon: UserGroupIcon },
                    { value: "specific_users", label: "Specific Users", desc: "Assign to users", icon: UserIcon },
                    { value: "dynamic", label: "Dynamic", desc: "Rule-based", icon: Settings02Icon },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateActors({ assignmentType: option.value as AssignmentType })}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border-2 p-2.5 transition-all text-center min-w-0",
                        step.config.actors.assignmentType === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className={cn(
                        "flex size-8 items-center justify-center rounded-lg shrink-0",
                        step.config.actors.assignmentType === option.value ? "bg-primary/10" : "bg-muted"
                      )}>
                        <HugeiconsIcon 
                          icon={option.icon} 
                          size={16} 
                          className={step.config.actors.assignmentType === option.value ? "text-primary" : "text-muted-foreground"} 
                        />
                      </div>
                      <div className="min-w-0 w-full">
                        <div className="font-medium truncate">{option.label}</div>
                        <div className="text-muted-foreground">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selection */}
              {step.config.actors.assignmentType === 'roles' && (
                <div>
                  <h3 className="text-muted-foreground uppercase tracking-wide mb-2">
                    Select Roles
                  </h3>
                  <RoleMultiSelectCombobox
                    selectedRoleIds={selectedRoles}
                    onSelectedRoleIdsChange={(roleIds) => updateActors({ roleIds })}
                    placeholder="Search roles…"
                  />
                </div>
              )}

              {/* Options */}
              <div>
                <h3 className="text-muted-foreground uppercase tracking-wide mb-2">
                  Options
                </h3>
                <div className="rounded-lg border">
                  <div className="flex items-center justify-between p-3 gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">Allow Reassignment</div>
                        <div className="text-muted-foreground">Can reassign</div>
                      </div>
                    </div>
                    <Switch
                      checked={step.config.actors.allowReassignment}
                      onCheckedChange={(checked) => updateActors({ allowReassignment: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
            </TabsContent>

            {/* Completion Tab */}
            <TabsContent value="completion" className="mt-0">
              <div className="space-y-4">
              {/* Completion Criteria */}
              <div>
                <h3 className="text-muted-foreground uppercase tracking-wide mb-2">
                  Completion Criteria
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "any", label: "Any Actor", desc: "Completes when any actor acts" },
                    { value: "all", label: "All Actors", desc: "Completes when all act" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateCompletion({ criteria: option.value as CompletionCriteria })}
                      className={cn(
                        "flex flex-col items-start rounded-lg border-2 p-2.5 transition-all text-left min-w-0",
                        step.config.completion.criteria === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className={cn(
                        "flex size-4 items-center justify-center rounded-full border-2 mb-1.5 shrink-0",
                        step.config.completion.criteria === option.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      )}>
                        {step.config.completion.criteria === option.value && (
                          <div className="size-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-muted-foreground mt-0.5">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeout Settings */}
              <div>
                <h3 className="text-muted-foreground uppercase tracking-wide mb-2">
                  Timeout & Escalation
                </h3>
                <div className="rounded-lg border divide-y">
                  <div className="flex items-center justify-between p-3 gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                        <HugeiconsIcon icon={Time02Icon} size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">Enable Timeout</div>
                        <div className="text-muted-foreground">Auto-escalate</div>
                      </div>
                    </div>
                    <Switch
                      checked={step.config.completion.enableTimeout}
                      onCheckedChange={(checked) => updateCompletion({ enableTimeout: checked })}
                    />
                  </div>
                  {step.config.completion.enableTimeout && (
                    <>
                      <div className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Timeout after</span>
                          <Input
                            type="number"
                            value={step.config.completion.timeoutHours || 24}
                            onChange={(e) => updateCompletion({ timeoutHours: parseInt(e.target.value) || 24 })}
                            className="w-14 text-center"
                          />
                          <span className="text-muted-foreground">hours</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Escalate to</span>
                          <select
                            className="flex-1 rounded-lg border bg-background px-2"
                            value={step.config.completion.escalateTo || ''}
                            onChange={(e) => updateCompletion({ escalateTo: e.target.value })}
                          >
                            <option value="">Select a role...</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-0">
              <div className="space-y-4">
              {/* On Entry */}
              <div>
                <h3 className="text-muted-foreground uppercase tracking-wide mb-2">
                  When Step Starts
                </h3>
                <div className="rounded-lg border divide-y">
                  <div className="flex items-center justify-between p-3 gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                        <HugeiconsIcon icon={UserMultiple02Icon} size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">Notify Actors</div>
                        <div className="text-muted-foreground">When step starts</div>
                      </div>
                    </div>
                    <Switch
                      checked={step.config.notifications.onEntry.notifyActors}
                      onCheckedChange={(checked) => updateNotifications('onEntry', { notifyActors: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                        <HugeiconsIcon icon={UserIcon} size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">Notify Requester</div>
                        <div className="text-muted-foreground">On step start</div>
                      </div>
                    </div>
                    <Switch
                      checked={step.config.notifications.onEntry.notifyRequester}
                      onCheckedChange={(checked) => updateNotifications('onEntry', { notifyRequester: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* On Completion */}
              <div>
                <h3 className="text-muted-foreground uppercase tracking-wide mb-2">
                  When Step Completes
                </h3>
                <div className="rounded-lg border divide-y">
                  <div className="flex items-center justify-between p-3 gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                        <HugeiconsIcon icon={Mail01Icon} size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">Notify Requester</div>
                        <div className="text-muted-foreground">On completion</div>
                      </div>
                    </div>
                    <Switch
                      checked={step.config.notifications.onCompletion.notifyRequester}
                      onCheckedChange={(checked) => updateNotifications('onCompletion', { notifyRequester: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">Notify Next Actors</div>
                        <div className="text-muted-foreground">Following step</div>
                      </div>
                    </div>
                    <Switch
                      checked={step.config.notifications.onCompletion.notifyNextActors}
                      onCheckedChange={(checked) => updateNotifications('onCompletion', { notifyNextActors: checked })}
                    />
                  </div>
                </div>
              </div>
              </div>
            </TabsContent>

            {/* Visibility Tab */}
            <TabsContent value="visibility" className="mt-0">
              <div className="space-y-4">
              <div>
                <h3 className="text-muted-foreground uppercase tracking-wide mb-2">
                  Who Can See This Step
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "all_participants", label: "All Participants", desc: "Everyone in workflow" },
                    { value: "specific_roles", label: "Specific Roles", desc: "Selected roles only" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onUpdate({
                        ...step,
                        config: {
                          ...step.config,
                          visibility: { ...step.config.visibility, type: option.value as 'all_participants' | 'specific_roles' },
                        },
                      })}
                      className={cn(
                        "flex flex-col items-start rounded-lg border-2 p-2.5 transition-all text-left min-w-0",
                        step.config.visibility.type === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className={cn(
                        "flex size-4 items-center justify-center rounded-full border-2 mb-1.5 shrink-0",
                        step.config.visibility.type === option.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      )}>
                        {step.config.visibility.type === option.value && (
                          <div className="size-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-muted-foreground mt-0.5">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {step.config.visibility.type === 'specific_roles' && (
                <div>
                  <h3 className="text-muted-foreground uppercase tracking-wide mb-2">
                    Select Roles With Visibility
                  </h3>
                  <RoleMultiSelectCombobox
                    selectedRoleIds={step.config.visibility.roleIds || []}
                    onSelectedRoleIdsChange={(roleIds) =>
                      onUpdate({
                        ...step,
                        config: {
                          ...step.config,
                          visibility: { ...step.config.visibility, roleIds },
                        },
                      })
                    }
                    placeholder="Search roles…"
                  />
                </div>
              )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
          <div className="flex items-center justify-between border-t bg-muted/20 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Button variant="destructive" size="sm">
              <HugeiconsIcon icon={Delete02Icon} size={12} />
              Delete Step
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
