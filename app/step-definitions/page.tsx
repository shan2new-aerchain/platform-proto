import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  ThumbsUpIcon,
  ViewIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { stepDefinitions } from "@/lib/mock-data"
import type { StepType } from "@/lib/workflow-types"
import { cn } from "@/lib/utils"

const stepIconMap: Record<StepType, typeof Tick02Icon> = {
  approval: Tick02Icon,
  acknowledgement: ThumbsUpIcon,
  review: ViewIcon,
  assignment: UserAdd01Icon,
}

export default function StepDefinitionsPage() {
  return (
    <div className="flex flex-col">
      <SiteHeader title="Step Definitions" />

      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold mb-0.5">Platform Step Types</h1>
          <p className="text-muted-foreground">
            These are the foundational building blocks for workflows. Each step type
            defines specific behaviors and capabilities.
          </p>
        </div>

        {/* Step Definitions Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stepDefinitions.map((definition) => {
            const Icon = stepIconMap[definition.type]

            return (
              <div 
                key={definition.id} 
                className="flex flex-col rounded-lg border bg-card p-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <HugeiconsIcon icon={Icon} size={16} className="text-foreground" />
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium">{definition.name}</h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                  {definition.description}
                </p>
                
                {/* Default Actions */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {definition.defaultActions.map((action) => (
                    <span
                      key={action}
                      className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground capitalize"
                    >
                      {action.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {/* Capabilities */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {definition.configSchema.supportsCompletion && (
                    <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                      Completion Rules
                    </Badge>
                  )}
                  {definition.configSchema.supportsReassignment && (
                    <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                      Reassignment
                    </Badge>
                  )}
                  {definition.configSchema.supportsTimeout && (
                    <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                      Timeout
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
