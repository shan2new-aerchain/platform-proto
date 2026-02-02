"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/lib/auth-context"
import { BackgroundDots } from "@/components/ui/background-grid"

/** Context for the main content container so dialogs can portal into it and center to main content (not viewport). */
const MainContentContainerContext = React.createContext<HTMLElement | null>(null)

export function useMainContentContainer() {
  return React.useContext(MainContentContainerContext)
}

export function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [container, setContainer] = React.useState<HTMLElement | null>(null)
  const containerRef = React.useCallback((el: HTMLDivElement | null) => {
    setContainer(el)
  }, [])

  // If on login page, render without sidebar
  if (pathname === "/login") {
    return <>{children}</>
  }

  // If not authenticated, don't render the sidebar layout
  if (!isAuthenticated) {
    return null
  }

  // Render with sidebar for authenticated users
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        <BackgroundDots />
        <div ref={containerRef} className="flex flex-1 flex-col">
          <MainContentContainerContext.Provider value={container}>
            {children}
          </MainContentContainerContext.Provider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
