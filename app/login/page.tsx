"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BackgroundDots } from "@/components/ui/background-grid"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      const success = login(password)
      if (success) {
        router.push("/")
      } else {
        setError("Incorrect password. Please try again.")
        setIsLoading(false)
      }
    }, 300)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <BackgroundDots />
      
      <div className="relative w-full max-w-sm z-10">
        <Card className="shadow-lg">
          <CardHeader className="space-y-3 text-center pb-4">
            <div className="flex items-center justify-center gap-3">
              <Image
                src="/logo.svg"
                alt="Platform Logo"
                width={36}
                height={36}
              />
              <CardTitle className="text-3xl font-semibold tracking-tight font-brand">
                Platform
              </CardTitle>
            </div>
            <CardDescription>
              Enter password to access the prototype
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  aria-invalid={error ? "true" : "false"}
                  className="h-8"
                />
                {error && (
                  <p className="text-[10px] text-destructive" role="alert">
                    {error}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-8"
                disabled={isLoading || !password}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
