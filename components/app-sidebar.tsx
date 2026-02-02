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
  Logout03Icon,
  PaintBrush02Icon,
  SunIcon,
  MoonIcon,
  ComputerIcon,
  ChevronUp,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <Sidebar>
      <SidebarHeader className="h-12 px-3 flex flex-row items-center justify-start">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <Image src="/logo.svg" alt="Aerchain" width={24} height={24} />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold font-brand">Workflows</span>
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
      <SidebarFooter className="border-t border-sidebar-border p-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
              <div className="size-8 rounded-full overflow-hidden shadow-sm ring-1 ring-border/50">
                <img
                  src="/gojo-avatar.jpg"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                  style={{ objectPosition: '50% 30%' }}
                />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-medium truncate">Gojo Satoru</span>
                <span className="text-[10px] text-muted-foreground truncate">gojo@aerchain.com</span>
              </div>
              <HugeiconsIcon icon={ChevronUp} size={14} className="text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full overflow-hidden shadow-sm ring-1 ring-border/50">
                  <img
                    src="/gojo-avatar.jpg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                    style={{ objectPosition: '50% 30%' }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Gojo Satoru</span>
                  <span className="text-[10px] text-muted-foreground">gojo@aerchain.com</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <HugeiconsIcon icon={Settings02Icon} size={14} />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help">
                  <HugeiconsIcon icon={HelpCircleIcon} size={14} />
                  Help
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <HugeiconsIcon icon={PaintBrush02Icon} size={14} />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
                    <DropdownMenuRadioItem value="light">
                      <HugeiconsIcon icon={SunIcon} size={14} />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <HugeiconsIcon icon={MoonIcon} size={14} />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <HugeiconsIcon icon={ComputerIcon} size={14} />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <HugeiconsIcon icon={Logout03Icon} size={14} />
              Logout
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] text-muted-foreground/60 font-normal">
              Version 5.0.0
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
