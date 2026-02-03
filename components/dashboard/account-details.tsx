"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Eye, EyeOff, Download, Copy, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useAccountStore } from "@/store/account-store"
import { useState } from "react"

interface AccountDetailsProps {
  accountId: string | null
  onBack: () => void
}

const mockAccountsData = {
  checking: {
    id: "checking",
    name: "Elite Checking",
    type: "Checking",
    balance: 4500000.0,
    accountNumber: "4729-8392-1847-8392",
    routingNumber: "021000021",
    interestRate: 0.85,
    minimumBalance: 100000,
    openDate: "2023-03-15",
    status: "Active",
    features: ["Unlimited Transactions", "Global ATM Access", "Concierge Banking", "Priority Support"],
    monthlyChange: 12.4,
    yearlyChange: 18.7,
  },
  savings: {
    id: "savings",
    name: "Wealth Savings",
    type: "Savings",
    balance: 5800000.0,
    accountNumber: "4729-2847-9384-2847",
    routingNumber: "021000021",
    interestRate: 2.45,
    minimumBalance: 500000,
    openDate: "2023-01-10",
    status: "Active",
    features: ["High-Yield Interest", "Compound Daily", "No Monthly Fees", "Investment Advisory"],
    monthlyChange: 8.2,
    yearlyChange: 24.3,
  },
  business: {
    id: "business",
    name: "Business Elite",
    type: "Business",
    balance: 2000000,
    accountNumber: "4729-9384-7392-9384",
    routingNumber: "021000021",
    interestRate: 1.25,
    minimumBalance: 250000,
    openDate: "2023-02-20",
    status: "Active",
    features: ["Business Banking", "Corporate Cards", "Treasury Management", "Credit Lines"],
    monthlyChange: 15.6,
    yearlyChange: 32.1,
  },
}



export function AccountDetails({ accountId, onBack }: AccountDetailsProps) {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [transactionPin, setTransactionPin] = useState("")
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [pendingStatementDownload, setPendingStatementDownload] = useState(false)
  const account = accountId ? mockAccountsData[accountId as keyof typeof mockAccountsData] : null
  const userAccountState = useAccountStore((s) => s.accountDetails);

  let userAccount
  for (let i in userAccountState) {
    if (userAccountState[i].type === accountId) {
      userAccount = userAccountState[i];
    }
  }

  if (!userAccount) {
    return null;
  }

  if (!account) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Accounts
          </Button>
        </div>
        <Card className="glass p-6 sm:p-8 text-center">
          <p className="text-muted-foreground">Account not found</p>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    console.log(`[v0] Copied to clipboard: ${text}`)
  }



  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Accounts
          </Button>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-emerald-400">{userAccount.name}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account</p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 self-start sm:self-center"
        >
          {account.status}
        </Badge>
      </div>

      {/* Account Balance Card */}
      <Card className="glass p-4 sm:p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg sm:text-xl font-semibold">Current Balance</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px]"
          >
            {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 mb-2">
              {balanceVisible ? formatCurrency(userAccount.balance) : "••••••••"}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm">
              <div className="flex items-center text-emerald-400">
                <TrendingUp className="w-4 h-4 mr-1" />+{account.monthlyChange}% this month
              </div>
              <div className="flex items-center text-emerald-400">
                <TrendingUp className="w-4 h-4 mr-1" />+{account.yearlyChange}% this year
              </div>
            </div>
          </div>

        </div>
      </Card>

      {/* Account Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Account Details */}
        <Card className="glass p-4 sm:p-6">
          <h4 className="font-serif text-base sm:text-lg font-semibold mb-4 text-emerald-400">Account Information</h4>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0">
              <span className="text-muted-foreground text-sm">Account Number</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">
                  {balanceVisible ? userAccount.accountNumber : "••••-••••-••••-••••"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(userAccount.accountNumber)}
                  className="text-muted-foreground hover:text-foreground min-h-[32px] min-w-[32px]"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0">
              <span className="text-muted-foreground text-sm">Routing Number</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{account.routingNumber}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(account.routingNumber)}
                  className="text-muted-foreground hover:text-foreground min-h-[32px] min-w-[32px]"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0">
              <span className="text-muted-foreground text-sm">Interest Rate</span>
              <span className="text-emerald-400 font-semibold text-sm">{account.interestRate}% APY</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0">
              <span className="text-muted-foreground text-sm">Minimum Balance</span>
              <span className="text-sm">{formatCurrency(account.minimumBalance)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0">
              <span className="text-muted-foreground text-sm">Account Opened</span>
              <span className="text-sm">{new Date(account.openDate).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        {/* Account Features */}
        <Card className="glass p-4 sm:p-6">
          <h4 className="font-serif text-base sm:text-lg font-semibold mb-4 text-emerald-400">Account Features</h4>
          <div className="space-y-3">
            {account.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm">Transaction Notifications</span>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>
        </Card>
      </div>


    </div>
  )
}
