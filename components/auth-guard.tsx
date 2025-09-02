"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsAuthed(authenticated)
      setIsLoading(false)

      if (!authenticated) {
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) {
    return null
  }

  return <>{children}</>
}
