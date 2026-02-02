import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  ArrowRight01Icon,
  GitBranchIcon,
  Time02Icon,
} from "@hugeicons/core-free-icons"
import { getAppById, getWorkflowsByApp } from "@/lib/mock-data"

export default async function WorkflowsPage({
  params,
}: {
  params: Promise<{ appId: string }>
}) {
  const { appId } = await params
  const app = getAppById(appId)
  
  if (!app) {
    notFound()
  }

  const workflows = getWorkflowsByApp(appId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const displayName = (workflowName: string) => {
    const prefix = `${app.name} `
    return workflowName.startsWith(prefix) ? workflowName.slice(prefix.length) : workflowName
  }

  return (
    <div className="flex flex-col">
      <SiteHeader
        title={`${app.name} Workflows`}
        breadcrumbs={[{ label: "Apps", href: "/" }]}
        actions={
          <Button size="sm">
            <HugeiconsIcon icon={Add01Icon} size={14} />
            New Workflow
          </Button>
        }
      />

      <div className="px-4 pt-4">
        {/* Workflow Groups by Operation */}
        {(['create', 'amend', 'cancel'] as const).map((operation) => {
          const operationWorkflows = workflows.filter(
            (wf) => wf.operation === operation || (!wf.operation && operation === 'create')
          )

          if (operationWorkflows.length === 0) return null

          return (
            <div key={operation} className="mb-8">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {operation} Workflows
                </h2>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{operationWorkflows.length}</Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {operationWorkflows.map((workflow) => (
                  <Link key={workflow.id} href={`/apps/${appId}/workflows/${workflow.id}`}>
                    <div className="group flex cursor-pointer flex-col gap-2 rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
                              workflow.status === 'published'
                                ? 'bg-primary/10'
                                : 'bg-muted'
                            }`}
                          >
                            <HugeiconsIcon
                              icon={GitBranchIcon}
                              size={12}
                              className={
                                workflow.status === 'published'
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                              }
                            />
                          </div>
                          <h3 className="text-xs font-medium line-clamp-1">{displayName(workflow.name)}</h3>
                        </div>
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={14}
                          className="text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary shrink-0"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[10px] px-1.5 py-0 capitalize ${
                            workflow.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
                              : workflow.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
                              : ''
                          }`}
                          variant="secondary"
                        >
                          {workflow.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{workflow.version}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span>
                          {workflow.steps.length} step{workflow.steps.length !== 1 ? 's' : ''}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Time02Icon} size={10} />
                          {formatDate(workflow.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {workflows.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-8">
            <HugeiconsIcon icon={GitBranchIcon} size={32} className="text-muted-foreground/30" />
            <h3 className="mt-3 text-sm font-medium">No workflows yet</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your first workflow for {app.name}
            </p>
            <Button className="mt-3" size="sm">
              <HugeiconsIcon icon={Add01Icon} size={14} />
              Create Workflow
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
