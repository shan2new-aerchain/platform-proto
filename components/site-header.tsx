"use client"

import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Notification02Icon, Settings02Icon, UserIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
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
      
      {/* Breadcrumb navigation */}
      <nav className="flex flex-1 items-center gap-1.5 overflow-hidden">
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={index}>
            {crumb.href ? (
              <Link 
                href={crumb.href} 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground shrink-0">{crumb.label}</span>
            )}
            <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="text-muted-foreground/40 shrink-0" />
          </Fragment>
        ))}
        <span className="text-xs font-medium text-foreground truncate">{title}</span>
      </nav>

      <div className="flex items-center gap-1 shrink-0">
        {actions}
        <Separator orientation="vertical" className="mx-2 h-4" />
        <Button variant="ghost" size="icon-sm" className="h-8 w-8">
          <HugeiconsIcon icon={Notification02Icon} size={18} />
        </Button>
        <Button variant="ghost" size="icon-sm" className="h-8 w-8">
          <HugeiconsIcon icon={Settings02Icon} size={18} />
        </Button>
        <div className="ml-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
          A
        </div>
      </div>
    </header>
  )
}
