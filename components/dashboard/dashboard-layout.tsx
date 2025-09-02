"use client"

import type React from "react"
import { getCurrentUser, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import type { DashboardSection } from "@/app/dashboard/page"
import { Home, ArrowUpDown, Bitcoin, CreditCard, User, Shield, LogOut, Menu, X, Crown, Headphones } from "lucide-react"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeSection: DashboardSection
  onSectionChange: (section: DashboardSection) => void
}

const navigationItems = [
  { key: "accounts" as DashboardSection, label: "Accounts", icon: Home },
  { key: "transfers" as DashboardSection, label: "Wire Transfers", icon: ArrowUpDown },
  { key: "crypto" as DashboardSection, label: "Crypto Wallet", icon: Bitcoin },
  { key: "cards" as DashboardSection, label: "Cards", icon: CreditCard },
  { key: "profile" as DashboardSection, label: "Profile", icon: User },
  { key: "security" as DashboardSection, label: "Security", icon: Shield },
  { key: "support" as DashboardSection, label: "Customer Support", icon: Headphones },
]

export function DashboardLayout({ children, activeSection, onSectionChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-40 sm:h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-full max-w-xs sm:max-w-sm md:w-64 lg:w-72 xl:w-80 glass-dark border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="font-serif text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-primary truncate">
                  RIVE
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">Elite Banking Portal</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 md:p-5 overflow-y-auto">
            <div className="space-y-1 sm:space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.key

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onSectionChange(item.key)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center px-3 sm:px-4 py-3 sm:py-3.5 md:py-4 rounded-lg transition-all duration-200 text-sm sm:text-base min-h-[48px] sm:min-h-[52px] group ${
                      isActive
                        ? "bg-primary/20 text-primary neon-glow-subtle border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                    <span className="truncate font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* User info and logout */}
          <div className="p-3 sm:p-4 md:p-5 border-t border-white/10 flex-shrink-0">
            {user && (
              <div className="mb-4 sm:mb-5">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium truncate">{user.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.membershipTier} Member</p>
                  </div>
                </div>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full glass-dark bg-transparent border-destructive/50 text-destructive hover:bg-destructive/10 text-sm sm:text-base min-h-[48px] sm:min-h-[52px] transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2 sm:mr-3" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 lg:ml-72 xl:ml-80 transition-all duration-300">
        {/* Top bar */}
        <header className="glass-dark border-b border-white/10 p-3 sm:p-4 md:p-5 lg:p-6 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-muted-foreground hover:text-foreground mr-3 sm:mr-4 p-2 rounded-md hover:bg-white/5 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold truncate">
                  {navigationItems.find((item) => item.key === activeSection)?.label}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate mt-0.5">
                  Welcome back, {user?.name || "Elite Member"}
                </p>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
                <div className="text-right hidden lg:block">
                  <p className="text-sm md:text-base font-medium truncate max-w-[150px] xl:max-w-[200px]">
                    {user.email}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Account: {user.accountNumber}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary rounded-full flex items-center justify-center neon-glow flex-shrink-0 transition-transform hover:scale-105">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 max-w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
