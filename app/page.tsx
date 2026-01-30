import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingCart01Icon,
  Invoice01Icon,
  Building03Icon,
  File01Icon,
  WorkflowSquare10Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { apps, getWorkflowsByApp } from "@/lib/mock-data"

const iconMap: Record<string, typeof ShoppingCart01Icon> = {
  ShoppingCart01Icon,
  Invoice01Icon,
  Building03Icon,
  File01Icon,
}

export default function AppsPage() {
  return (
    <div className="flex flex-col">
      <SiteHeader title="Apps" />
      
      <div className="p-4">
        {/* Stats Overview - Compact */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
            <div className="flex size-6 items-center justify-center rounded bg-primary/10">
              <HugeiconsIcon icon={WorkflowSquare10Icon} size={12} className="text-primary" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold">{apps.length}</span>
              <span className="text-[10px] text-muted-foreground">Apps</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
            <div className="flex size-6 items-center justify-center rounded bg-green-500/10">
              <HugeiconsIcon icon={WorkflowSquare10Icon} size={12} className="text-green-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold">{apps.reduce((sum, app) => sum + app.workflowCount, 0)}</span>
              <span className="text-[10px] text-muted-foreground">Workflows</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
            <div className="flex size-6 items-center justify-center rounded bg-emerald-500/10">
              <HugeiconsIcon icon={WorkflowSquare10Icon} size={12} className="text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold">6</span>
              <span className="text-[10px] text-muted-foreground">Published</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
            <div className="flex size-6 items-center justify-center rounded bg-amber-500/10">
              <HugeiconsIcon icon={WorkflowSquare10Icon} size={12} className="text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold">2</span>
              <span className="text-[10px] text-muted-foreground">Drafts</span>
            </div>
          </div>
        </div>

        {/* Apps Grid - Compact */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {apps.map((app) => {
            const Icon = iconMap[app.icon] || WorkflowSquare10Icon
            const workflows = getWorkflowsByApp(app.id)
            const publishedCount = workflows.filter(w => w.status === 'published').length
            const draftCount = workflows.filter(w => w.status === 'draft').length

            return (
              <Link key={app.id} href={`/apps/${app.id}`}>
                <div className="group flex cursor-pointer flex-col rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex size-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${app.color}15` }}
                    >
                      <HugeiconsIcon icon={Icon} size={16} style={{ color: app.color }} />
                    </div>
                    <HugeiconsIcon 
                      icon={ArrowRight01Icon} 
                      size={14} 
                      className="text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" 
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-medium">{app.name}</h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{app.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
                    </Badge>
                    {publishedCount > 0 && (
                      <Badge className="bg-green-500/10 text-green-700 text-[10px] px-1.5 py-0">
                        {publishedCount} published
                      </Badge>
                    )}
                    {draftCount > 0 && (
                      <Badge className="bg-amber-500/10 text-amber-700 text-[10px] px-1.5 py-0">
                        {draftCount} draft
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {workflows.slice(0, 3).map((wf) => (
                      <span
                        key={wf.id}
                        className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {wf.operation || 'default'}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
