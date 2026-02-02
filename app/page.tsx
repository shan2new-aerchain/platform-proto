"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingCart01Icon,
  Invoice01Icon,
  Building03Icon,
  File01Icon,
  WorkflowSquare10Icon,
  ArrowRight01Icon,
  InboxIcon,
  FileSearchIcon,
  MessageMultiple02Icon,
  ShoppingBasket01Icon,
  PackageIcon,
  CheckmarkBadge01Icon,
  Wallet02Icon,
  MoneyBag01Icon,
  Edit02Icon,
  UserAdd02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { apps, getWorkflowsByApp, getActiveCategories, getAppsByCategory, appCategoryMetadata } from "@/lib/mock-data"

const iconMap: Record<string, typeof ShoppingCart01Icon> = {
  ShoppingCart01Icon,
  Invoice01Icon,
  Building03Icon,
  File01Icon,
  InboxIcon,
  FileSearchIcon,
  MessageMultiple02Icon,
  ShoppingBasket01Icon,
  PackageIcon,
  CheckmarkBadge01Icon,
  Wallet02Icon,
  MoneyBag01Icon,
  Edit02Icon,
  UserAdd02Icon,
}

// Recommended app IDs (hardcoded for now)
const RECOMMENDED_APP_IDS = ['requisition', 'product', 'invoice']

// Simple fuzzy search function
function fuzzySearch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  // Direct match
  if (lowerText.includes(lowerQuery)) return true

  // Fuzzy match: check if all characters appear in order
  let textIndex = 0
  for (let i = 0; i < lowerQuery.length; i++) {
    textIndex = lowerText.indexOf(lowerQuery[i], textIndex)
    if (textIndex === -1) return false
    textIndex++
  }
  return true
}

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const activeCategories = getActiveCategories()
  const appsByCategory = getAppsByCategory()

  // Get recommended apps
  const recommendedApps = useMemo(() => {
    return apps.filter(app => RECOMMENDED_APP_IDS.includes(app.id))
  }, [])

  // Filter apps by search query
  const filteredAppsByCategory = useMemo(() => {
    if (!searchQuery.trim()) return appsByCategory

    const filtered: Record<string, typeof apps> = {}
    Object.entries(appsByCategory).forEach(([category, categoryApps]) => {
      const matchedApps = categoryApps.filter(app =>
        fuzzySearch(app.name, searchQuery) ||
        fuzzySearch(app.description, searchQuery)
      )
      if (matchedApps.length > 0) {
        filtered[category] = matchedApps
      }
    })
    return filtered
  }, [appsByCategory, searchQuery])

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return activeCategories
    return activeCategories.filter(cat => filteredAppsByCategory[cat]?.length > 0)
  }, [activeCategories, filteredAppsByCategory, searchQuery])

  const filteredRecommendedApps = useMemo(() => {
    if (!searchQuery.trim()) return recommendedApps
    return recommendedApps.filter(app =>
      fuzzySearch(app.name, searchQuery) ||
      fuzzySearch(app.description, searchQuery)
    )
  }, [recommendedApps, searchQuery])

  return (
    <div className="flex flex-col">
      <SiteHeader title="Apps" />

      <div className="p-4">
        {/* Search Bar and Stats Overview - Same Row */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative w-[200px]">
            <HugeiconsIcon
              icon={Search01Icon}
              size={14}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 h-7"
            />
          </div>

          {/* Stats Cards */}
          <div className="flex items-center gap-1.5 rounded-md border bg-card px-1.5 h-7">
            <div className="flex size-5 items-center justify-center rounded bg-primary/10">
              <HugeiconsIcon icon={WorkflowSquare10Icon} size={10} className="text-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-semibold">{apps.length}</span>
              <span className="text-[10px] text-muted-foreground">Apps</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border bg-card px-1.5 h-7">
            <div className="flex size-5 items-center justify-center rounded bg-primary/10">
              <HugeiconsIcon icon={WorkflowSquare10Icon} size={10} className="text-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-semibold">{apps.reduce((sum, app) => sum + app.workflowCount, 0)}</span>
              <span className="text-[10px] text-muted-foreground">Workflows</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border bg-card px-1.5 h-7">
            <div className="flex size-5 items-center justify-center rounded bg-emerald-500/10">
              <HugeiconsIcon icon={WorkflowSquare10Icon} size={10} className="text-emerald-600 dark:text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-semibold">6</span>
              <span className="text-[10px] text-muted-foreground">Published</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border bg-card px-1.5 h-7">
            <div className="flex size-5 items-center justify-center rounded bg-amber-500/10">
              <HugeiconsIcon icon={WorkflowSquare10Icon} size={10} className="text-amber-600 dark:text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-semibold">2</span>
              <span className="text-[10px] text-muted-foreground">Drafts</span>
            </div>
          </div>
        </div>

        {/* Recommended Apps Section */}
        {!searchQuery && filteredRecommendedApps.length > 0 && (
          <div className="mb-6">
            <div className="mb-3">
              <h2 className="text-sm font-semibold">Recommended</h2>
              <p className="text-[11px] text-muted-foreground">Popular apps to get you started</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRecommendedApps.map((app) => {
                const Icon = iconMap[app.icon] || WorkflowSquare10Icon
                const workflows = getWorkflowsByApp(app.id)
                const publishedCount = workflows.filter(w => w.status === 'published').length
                const draftCount = workflows.filter(w => w.status === 'draft').length

                return (
                  <Link key={app.id} href={`/apps/${app.id}`}>
                    <div className="group flex cursor-pointer flex-col rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm h-[160px]">
                      <div className="flex items-start justify-between">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                          <HugeiconsIcon icon={Icon} size={16} className="text-primary" />
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
                          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] px-1.5 py-0 hover:bg-emerald-500/20">
                            {publishedCount} published
                          </Badge>
                        )}
                        {draftCount > 0 && (
                          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] px-1.5 py-0 hover:bg-amber-500/20">
                            {draftCount} draft
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1 min-h-[20px]">
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
        )}

        {/* Apps Grouped by Category */}
        {filteredCategories.length > 0 ? (
          <div className="space-y-6">
            {filteredCategories.map((category) => {
              const categoryApps = filteredAppsByCategory[category]
              const categoryInfo = appCategoryMetadata[category]

              return (
                <div key={category}>
                  <div className="mb-3">
                    <h2 className="text-sm font-semibold">{categoryInfo.label}</h2>
                    <p className="text-[11px] text-muted-foreground">{categoryInfo.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryApps.map((app) => {
                      const Icon = iconMap[app.icon] || WorkflowSquare10Icon
                      const workflows = getWorkflowsByApp(app.id)
                      const publishedCount = workflows.filter(w => w.status === 'published').length
                      const draftCount = workflows.filter(w => w.status === 'draft').length

                      return (
                        <Link key={app.id} href={`/apps/${app.id}`}>
                          <div className="group flex cursor-pointer flex-col rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm h-[160px]">
                            <div className="flex items-start justify-between">
                              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                <HugeiconsIcon icon={Icon} size={16} className="text-primary" />
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
                                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] px-1.5 py-0 hover:bg-emerald-500/20">
                                  {publishedCount} published
                                </Badge>
                              )}
                              {draftCount > 0 && (
                                <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] px-1.5 py-0 hover:bg-amber-500/20">
                                  {draftCount} draft
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1 min-h-[20px]">
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
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No apps found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
