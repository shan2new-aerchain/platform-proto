"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  LayersLogoIcon,
  Settings02Icon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons"

const navigation = [
  {
    title: "Main",
    items: [
      {
        title: "Apps",
        url: "/",
        icon: DashboardSquare01Icon,
      },
      {
        title: "Step Definitions",
        url: "/step-definitions",
        icon: LayersLogoIcon,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings02Icon,
      },
      {
        title: "Help",
        url: "/help",
        icon: HelpCircleIcon,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="h-10 border-b border-sidebar-border px-3 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Aerchain" width={20} height={20} />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold">Workflows</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                    >
                      <Link href={item.url}>
                        <HugeiconsIcon icon={item.icon} size={14} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <span className="text-[10px] text-muted-foreground">v1.0.0</span>
      </SidebarFooter>
    </Sidebar>
  )
}
