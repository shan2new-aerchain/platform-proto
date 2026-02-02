"use client"

import { use, useMemo, useState } from "react"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings02Icon } from "@hugeicons/core-free-icons"
import { getStepDefinitionById } from "@/lib/mock-data"
import type { Step } from "@/lib/workflow-types"
import { StepConfigPanel } from "@/components/workflow/step-config-panel"
import { StepPreviewCard } from "@/components/workflow/step-preview-card"
import { StepSettingsDialog } from "@/components/workflow/step-settings-dialog"

export default function StepDefinitionDetailPage({
  params,
}: {
  params: Promise<{ definitionId: string }>
}) {
  const { definitionId } = use(params)
  const definition = getStepDefinitionById(definitionId)

  if (!definition) {
    notFound()
  }

  const initialStep = useMemo<Step>(
    () => ({
      id: "preview-step",
      definitionId: definition.id,
      name: `${definition.name} Step`,
      type: definition.type,
      position: { x: 0, y: 0 },
      config: {
        actors: {
          assignmentType: "roles",
          roleIds: [],
          userIds: [],
          dynamicRules: [],
          allowReassignment: definition.configSchema.supportsReassignment,
        },
        completion: {
          criteria: "any",
          enableTimeout: false,
        },
        conditions: {
          appliesTo: ["create"],
          rules: [],
        },
        notifications: {
          onEntry: { notifyActors: true, notifyRequester: false },
          onCompletion: { notifyRequester: true, notifyNextActors: true },
        },
        visibility: { type: "all_participants" },
      },
    }),
    [definition]
  )

  const [step, setStep] = useState<Step>(initialStep)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <SiteHeader title="Step Definitions" />

      <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        <div className="lg:w-[320px] space-y-4">
          <div>
            <h1 className="text-lg font-semibold">{definition.name}</h1>
            <p className="text-sm text-muted-foreground">{definition.description}</p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Live Preview
            </div>
            <StepPreviewCard step={step} />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[220px]">
              <div className="text-xs font-medium text-muted-foreground mb-1">Step name</div>
              <Input
                value={step.name}
                onChange={(event) => setStep({ ...step, name: event.target.value })}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
              <HugeiconsIcon icon={Settings02Icon} size={14} />
              Settings
            </Button>
          </div>

          <StepConfigPanel step={step} onUpdate={setStep} />
        </div>
      </div>

      <StepSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        step={step}
        onUpdate={setStep}
      />
    </div>
  )
}
