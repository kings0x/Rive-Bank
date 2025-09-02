"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  TrendingUp,
  Copy,
  MapPin,
  Clock,
  Hash,
  DollarSign,
} from "lucide-react"
import { useState, useEffect } from "react"

interface AccountsOverviewProps {
  onSectionChange?: (section: string) => void
  onAccountSelect?: (accountId: string) => void
}

const mockAccounts = [
  {
    id: "checking",
    name: "Elite Checking",
    type: "Checking",
    balance: 3500000.0,
    accountNumber: "****8392",
  },
  {
    id: "savings",
    name: "Wealth Savings",
    type: "Savings",
    balance: 5800000.0,
    accountNumber: "****2847",
  },
  {
    id: "business",
    name: "Business Elite",
    type: "Business",
    balance: 2000000.0,
    accountNumber: "****9384",
  },
]

const mockTransactions = [
  {
    id: "1",
    description: "Corporate consultancy fee (M&A Advisory Retainer – Goldman Sachs)",
    amount: 485000,
    date: "2024-11-23",
    time: "14:32:15",
    type: "transfer",
    status: "Completed",
    reference: "WT-2024-001547",
    location: "New York, NY",
    category: "Investment",
    fee: 25.0,
    exchangeRate: null,
    notes: "Corporate consultancy fee for M&A Advisory Retainer with Goldman Sachs",
    merchant: "Goldman Sachs Group Inc.",
    accountFrom: "Goldman Sachs ****4521",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "2",
    description: "Law firm retainer payment (Baker & McKenzie LLP)",
    amount: -320000,
    date: "2025-06-03",
    time: "09:15:22",
    type: "transfer",
    status: "Completed",
    reference: "WT-2024-000892",
    location: "London, UK",
    category: "Legal",
    fee: 50.0,
    exchangeRate: null,
    notes: "Law firm retainer payment to Baker & McKenzie LLP for ongoing legal services",
    merchant: "Baker & McKenzie LLP",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Baker McKenzie ****4521",
  },
  {
    id: "3",
    description: "Quarterly dividend income (Microsoft Corp.)",
    amount: 662000,
    date: "2024-12-12",
    time: "16:45:33",
    type: "deposit",
    status: "Completed",
    reference: "DIV-2024-003421",
    location: "Redmond, WA",
    category: "Dividend",
    fee: 0,
    exchangeRate: null,
    notes: "Quarterly dividend income from Microsoft Corporation stock holdings",
    merchant: "Microsoft Corporation",
    accountFrom: "Microsoft Transfer Agent",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "4",
    description: "Legal settlement payout (Commercial contract resolution)",
    amount: -450000,
    date: "2025-01-02",
    time: "11:28:44",
    type: "transfer",
    status: "Completed",
    reference: "LS-2024-001234",
    location: "New York, NY",
    category: "Legal",
    fee: 100.0,
    exchangeRate: null,
    notes: "Legal settlement payout for commercial contract resolution dispute",
    merchant: "Settlement Authority",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Settlement Escrow ****9876",
  },
  {
    id: "5",
    description: "Rental income – Commercial property, London Mayfair",
    amount: 1200000,
    date: "2025-02-06",
    time: "13:22:11",
    type: "deposit",
    status: "Completed",
    reference: "RI-2024-000567",
    location: "London, UK",
    category: "Real Estate",
    fee: 0,
    exchangeRate: "1 GBP = $1.2547 USD",
    notes: "Monthly rental income from commercial property in London Mayfair district",
    merchant: "Mayfair Property Management",
    accountFrom: "Property Management ****7890",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "6",
    description: "Corporate travel expense – International business trip (Frankfurt & Zurich)",
    amount: -180000,
    date: "2025-08-16",
    time: "10:45:12",
    type: "transfer",
    status: "Completed",
    reference: "TR-2024-000234",
    location: "Frankfurt, Germany",
    category: "Travel",
    fee: 25.0,
    exchangeRate: "1 EUR = $1.0547 USD",
    notes: "Corporate travel expenses for international business trip to Frankfurt and Zurich",
    merchant: "Corporate Travel Services",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Travel Services ****1234",
  },
  {
    id: "7",
    description: "Stock sale proceeds (Amazon Inc. – Equity liquidation)",
    amount: 570000,
    date: "2025-01-22",
    time: "19:30:45",
    type: "deposit",
    status: "Completed",
    reference: "SS-2024-000789",
    location: "Seattle, WA",
    category: "Investment",
    fee: 75.0,
    exchangeRate: null,
    notes: "Stock sale proceeds from Amazon Inc. equity liquidation transaction",
    merchant: "Amazon Inc.",
    accountFrom: "Brokerage Account ****5678",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "8",
    description: "Quarterly corporate tax payment – HMRC",
    amount: -428000,
    date: "2025-04-22",
    time: "15:20:33",
    type: "transfer",
    status: "Completed",
    reference: "TX-2024-000456",
    location: "London, UK",
    category: "Tax",
    fee: 0,
    exchangeRate: "1 GBP = $1.2547 USD",
    notes: "Quarterly corporate tax payment to HM Revenue and Customs",
    merchant: "HM Revenue & Customs",
    accountFrom: "Elite Checking ****8392",
    accountTo: "HMRC ****7890",
  },
  {
    id: "9",
    description: "Consulting retainer received (Wealth Advisory Client – Zurich)",
    amount: 296000,
    date: "2025-03-15",
    time: "12:15:28",
    type: "deposit",
    status: "Completed",
    reference: "CR-2024-000123",
    location: "Zurich, Switzerland",
    category: "Consulting",
    fee: 0,
    exchangeRate: "1 CHF = $1.0892 USD",
    notes: "Consulting retainer received from wealth advisory client in Zurich",
    merchant: "Zurich Wealth Advisory",
    accountFrom: "Client Account ****2468",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "10",
    description: "Arbitration and court settlement fees",
    amount: -275000,
    date: "2025-07-27",
    time: "08:45:17",
    type: "transfer",
    status: "Completed",
    reference: "AS-2024-000345",
    location: "New York, NY",
    category: "Legal",
    fee: 50.0,
    exchangeRate: null,
    notes: "Arbitration and court settlement fees for commercial dispute resolution",
    merchant: "Arbitration Services Inc.",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Arbitration ****1357",
  },
  {
    id: "11",
    description: "Private equity fund distribution",
    amount: 930000,
    date: "2025-06-18",
    time: "16:30:22",
    type: "deposit",
    status: "Completed",
    reference: "PE-2024-000678",
    location: "Menlo Park, CA",
    category: "Private Equity",
    fee: 0,
    exchangeRate: null,
    notes: "Private equity fund distribution from portfolio investment returns",
    merchant: "Private Equity Fund LP",
    accountFrom: "PE Fund ****9753",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "12",
    description: "Corporate compliance & audit services (PwC Audit)",
    amount: -147000,
    date: "2025-01-30",
    time: "14:20:55",
    type: "transfer",
    status: "Completed",
    reference: "AU-2024-000890",
    location: "London, UK",
    category: "Professional Services",
    fee: 25.0,
    exchangeRate: "1 GBP = $1.2547 USD",
    notes: "Corporate compliance and audit services provided by PwC Audit division",
    merchant: "PricewaterhouseCoopers",
    accountFrom: "Elite Checking ****8392",
    accountTo: "PwC ****4682",
  },
  {
    id: "13",
    description: "IP Licensing & royalty income (Technology patents)",
    amount: 389000,
    date: "2025-04-05",
    time: "11:45:33",
    type: "deposit",
    status: "Completed",
    reference: "IP-2024-001234",
    location: "San Francisco, CA",
    category: "Intellectual Property",
    fee: 0,
    exchangeRate: null,
    notes: "IP licensing and royalty income from technology patent portfolio",
    merchant: "Tech Licensing Corp",
    accountFrom: "Licensing ****8642",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "14",
    description: "Legal research & subscriptions (LexisNexis, Westlaw Global)",
    amount: -116000,
    date: "2025-03-09",
    time: "09:30:15",
    type: "transfer",
    status: "Completed",
    reference: "LR-2024-000567",
    location: "New York, NY",
    category: "Professional Services",
    fee: 15.0,
    exchangeRate: null,
    notes: "Legal research and subscription services for LexisNexis and Westlaw Global",
    merchant: "LexisNexis Westlaw",
    accountFrom: "Elite Checking ****8392",
    accountTo: "LexisNexis ****9517",
  },
  {
    id: "15",
    description: "Real estate investment return – Commercial offices, Dubai",
    amount: 743000,
    date: "2024-12-28",
    time: "10:15:44",
    type: "deposit",
    status: "Completed",
    reference: "RE-2024-000789",
    location: "Dubai, UAE",
    category: "Real Estate",
    fee: 0,
    exchangeRate: "1 AED = $0.2722 USD",
    notes: "Real estate investment return from commercial office properties in Dubai",
    merchant: "Dubai Properties Group",
    accountFrom: "Dubai Properties ****7531",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "16",
    description: "Acquisition payment (Equity stake in tech startup)",
    amount: -520000,
    date: "2025-06-19",
    time: "14:22:33",
    type: "transfer",
    status: "Completed",
    reference: "AC-2024-000445",
    location: "Palo Alto, CA",
    category: "Investment",
    fee: 50.0,
    exchangeRate: null,
    notes: "Acquisition payment for equity stake in emerging technology startup",
    merchant: "TechStart Ventures",
    accountFrom: "Elite Checking ****8392",
    accountTo: "TechStart ****3344",
  },
  {
    id: "17",
    description: "Contract settlement income (Corporate dispute resolution)",
    amount: 850000,
    date: "2025-08-09",
    time: "16:45:12",
    type: "deposit",
    status: "Completed",
    reference: "CS-2024-000223",
    location: "London, UK",
    category: "Legal",
    fee: 0,
    exchangeRate: "1 GBP = $1.2547 USD",
    notes: "Contract settlement income from successful corporate dispute resolution",
    merchant: "Settlement Authority UK",
    accountFrom: "Settlement ****7788",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "18",
    description: "Luxury watch & jewelry purchase (Cartier, Geneva)",
    amount: -78000,
    date: "2025-04-24",
    time: "11:30:45",
    type: "purchase",
    status: "Completed",
    reference: "LX-2024-000112",
    location: "Geneva, Switzerland",
    category: "Luxury Goods",
    fee: 0,
    exchangeRate: "1 CHF = $1.0892 USD",
    notes: "Luxury watch and jewelry purchase from Cartier boutique in Geneva",
    merchant: "Cartier Geneva",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Cartier ****9900",
  },
  {
    id: "19",
    description: "Automobile dealership payment (Rolls-Royce Cullinan Black Badge)",
    amount: -575000,
    date: "2025-08-10",
    time: "13:25:33",
    type: "purchase",
    status: "Completed",
    reference: "AU-2024-000334",
    location: "Beverly Hills, CA",
    category: "Luxury Goods",
    fee: 0,
    exchangeRate: null,
    notes: "Automobile dealership payment for Rolls-Royce Cullinan Black Badge",
    merchant: "Rolls-Royce Beverly Hills",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Rolls-Royce ****5566",
  },
  {
    id: "20",
    description: "Luxury travel & hotel booking (Emirates First Class + Four Seasons Maldives)",
    amount: -24000,
    date: "2024-12-06",
    time: "15:40:22",
    type: "purchase",
    status: "Completed",
    reference: "TR-2024-000445",
    location: "Dubai, UAE",
    category: "Travel",
    fee: 0,
    exchangeRate: "1 AED = $0.2722 USD",
    notes: "Luxury travel and hotel booking for Emirates First Class and Four Seasons Maldives",
    merchant: "Emirates & Four Seasons",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Travel Booking ****7799",
  },
  {
    id: "21",
    description: "Fine dining & private event hosting (Nobu London + Catering Services)",
    amount: -12500,
    date: "2025-09-08",
    time: "19:15:44",
    type: "purchase",
    status: "Completed",
    reference: "FD-2024-000556",
    location: "London, UK",
    category: "Entertainment",
    fee: 0,
    exchangeRate: "1 GBP = $1.2547 USD",
    notes: "Fine dining and private event hosting at Nobu London with premium catering services",
    merchant: "Nobu London",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Nobu ****8811",
  },
]

