"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AccountsOverview } from "@/components/dashboard/accounts-overview"
import { WireTransfers } from "@/components/dashboard/wire-transfers"
import { CryptoSection } from "@/components/dashboard/crypto-section"
import { CardsSection } from "@/components/dashboard/cards-section"
import { ProfileSecurity } from "@/components/dashboard/profile-security"
import { AccountDetails } from "@/components/dashboard/account-details"


export type DashboardSection =
  | "accounts"
  | "transfers"
  | "crypto"
  | "cards"
  | "profile"
  | "security"
  | "account-details"
  | "support"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("accounts")
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  const handleProfileSecurityTabChange = (tab: "profile" | "security") => {
    setActiveSection(tab)
  }

  const renderSection = () => {
    switch (activeSection) {
      case "accounts":
        return <AccountsOverview onSectionChange = {setActiveSection} onAccountSelect={(id: string | null) => setSelectedAccountId(id)} />
      case "transfers":
        return <WireTransfers />
      case "crypto":
        return <CryptoSection />
      case "cards":
        return <CardsSection />
      case "profile":
      case "security":
        return <ProfileSecurity activeTab={activeSection} onTabChange={handleProfileSecurityTabChange} />
      case "account-details":
        return <AccountDetails accountId={selectedAccountId} onBack={() => setActiveSection("accounts")} />
      default:
        return <AccountsOverview onSectionChange={setActiveSection} onAccountSelect={(id: string | null) => setSelectedAccountId(id)} />
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderSection()}
      </DashboardLayout>
    </AuthGuard>
  )
}
