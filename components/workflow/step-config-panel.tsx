"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Cancel01Icon,
  Settings02Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { roles, users, getStepDefinitionById } from "@/lib/mock-data"
import type {
  AssignmentType,
  CompletionCriteria,
  Step,
  StepType,
} from "@/lib/workflow-types"
import { cn } from "@/lib/utils"
import { ActorsRuleBasedDialog } from "./actors-rule-based-dialog"
import { RuleBuilder, defaultRuleFields } from "./rule-builder"

const TAB_TRIGGER = "trigger"
const TAB_ACTORS = "actors"
const TAB_COMPLETION = "completion"

function focusToTab(
  focus: "conditions" | "actors" | "completion" | null
): string {
  if (focus === "conditions") return TAB_TRIGGER
  if (focus === "actors") return TAB_ACTORS
  if (focus === "completion") return TAB_COMPLETION
  return TAB_TRIGGER
}

type RoleItem = { value: string; label: string }
type UserItem = { value: string; label: string; meta: string }

export function RoleMultiSelectCombobox({
  selectedRoleIds,
  onSelectedRoleIdsChange,
  placeholder,
}: {
  selectedRoleIds: string[]
  onSelectedRoleIdsChange: (nextRoleIds: string[]) => void
  placeholder: string
}) {
  const roleItems: RoleItem[] = roles.map((r) => ({ value: r.id, label: r.name }))
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

export function UserMultiSelectCombobox({
  selectedUserIds,
  onSelectedUserIdsChange,
  placeholder,
}: {
  selectedUserIds: string[]
  onSelectedUserIdsChange: (nextUserIds: string[]) => void
  placeholder: string
}) {
  const userItems: UserItem[] = users.map((u) => ({
    value: u.id,
    label: u.name,
    meta: u.email,
  }))
  const selectedUserItems: UserItem[] = selectedUserIds
    .map((id) => userItems.find((u) => u.value === id))
    .filter((u): u is UserItem => Boolean(u))
  const [inputValue, setInputValue] = React.useState("")
  const anchor = useComboboxAnchor()

  return (
    <div className="space-y-2">
      <Combobox
        items={userItems}
        multiple
        value={selectedUserItems}
        inputValue={inputValue}
        onInputValueChange={(next) => setInputValue(next)}
        isItemEqualToValue={(a, b) => a?.value === b?.value}
        onValueChange={(next) => {
          const nextArray = Array.isArray(next) ? next : next ? [next] : []
          onSelectedUserIdsChange(nextArray.map((r) => r.value))
          setInputValue("")
        }}
      >
        <ComboboxChips ref={anchor} className="relative pr-14">
          {selectedUserItems.map((item) => (
            <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
          ))}
          <ComboboxChipsInput
            placeholder={selectedUserItems.length > 0 ? "" : placeholder}
            className="min-w-24"
          />

          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                onSelectedUserIdsChange([])
                setInputValue("")
              }}
              disabled={selectedUserItems.length === 0 && inputValue.length === 0}
              aria-label="Clear selection"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </Button>
          </div>
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No users found.</ComboboxEmpty>
          <ComboboxList>
            {(item: UserItem) => (
              <ComboboxItem key={item.value} value={item}>
                <span className="truncate">{item.label}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{item.meta}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

const stepLabelMapFallback: Record<StepType, { actors: string; description: string }> = {
  approval: { actors: "Approvers", description: "Who can approve this step" },
  acknowledgement: { actors: "Acknowledgers", description: "Who must acknowledge this step" },
  review: { actors: "Reviewers", description: "Who can review this step" },
  assignment: { actors: "Assignees", description: "Who can claim this step" },
}

interface StepConfigPanelProps {
  step: Step
  onUpdate: (step: Step) => void
  initialFocus?: "conditions" | "actors" | "completion" | null
}

export function StepConfigPanel({ step, onUpdate, initialFocus = null }: StepConfigPanelProps) {
  const stepDefinition = getStepDefinitionById(step.definitionId)
  const supportsCompletion = stepDefinition?.configSchema.supportsCompletion ?? true
  const supportsTimeout = stepDefinition?.configSchema.supportsTimeout ?? true

  const labels = stepDefinition
    ? { actors: stepDefinition.actorsLabel, description: stepDefinition.actorsDescription }
    : stepLabelMapFallback[step.type]

  const [activeTab, setActiveTab] = React.useState(() => focusToTab(initialFocus))
  const [ruleBasedDialogOpen, setRuleBasedDialogOpen] = React.useState(false)

  React.useEffect(() => {
    setActiveTab((prev) => (initialFocus ? focusToTab(initialFocus) : prev))
  }, [initialFocus])

  const updateActors = (updates: Partial<typeof step.config.actors>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        actors: { ...step.config.actors, ...updates },
      },
    })
  }

  const updateConditions = (updates: Partial<typeof step.config.conditions>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        conditions: { ...step.config.conditions, ...updates },
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
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList variant="line" className="w-full justify-start border-b">
        <TabsTrigger value={TAB_TRIGGER}>Trigger</TabsTrigger>
        <TabsTrigger value={TAB_ACTORS}>Actors</TabsTrigger>
        <TabsTrigger value={TAB_COMPLETION}>Completion Criteria</TabsTrigger>
      </TabsList>

      {/* Trigger — conditions */}
      <TabsContent value={TAB_TRIGGER} className="mt-4 space-y-4 focus-visible:outline-none">
        <p className="text-sm text-muted-foreground">When should this step be triggered?</p>

        <div>
          <span className="text-xs font-medium text-muted-foreground">Applies to</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["create", "amend", "cancel"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleAppliesTo(item)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors capitalize",
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
          <span className="text-xs font-medium text-muted-foreground">Conditional rules</span>
          <div className="mt-2">
            <RuleBuilder
              rules={step.config.conditions.rules}
              onRulesChange={(rules) => updateConditions({ rules })}
              fields={defaultRuleFields}
              emptyState="No rules — step always triggers."
            />
          </div>
        </div>
      </TabsContent>

      {/* Actors — who */}
      <TabsContent value={TAB_ACTORS} className="mt-4 space-y-4 focus-visible:outline-none">
        <p className="text-sm text-muted-foreground">{labels.description}</p>

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
                  if (option.value === "dynamic") setRuleBasedDialogOpen(true)
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
            <Button
              variant="outline"
              className="mt-2 w-full justify-start text-muted-foreground font-normal"
              size="sm"
              onClick={() => setRuleBasedDialogOpen(true)}
            >
              {(step.config.actors.dynamicRules?.length ?? 0) > 0
                ? `${step.config.actors.dynamicRules?.length} rule(s)`
                : "Select by rules"}
            </Button>
            {step.config.actors.dynamicRule && !(step.config.actors.dynamicRules?.length) && (
              <p className="mt-2 text-xs text-muted-foreground">
                Legacy rule: {step.config.actors.dynamicRule}
              </p>
            )}
            <ActorsRuleBasedDialog
              open={ruleBasedDialogOpen}
              onOpenChange={setRuleBasedDialogOpen}
              step={step}
              onUpdate={onUpdate}
            />
          </div>
        )}
      </TabsContent>

      {/* Completion Criteria */}
      <TabsContent value={TAB_COMPLETION} className="mt-4 space-y-4 focus-visible:outline-none">
        {!supportsCompletion ? (
          <p className="text-sm text-muted-foreground">
            Completion criteria are not supported for this step type.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">Define when this step is complete.</p>

            <div>
              <span className="text-xs font-medium text-muted-foreground">Criteria</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { value: "any", label: "Any actor", desc: "Completes when any acts" },
                  { value: "all", label: "All actors", desc: "Completes when all act" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateCompletion({ criteria: option.value as CompletionCriteria })}
                    className={cn(
                      "flex flex-col items-start rounded-lg border-2 p-2.5 transition-all text-left min-w-0",
                      step.config.completion.criteria === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full border-2 mb-1.5 shrink-0",
                        step.config.completion.criteria === option.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {step.config.completion.criteria === option.value && (
                        <div className="size-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {supportsTimeout && (
              <div className="rounded-lg border divide-y">
                <div className="flex items-center justify-between p-3 gap-3">
                  <div>
                    <span className="font-medium text-sm">Enable timeout</span>
                    <span className="ml-1.5 text-xs text-muted-foreground">Auto-escalate</span>
                  </div>
                  <Switch
                    checked={step.config.completion.enableTimeout}
                    onCheckedChange={(checked) => updateCompletion({ enableTimeout: checked })}
                  />
                </div>
                {step.config.completion.enableTimeout && (
                  <>
                    <div className="flex items-center gap-2 p-3 text-sm">
                      <span className="text-muted-foreground">Timeout after</span>
                      <Input
                        type="number"
                        value={step.config.completion.timeoutHours || 24}
                        onChange={(event) =>
                          updateCompletion({
                            timeoutHours: parseInt(event.target.value, 10) || 24,
                          })
                        }
                        className="w-16 text-center"
                      />
                      <span className="text-muted-foreground">hours</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 text-sm">
                      <span className="text-muted-foreground">Escalate to</span>
                      <select
                        className="h-8 rounded-md border border-border bg-background px-2 text-sm"
                        value={step.config.completion.escalateTo || ""}
                        onChange={(event) =>
                          updateCompletion({
                            escalateTo: event.target.value || undefined,
                          })
                        }
                      >
                        <option value="">Select role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}
