"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const CORRECT_PASSWORD = "aerchain0126"
const AUTH_STORAGE_KEY = "dinoproto_auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const authStatus = sessionStorage.getItem(AUTH_STORAGE_KEY)
      setIsAuthenticated(authStatus === "true")
    }
    setIsLoading(false)
  }, [])

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, pathname, router])

  const login = React.useCallback(
    (password: string) => {
      if (password === CORRECT_PASSWORD) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(AUTH_STORAGE_KEY, "true")
        }
        setIsAuthenticated(true)
        return true
      }
      return false
    },
    []
  )

  const logout = React.useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
    }
    setIsAuthenticated(false)
    router.push("/login")
  }, [router])

  // Show loading state
  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
