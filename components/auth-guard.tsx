"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccountStore, useUserIdStore, userUserNameStore, userUserEmailStore} from "@/store/account-store"


interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const router = useRouter()
  const fetchAccountDetails = useAccountStore(s => s.fetchAccountDetails);
  const setUserId = useUserIdStore(s => s.setUserId);
  const setUserName = userUserNameStore(s => s.setUserName);
  const setUserEmail = userUserEmailStore(s => s.setUserEmail);

  useEffect(() => {
    const checkAuth = async() => {
      const response = await fetch("/api/login", { credentials: "include" });
      if(!response.ok) {
        router.push(redirectTo)
        return
      }
      const data = await response.json()
      const user = data.data
      console.log("user", user.$id)
      setUserId(user.$id)
      setUserName(user.name)
      setUserEmail(user.email)
      const userAccount = await fetchAccountDetails(user.$id)
      if (!userAccount) {
        router.push(redirectTo)
        return
      }
      console.log("zustand userAccount", userAccount)
      console.log(`logged in user:`, user)
      setIsAuthed(true)
      setIsLoading(false)
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
