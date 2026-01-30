"use client"

import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Notification02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Fragment } from "react"

interface SiteHeaderProps {
  title: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: React.ReactNode
}

export function SiteHeader({ title, breadcrumbs = [], actions }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-10 shrink-0 items-center border-b bg-background px-2 gap-2">
      <SidebarTrigger />
      
      {/* Breadcrumb — single typography on nav so trail and current page match exactly */}
      <nav className="flex flex-1 items-center gap-1.5 overflow-hidden text-sm font-medium leading-none [&_a]:text-sm [&_a]:font-medium [&_span]:text-sm [&_span]:font-medium" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={index}>
            {crumb.href ? (
              <Link 
                href={crumb.href} 
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-muted-foreground shrink-0">{crumb.label}</span>
            )}
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-muted-foreground/40 shrink-0" />
          </Fragment>
        ))}
        <span className="text-foreground truncate shrink-0">{title}</span>
      </nav>

      <div className="flex items-center gap-1 shrink-0">
        {actions}
        <Button variant="ghost" size="icon-sm" className="h-8 w-8">
          <HugeiconsIcon icon={Notification02Icon} size={18} />
        </Button>
      </div>
    </header>
  )
}