export function AccountsOverview({ onSectionChange, onAccountSelect }: AccountsOverviewProps) {
  const [balancesVisible, setBalancesVisible] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<(typeof mockTransactions)[0] | null>(null)
  const [transactions, setTransactions] = useState(mockTransactions.slice(0, 8)) // Show 8 transactions initially instead of 5
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [transactionPin, setTransactionPin] = useState("")
  const [pendingDownload, setPendingDownload] = useState<(typeof mockTransactions)[0] | null>(null)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate dynamic transaction updates
      setTransactions((prev) => {
        const updated = [...prev]
        // Randomly update a transaction amount slightly (simulating real-time updates)
        const randomIndex = Math.floor(Math.random() * updated.length)
        const variation = (Math.random() - 0.5) * 1000 // Small random variation
        updated[randomIndex] = {
          ...updated[randomIndex],
          amount: updated[randomIndex].amount + variation,
        }
        return updated
      })
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const handleTransferClick = (accountId: string) => {
    // Store the selected account in localStorage for the transfer form
    localStorage.setItem("rive_selected_account", accountId)
    // Navigate to transfers section
    if (onSectionChange) {
      onSectionChange("transfers")
    }
  }

  const handleViewDetailsClick = (accountId: string) => {
    console.log(`[v0] View details clicked for account: ${accountId}`)
    if (onAccountSelect) {
      onAccountSelect(accountId)
    }
    if (onSectionChange) {
      onSectionChange("account-details")
    }
  }

  const handleTransactionClick = (transaction: (typeof mockTransactions)[0]) => {
    setSelectedTransaction(transaction)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    console.log(`[v0] Copied ${label} to clipboard: ${text}`)
    // In a real app, you'd show a toast notification
  }

  const handleViewAllTransactions = () => {
    if (!showAllTransactions) {
      setTransactions(mockTransactions) // Show all transactions
      setShowAllTransactions(true)
    } else {
      setTransactions(mockTransactions.slice(0, 8)) // Show first 8 instead of 5
      setShowAllTransactions(false)
    }
  }

  const downloadReceipt = (transaction: (typeof mockTransactions)[0]) => {
    setPendingDownload(transaction)
    setShowDownloadOptions(true)
  }

  const handleDownloadFormat = (format: "PDF" | "JPEG") => {
    setShowDownloadOptions(false)
    setShowPinDialog(true)
    if (pendingDownload) {
      ;(pendingDownload as any).downloadFormat = format
    }
  }

  const generateReceipt = (transaction: (typeof mockTransactions)[0], format: "PDF" | "JPEG") => {
    const receiptContent = `
═══════════════════════════════════════════════════════════════
                        RIVE BANKING
                   TRANSACTION RECEIPT
═══════════════════════════════════════════════════════════════

TRANSACTION SUMMARY
───────────────────────────────────────────────────────────────
Reference ID:        ${transaction.reference}
Transaction Date:    ${new Date(transaction.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
Transaction Time:    ${transaction.time} EST
Status:              ${transaction.status.toUpperCase()}

FINANCIAL DETAILS
───────────────────────────────────────────────────────────────
Description:         ${transaction.description}
Transaction Amount:  ${formatCurrency(transaction.amount)}
Transaction Fee:     ${formatCurrency(transaction.fee)}
${transaction.exchangeRate ? `Exchange Rate:      ${transaction.exchangeRate}` : ""}
Category:            ${transaction.category}
Type:                ${transaction.type.toUpperCase()}

ACCOUNT INFORMATION
───────────────────────────────────────────────────────────────
From Account:        ${transaction.accountFrom}
To Account:          ${transaction.accountTo}
Merchant:            ${transaction.merchant}
Location:            ${transaction.location}

TRANSACTION NOTES
───────────────────────────────────────────────────────────────
${transaction.notes}

SECURITY & VERIFICATION
───────────────────────────────────────────────────────────────
Receipt Generated:   ${new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    })}
Digital Signature:   ${transaction.reference.replace(/-/g, "").toUpperCase()}
Verification Code:   ${Math.random().toString(36).substr(2, 8).toUpperCase()}

═══════════════════════════════════════════════════════════════
This receipt serves as official proof of transaction completion.
For questions or disputes, contact Rive Banking at 1-800-RIVE-BANK

RIVE BANKING - Member FDIC | Equal Housing Lender
Headquarters: 200 Park Avenue, New York, NY 10166
═══════════════════════════════════════════════════════════════
    `.trim()

    return receiptContent
  }

  const handlePinVerification = () => {
    if (transactionPin.length === 4 && pendingDownload) {
      setShowPinDialog(false)
      setTransactionPin("")

      const format = (pendingDownload as any).downloadFormat || "PDF"
      const receiptContent = generateReceipt(pendingDownload, format)

      // Create and download the receipt
      const blob = new Blob([receiptContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `rive-receipt-${pendingDownload.reference}.${format.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setPendingDownload(null)
      alert(`Professional transaction receipt downloaded in ${format} format successfully!`)
    } else {
      alert("Please enter your 4-digit transaction PIN.")
    }
  }

  const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Total Balance Card */}
      <Card className="glass p-4 sm:p-6 lg:p-8 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold">Total Portfolio Value</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBalancesVisible(!balancesVisible)}
            className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] self-start sm:self-center"
          >
            {balancesVisible ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent break-all">
              {balancesVisible ? formatCurrency(totalBalance) : "••••••••"}
            </p>
            <p className="text-muted-foreground flex items-center mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-400 flex-shrink-0" />
              +12.4% this month
            </p>
          </div>
        </div>
      </Card>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {mockAccounts.map((account) => (
          <Card
            key={account.id}
            className="glass p-4 sm:p-6 lg:p-8 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 border border-emerald-500/20"
          >
            <div className="flex items-start justify-between mb-4 sm:mb-6 gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm sm:text-base lg:text-lg truncate">{account.name}</h4>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1">{account.type}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs sm:text-sm text-muted-foreground font-mono">{account.accountNumber}</p>
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-emerald-400 break-all">
                {balancesVisible ? formatCurrency(account.balance) : "••••••••"}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
                onClick={() => handleTransferClick(account.id)}
              >
                <ArrowUpRight className="w-4 h-4 mr-2 flex-shrink-0" />
                Transfer
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
                onClick={() => handleViewDetailsClick(account.id)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card className="glass p-4 sm:p-6 lg:p-8 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-4">
          <div className="flex-1">
            <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold text-emerald-400">
              Recent Transactions
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 min-h-[44px] sm:min-h-[48px] w-full sm:w-auto text-sm sm:text-base font-medium"
            onClick={handleViewAllTransactions}
          >
            {showAllTransactions ? "Show Less" : "View All"}
          </Button>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 sm:p-4 lg:p-6 rounded-lg hover:bg-emerald-500/5 transition-colors cursor-pointer border border-transparent hover:border-emerald-500/20 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] gap-3 sm:gap-4"
              onClick={() => handleTransactionClick(transaction)}
            >
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0 flex-1">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                    transaction.amount > 0 ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}
                >
                  {transaction.amount > 0 ? (
                    <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base lg:text-lg truncate">{transaction.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">{transaction.date}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">{transaction.category}</p>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`font-semibold text-sm sm:text-base lg:text-lg ${transaction.amount > 0 ? "text-emerald-400" : "text-red-400"} break-all`}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground capitalize mt-1">{transaction.type}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Enhanced Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glass max-w-xs sm:max-w-2xl lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-4">
                <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold text-emerald-400">
                  Transaction Details
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTransaction(null)}
                  className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex-shrink-0"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Transaction Header */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 p-4 sm:p-6 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedTransaction.amount > 0 ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}
                  >
                    {selectedTransaction.amount > 0 ? (
                      <ArrowDownLeft className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base sm:text-lg lg:text-xl break-words">
                      {selectedTransaction.description}
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground break-words mt-1">
                      {selectedTransaction.merchant}
                    </p>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 mt-2 text-xs sm:text-sm">
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                  <div className="text-left lg:text-right">
                    <p
                      className={`text-xl sm:text-2xl lg:text-3xl font-bold break-all ${selectedTransaction.amount > 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {selectedTransaction.amount > 0 ? "+" : ""}
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">{selectedTransaction.category}</p>
                  </div>
                </div>

                {/* Transaction Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                        <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-sm sm:text-base font-medium text-emerald-400">Reference ID</p>
                      </div>
                      <div className="flex items-center space-x-2 gap-2">
                        <p className="font-mono text-xs sm:text-sm bg-emerald-500/10 px-2 sm:px-3 py-1 sm:py-2 rounded flex-1 break-all">
                          {selectedTransaction.reference}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(selectedTransaction.reference, "Reference ID")}
                          className="text-muted-foreground hover:text-foreground min-h-[36px] min-w-[36px] flex-shrink-0"
                        >
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-sm sm:text-base font-medium text-emerald-400">Date & Time</p>
                      </div>
                      <p className="text-sm sm:text-base break-words">
                        {selectedTransaction.date} at {selectedTransaction.time}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-sm sm:text-base font-medium text-emerald-400">Location</p>
                      </div>
                      <p className="text-sm sm:text-base break-words">{selectedTransaction.location}</p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-sm sm:text-base font-medium text-emerald-400">Transaction Fee</p>
                      </div>
                      <p className="text-sm sm:text-base">{formatCurrency(selectedTransaction.fee)}</p>
                    </div>

                    {selectedTransaction.exchangeRate && (
                      <div>
                        <p className="text-sm sm:text-base font-medium text-emerald-400 mb-2 sm:mb-3">Exchange Rate</p>
                        <p className="text-xs sm:text-sm font-mono bg-emerald-500/10 px-2 sm:px-3 py-1 sm:py-2 rounded break-all">
                          {selectedTransaction.exchangeRate}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm sm:text-base font-medium text-emerald-400 mb-2 sm:mb-3">Account Transfer</p>
                      <div className="text-xs sm:text-sm space-y-2">
                        <p className="break-all">
                          <span className="text-muted-foreground">From:</span> {selectedTransaction.accountFrom}
                        </p>
                        <p className="break-all">
                          <span className="text-muted-foreground">To:</span> {selectedTransaction.accountTo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Notes */}
                <div>
                  <p className="text-sm sm:text-base font-medium text-emerald-400 mb-2 sm:mb-3">Transaction Notes</p>
                  <p className="text-sm sm:text-base text-muted-foreground bg-emerald-500/5 p-3 sm:p-4 lg:p-6 rounded-lg border border-emerald-500/20 break-words leading-relaxed">
                    {selectedTransaction.notes}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-emerald-500/20">
                  <Button
                    variant="outline"
                    className="flex-1 glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
                    onClick={() => downloadReceipt(selectedTransaction)}
                  >
                    Download Receipt
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Dialog open={showDownloadOptions} onOpenChange={setShowDownloadOptions}>
        <DialogContent className="glass-dark border-emerald-500/20 max-w-xs sm:max-w-md lg:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-emerald-400 text-base sm:text-lg lg:text-xl">
              Select Download Format
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-muted-foreground">
              Choose your preferred format for the transaction receipt:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Button
                onClick={() => handleDownloadFormat("PDF")}
                className="h-16 sm:h-20 lg:h-24 flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-sm sm:text-base"
              >
                <div className="text-base sm:text-lg lg:text-xl font-semibold">PDF</div>
                <div className="text-xs sm:text-sm opacity-80">Portable Document</div>
              </Button>
              <Button
                onClick={() => handleDownloadFormat("JPEG")}
                className="h-16 sm:h-20 lg:h-24 flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-sm sm:text-base"
              >
                <div className="text-base sm:text-lg lg:text-xl font-semibold">JPEG</div>
                <div className="text-xs sm:text-sm opacity-80">Image Format</div>
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setShowDownloadOptions(false)
                setPendingDownload(null)
              }}
              className="w-full min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PIN Verification Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="glass-dark border-emerald-500/20 max-w-xs sm:max-w-md lg:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-emerald-400 text-base sm:text-lg lg:text-xl">
              Transaction PIN Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-muted-foreground">
              Please enter your 4-digit transaction PIN to download the receipt.
            </p>
            <div>
              <Label htmlFor="transactionPin" className="text-sm sm:text-base">
                Transaction PIN
              </Label>
              <Input
                id="transactionPin"
                type="password"
                maxLength={4}
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                className="glass-dark border-emerald-500/30 text-center min-h-[44px] sm:min-h-[48px] text-lg sm:text-xl mt-2"
                placeholder="••••"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={handlePinVerification}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
              >
                Verify & Download
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPinDialog(false)
                  setTransactionPin("")
                  setPendingDownload(null)
                }}
                className="flex-1 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
