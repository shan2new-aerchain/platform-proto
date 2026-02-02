"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Notification02Icon,
  ViewOffSlashIcon,
  Mail01Icon,
  UserMultiple02Icon,
  UserIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import type { Step } from "@/lib/workflow-types"
import { RoleMultiSelectCombobox } from "./step-config-panel"
import { useCanvasDialogContainer } from "./flow-canvas"

interface StepSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: Step
  onUpdate: (step: Step) => void
  initialFocus?: "notifications" | "visibility" | null
}

export function StepSettingsDialog({
  open,
  onOpenChange,
  step,
  onUpdate,
  initialFocus = null,
}: StepSettingsDialogProps) {
  const canvasContainer = useCanvasDialogContainer()
  const notificationsRef = React.useRef<HTMLDivElement | null>(null)
  const visibilityRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    if (!initialFocus) return
    const target =
      initialFocus === "notifications" ? notificationsRef.current : visibilityRef.current
    if (!target) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: "start", behavior: "smooth" })
      })
    })
  }, [open, initialFocus])

  const updateNotifications = (
    section: "onEntry" | "onCompletion",
    updates: Partial<Step["config"]["notifications"][typeof section]>
  ) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        notifications: {
          ...step.config.notifications,
          [section]: {
            ...step.config.notifications[section],
            ...updates,
          },
        },
      },
    })
  }

  const updateVisibility = (updates: Partial<Step["config"]["visibility"]>) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        visibility: { ...step.config.visibility, ...updates },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={canvasContainer ?? undefined}
        className="w-[min(32rem,calc(100vw-2rem))] sm:max-w-none"
      >
        <DialogHeader>
          <DialogTitle>Step Settings</DialogTitle>
          <DialogDescription>
            Configure notifications and visibility for this step.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto space-y-6 pr-1">
          <div ref={notificationsRef}>
            <div className="flex items-center gap-2 mb-2">
              <HugeiconsIcon icon={Notification02Icon} size={16} className="text-muted-foreground" />
              <h3 className="text-muted-foreground uppercase tracking-wide">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">When Step Starts</h4>
                <div className="rounded-lg border divide-y">
                  <div className="flex items-center justify-between p-3 gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                        <HugeiconsIcon icon={UserMultiple02Icon} size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">Notify Actors</div>
                        <div className="text-muted-foreground">When the step begins</div>
                      </div>
                    </div>
                    <Switch
                      checked={step.config.notifications.onEntry.notifyActors}
                      onCheckedChange={(checked) =>
                        updateNotifications("onEntry", { notifyActors: checked })
                      }
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
                      onCheckedChange={(checked) =>
                        updateNotifications("onEntry", { notifyRequester: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">When Step Completes</h4>
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
                      onCheckedChange={(checked) =>
                        updateNotifications("onCompletion", { notifyRequester: checked })
                      }
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
                      onCheckedChange={(checked) =>
                        updateNotifications("onCompletion", { notifyNextActors: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={visibilityRef}>
            <div className="flex items-center gap-2 mb-2">
              <HugeiconsIcon icon={ViewOffSlashIcon} size={16} className="text-muted-foreground" />
              <h3 className="text-muted-foreground uppercase tracking-wide">Visibility</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Who Can See This Step</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "all_participants", label: "All Participants", desc: "Everyone in workflow" },
                    { value: "specific_roles", label: "Specific Roles", desc: "Selected roles only" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateVisibility({ type: option.value as "all_participants" | "specific_roles" })}
                      className={`flex flex-col items-start rounded-lg border-2 p-2.5 transition-all text-left min-w-0 ${
                        step.config.visibility.type === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className={`flex size-4 items-center justify-center rounded-full border-2 mb-1.5 shrink-0 ${
                        step.config.visibility.type === option.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}>
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

              {step.config.visibility.type === "specific_roles" && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    Select Roles With Visibility
                  </h4>
                  <RoleMultiSelectCombobox
                    selectedRoleIds={step.config.visibility.roleIds || []}
                    onSelectedRoleIdsChange={(roleIds) => updateVisibility({ roleIds })}
                    placeholder="Search roles…"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
