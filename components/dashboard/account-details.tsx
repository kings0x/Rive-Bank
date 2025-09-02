"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Eye, EyeOff, Download, Copy, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"
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
    balance: 3500000.0,
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
    balance: 2000000.0,
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

const mockDetailedTransactions = [
  {
    id: "1",
    description: "Wire Transfer to Goldman Sachs",
    amount: -2500000,
    date: "2024-12-28",
    time: "14:32:15",
    type: "transfer",
    status: "Completed",
    reference: "WT-2024-001547",
    location: "New York, NY",
    category: "Investment",
    fee: 25.0,
    exchangeRate: null,
    notes: "Quarterly investment allocation to Goldman Sachs Private Wealth Management",
    merchant: "Goldman Sachs Group Inc.",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Goldman Sachs ****4521",
  },
  {
    id: "2",
    description: "Investment Dividend - Apple Inc.",
    amount: 1200000,
    date: "2024-12-25",
    time: "09:15:22",
    type: "deposit",
    status: "Completed",
    reference: "DIV-2024-000892",
    location: "Cupertino, CA",
    category: "Dividend",
    fee: 0,
    exchangeRate: null,
    notes: "Quarterly dividend payment from Apple Inc. common stock holdings",
    merchant: "Apple Inc.",
    accountFrom: "Apple Inc. Transfer Agent",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "3",
    description: "Real Estate Transaction - Manhattan Property",
    amount: -8500000,
    date: "2024-12-20",
    time: "16:45:33",
    type: "transfer",
    status: "Completed",
    reference: "RE-2024-003421",
    location: "New York, NY",
    category: "Real Estate",
    fee: 150.0,
    exchangeRate: null,
    notes: "Purchase of luxury penthouse apartment at 432 Park Avenue, Manhattan",
    merchant: "Macklowe Properties",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Escrow Account ****9876",
  },
  {
    id: "4",
    description: "Crypto Portfolio Liquidation - Bitcoin",
    amount: 4200000,
    date: "2024-12-18",
    time: "11:28:44",
    type: "deposit",
    status: "Completed",
    reference: "CRY-2024-001234",
    location: "Digital Asset Exchange",
    category: "Cryptocurrency",
    fee: 2100.0,
    exchangeRate: "1 BTC = $98,547.32 USD",
    notes: "Liquidation of 42.65 Bitcoin holdings through institutional exchange",
    merchant: "Coinbase Prime",
    accountFrom: "Coinbase Prime Custody",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "5",
    description: "Private Equity Distribution - Sequoia Capital",
    amount: 3100000,
    date: "2024-12-15",
    time: "13:22:11",
    type: "deposit",
    status: "Completed",
    reference: "PE-2024-000567",
    location: "Menlo Park, CA",
    category: "Private Equity",
    fee: 0,
    exchangeRate: null,
    notes: "Annual distribution from Sequoia Capital Fund XIV investment",
    merchant: "Sequoia Capital",
    accountFrom: "Sequoia Capital Fund XIV",
    accountTo: "Elite Checking ****8392",
  },
  {
    id: "6",
    description: "Hedge Fund Withdrawal - Bridgewater Associates",
    amount: -1800000,
    date: "2024-12-12",
    time: "10:45:12",
    type: "transfer",
    status: "Completed",
    reference: "HF-2024-000234",
    location: "Westport, CT",
    category: "Investment",
    fee: 50.0,
    exchangeRate: null,
    notes: "Partial withdrawal from Bridgewater Pure Alpha Fund II",
    merchant: "Bridgewater Associates",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Bridgewater Fund ****1234",
  },
  {
    id: "7",
    description: "Art Auction Purchase - Sotheby's",
    amount: -5200000,
    date: "2024-12-08",
    time: "19:30:45",
    type: "transfer",
    status: "Completed",
    reference: "ART-2024-000789",
    location: "London, UK",
    category: "Art & Collectibles",
    fee: 75.0,
    exchangeRate: "1 GBP = $1.2547 USD",
    notes: "Purchase of Monet's Water Lilies painting at evening auction",
    merchant: "Sotheby's Auction House",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Sotheby's Escrow ****5678",
  },
  {
    id: "8",
    description: "Luxury Car Purchase - Ferrari",
    amount: -850000,
    date: "2024-12-05",
    time: "15:20:33",
    type: "transfer",
    status: "Completed",
    reference: "LUX-2024-000456",
    location: "Beverly Hills, CA",
    category: "Luxury Goods",
    fee: 0,
    exchangeRate: null,
    notes: "Purchase of 2025 Ferrari SF90 Stradale Spider",
    merchant: "Ferrari of Beverly Hills",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Ferrari Finance ****7890",
  },
  {
    id: "9",
    description: "Yacht Charter Payment - Monaco",
    amount: -750000,
    date: "2024-12-02",
    time: "12:15:28",
    type: "transfer",
    status: "Completed",
    reference: "YCH-2024-000123",
    location: "Monaco",
    category: "Travel & Leisure",
    fee: 100.0,
    exchangeRate: "1 EUR = $1.0547 USD",
    notes: "Three-month charter of 180ft superyacht 'Serenity'",
    merchant: "Monaco Yacht Charters",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Monaco Charters ****2468",
  },
  {
    id: "10",
    description: "Private Jet Fuel & Maintenance",
    amount: -185000,
    date: "2024-11-28",
    time: "08:45:17",
    type: "transfer",
    status: "Completed",
    reference: "JET-2024-000345",
    location: "Teterboro, NJ",
    category: "Aviation",
    fee: 0,
    exchangeRate: null,
    notes: "Monthly fuel and maintenance for Gulfstream G650ER",
    merchant: "Signature Flight Support",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Signature Aviation ****1357",
  },
  {
    id: "11",
    description: "Wine Collection Purchase - Bordeaux",
    amount: -420000,
    date: "2024-11-25",
    time: "16:30:22",
    type: "transfer",
    status: "Completed",
    reference: "WIN-2024-000678",
    location: "Bordeaux, France",
    category: "Collectibles",
    fee: 25.0,
    exchangeRate: "1 EUR = $1.0547 USD",
    notes: "Acquisition of rare 1982 Château Pétrus vintage collection",
    merchant: "Bordeaux Wine Merchants",
    accountFrom: "Elite Checking ****8392",
    accountTo: "BWM Escrow ****9753",
  },
  {
    id: "12",
    description: "Charitable Donation - Gates Foundation",
    amount: -2000000,
    date: "2024-11-22",
    time: "14:20:55",
    type: "transfer",
    status: "Completed",
    reference: "DON-2024-000890",
    location: "Seattle, WA",
    category: "Charity",
    fee: 0,
    exchangeRate: null,
    notes: "Annual charitable contribution to global health initiatives",
    merchant: "Bill & Melinda Gates Foundation",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Gates Foundation ****4682",
  },
  {
    id: "13",
    description: "Tech Startup Investment - Series A",
    amount: -3500000,
    date: "2024-11-18",
    time: "11:45:33",
    type: "transfer",
    status: "Completed",
    reference: "INV-2024-001234",
    location: "Palo Alto, CA",
    category: "Investment",
    fee: 0,
    exchangeRate: null,
    notes: "Series A investment in quantum computing startup",
    merchant: "QuantumTech Ventures",
    accountFrom: "Elite Checking ****8392",
    accountTo: "QuantumTech Escrow ****8642",
  },
  {
    id: "14",
    description: "Luxury Hotel Chain Investment",
    amount: -7500000,
    date: "2024-11-15",
    time: "09:30:15",
    type: "transfer",
    status: "Completed",
    reference: "HTL-2024-000567",
    location: "Dubai, UAE",
    category: "Real Estate",
    fee: 200.0,
    exchangeRate: "1 AED = $0.2722 USD",
    notes: "Investment in luxury resort development project",
    merchant: "Emirates Hospitality Group",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Emirates Group ****9517",
  },
  {
    id: "15",
    description: "Stock Portfolio Rebalancing - Morgan Stanley",
    amount: -4800000,
    date: "2024-11-12",
    time: "10:15:44",
    type: "transfer",
    status: "Completed",
    reference: "STK-2024-000789",
    location: "New York, NY",
    category: "Investment",
    fee: 150.0,
    exchangeRate: null,
    notes: "Quarterly portfolio rebalancing and diversification",
    merchant: "Morgan Stanley Wealth Management",
    accountFrom: "Elite Checking ****8392",
    accountTo: "Morgan Stanley ****7531",
  },
]

