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
  Mail01Icon,
  UserMultiple02Icon,
  UserIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import type { Step } from "@/lib/workflow-types"
import { useCanvasDialogContainer } from "./flow-canvas"

interface NotificationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: Step
  onUpdate: (step: Step) => void
}

export function NotificationsDialog({
  open,
  onOpenChange,
  step,
  onUpdate,
}: NotificationsDialogProps) {
  const canvasContainer = useCanvasDialogContainer()

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={canvasContainer ?? undefined}
        className="w-[min(36rem,calc(100vw-2rem))] sm:max-w-none max-h-[85vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Configure Notifications</DialogTitle>
          <DialogDescription>
            Choose who gets notified when this step starts and completes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
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
                    <div className="text-muted-foreground text-sm">When the step begins</div>
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
                    <div className="text-muted-foreground text-sm">On step start</div>
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
                    <div className="text-muted-foreground text-sm">On completion</div>
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
                    <div className="text-muted-foreground text-sm">Following step</div>
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