export function AccountDetails({ accountId, onBack }: AccountDetailsProps) {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<(typeof mockDetailedTransactions)[0] | null>(null)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [transactionPin, setTransactionPin] = useState("")
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [pendingStatementDownload, setPendingStatementDownload] = useState(false)

  const account = accountId ? mockAccountsData[accountId as keyof typeof mockAccountsData] : null

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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    console.log(`[v0] Copied to clipboard: ${text}`)
  }

  const handleDownloadStatement = () => {
    setPendingStatementDownload(true)
    setShowPinDialog(true)
  }

  const handlePinVerification = () => {
    if (transactionPin.length === 4) {
      setShowPinDialog(false)
      setTransactionPin("")
      setPendingStatementDownload(false)

      alert("Account statement has been sent to your registered email address.")
    } else {
      alert("Please enter your 4-digit transaction PIN.")
    }
  }

  const generateReceipt = (transaction: (typeof mockDetailedTransactions)[0], format: "PDF" | "JPEG") => {
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

  const handleDownloadFormat = (format: "PDF" | "JPEG") => {
    setShowDownloadOptions(false)

    if (selectedTransaction) {
      const receiptContent = generateReceipt(selectedTransaction, format)

      const blob = new Blob([receiptContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `rive-receipt-${selectedTransaction.reference}.${format.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      alert(`Professional transaction receipt downloaded in ${format} format successfully!`)
    }
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
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-emerald-400">{account.name}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{account.type} Account</p>
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
              {balanceVisible ? formatCurrency(account.balance) : "••••••••"}
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
          <div className="text-left lg:text-right space-y-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 min-h-[44px] w-full sm:w-auto"
              onClick={handleDownloadStatement}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Statement
            </Button>
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
                  {balanceVisible ? account.accountNumber : "••••-••••-••••-••••"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(account.accountNumber)}
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

      {/* Recent Transactions */}
      <Card className="glass p-4 sm:p-6 border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-emerald-400">Transaction History</h3>
          <Button
            variant="outline"
            size="sm"
            className="glass-dark bg-transparent border-emerald-500/30 min-h-[44px] w-full sm:w-auto"
          >
            Export All
          </Button>
        </div>
        <div className="space-y-3">
          {mockDetailedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg hover:bg-emerald-500/5 transition-colors cursor-pointer border border-transparent hover:border-emerald-500/20 min-h-[60px]"
              onClick={() => setSelectedTransaction(transaction)}
            >
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    transaction.amount > 0 ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}
                >
                  {transaction.amount > 0 ? (
                    <ArrowDownLeft className="w-6 h-6 sm:w-5 sm:h-5 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 sm:w-5 sm:h-5 text-red-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">{transaction.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs text-muted-foreground">
                    <span>{transaction.date}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{transaction.time}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">{transaction.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`font-semibold text-sm sm:text-base ${transaction.amount > 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{transaction.category}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glass max-w-lg w-full max-h-[90vh] overflow-y-auto border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-emerald-400">Transaction Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTransaction(null)}
                  className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px]"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedTransaction.amount > 0 ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}
                  >
                    {selectedTransaction.amount > 0 ? (
                      <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base">{selectedTransaction.description}</p>
                    <p className="text-sm text-muted-foreground">{selectedTransaction.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Amount</p>
                    <p
                      className={`font-semibold text-sm sm:text-base ${selectedTransaction.amount > 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {selectedTransaction.amount > 0 ? "+" : ""}
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Reference</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono text-xs sm:text-sm flex-1 truncate">{selectedTransaction.reference}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTransaction.reference)}
                        className="text-muted-foreground hover:text-foreground min-h-[32px] min-w-[32px] flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                    <p className="text-xs sm:text-sm">
                      {selectedTransaction.date} {selectedTransaction.time}
                    </p>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="text-xs sm:text-sm">{selectedTransaction.location}</p>
                  </div>
                </div>

                <div className="flex justify-center pt-4 border-t border-emerald-500/20">
                  <Button
                    variant="outline"
                    className="glass-dark bg-transparent border-emerald-500/30 min-h-[44px] px-8"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Dialog open={showDownloadOptions} onOpenChange={setShowDownloadOptions}>
        <DialogContent className="glass-dark border-emerald-500/20 max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-emerald-400 text-base sm:text-lg">Select Download Format</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Choose your preferred format for the transaction receipt:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => handleDownloadFormat("PDF")}
                className="h-16 sm:h-20 flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-500"
              >
                <div className="text-base sm:text-lg font-semibold">PDF</div>
                <div className="text-xs opacity-80">Portable Document</div>
              </Button>
              <Button
                onClick={() => handleDownloadFormat("JPEG")}
                className="h-16 sm:h-20 flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-500"
              >
                <div className="text-base sm:text-lg font-semibold">JPEG</div>
                <div className="text-xs opacity-80">Image Format</div>
              </Button>
            </div>
            <Button variant="outline" onClick={() => setShowDownloadOptions(false)} className="w-full min-h-[44px]">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="glass-dark border-emerald-500/20 max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-emerald-400 text-base sm:text-lg">Transaction PIN Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please enter your 4-digit transaction PIN to download the account statement.
            </p>
            <div>
              <Label htmlFor="transactionPin" className="text-sm">
                Transaction PIN
              </Label>
              <Input
                id="transactionPin"
                type="password"
                maxLength={4}
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                className="glass-dark border-emerald-500/30 text-center min-h-[44px] text-lg"
                placeholder="••••"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handlePinVerification}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 min-h-[44px]"
              >
                Verify & Download
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPinDialog(false)
                  setTransactionPin("")
                  setPendingStatementDownload(false)
                }}
                className="flex-1 min-h-[44px]"
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
