"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, QrCode, ArrowUpRight, ArrowDownLeft, Bitcoin, Coins, Send, Download } from "lucide-react"
import { TransactionSecurityModal } from "@/components/transaction-security-modal"

const mockCryptoBalances = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    balance: 12.847392,
    usdValue: 1284739.2,
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    icon: Bitcoin,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 847.392,
    usdValue: 2847392.1,
    address: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
    icon: Coins,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: 5847392.45,
    usdValue: 5847392.45,
    address: "0x847d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
    icon: Coins,
  },
]

const mockCryptoTransactions = [
  {
    id: "1",
    type: "receive",
    symbol: "BTC",
    amount: 2.5,
    usdValue: 125000,
    date: "2025-01-15",
    hash: "a1b2c3d4e5f6...",
  },
  {
    id: "2",
    type: "send",
    symbol: "ETH",
    amount: -50.0,
    usdValue: -168000,
    date: "2025-01-14",
    hash: "f6e5d4c3b2a1...",
  },
  {
    id: "3",
    type: "receive",
    symbol: "USDC",
    amount: 100000,
    usdValue: 100000,
    date: "2025-01-13",
    hash: "1a2b3c4d5e6f...",
  },
  {
    id: "4",
    type: "send",
    symbol: "BTC",
    amount: -1.2,
    usdValue: -60000,
    date: "2025-01-12",
    hash: "9z8y7x6w5v4u...",
  },
  {
    id: "5",
    type: "receive",
    symbol: "ETH",
    amount: 25.0,
    usdValue: 84000,
    date: "2025-01-11",
    hash: "m1n2o3p4q5r6...",
  },
]

export function CryptoSection() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [showQRModal, setShowQRModal] = useState<string | null>(null)
  const [showSendModal, setShowSendModal] = useState<string | null>(null)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [sendFormData, setSendFormData] = useState({
    recipientAddress: "",
    amount: "",
    memo: "",
  })
  const [sendCrypto, setSendCrypto] = useState<string>("")

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const generateQRCode = (address: string) => {
    // Using a simple QR code service - in production, would use a proper QR library
    return `/placeholder.png?height=200&width=200&query=QR code for crypto address ${address.slice(0, 8)}`
  }

  const handleSendCrypto = (cryptoSymbol: string) => {
    setSendCrypto(cryptoSymbol)
    setShowSendModal(cryptoSymbol)
  }

  const handleSendSubmit = () => {
    if (!sendFormData.recipientAddress || !sendFormData.amount) return

    setShowSendModal(null)
    setShowSecurityModal(true)
  }

  const handleSecuritySuccess = () => {
    setShowSecurityModal(false)
    setSendFormData({ recipientAddress: "", amount: "", memo: "" })
    setSendCrypto("")
    // In real app, would process the crypto transaction
  }

  const totalCryptoValue = mockCryptoBalances.reduce((sum, crypto) => sum + crypto.usdValue, 0)

  const displayedTransactions = showAllTransactions ? mockCryptoTransactions : mockCryptoTransactions.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Total Crypto Portfolio */}
      <Card className="glass p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-2xl font-semibold text-emerald-400">Crypto Portfolio</h3>
          <div className="text-right">
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              {formatCurrency(totalCryptoValue)}
            </p>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </div>
        </div>
        <p className="text-muted-foreground">Supported on Base Network</p>
      </Card>

      {/* Crypto Balances */}
      <div className="grid md:grid-cols-3 gap-6">
        {mockCryptoBalances.map((crypto) => {
          const Icon = crypto.icon
          return (
            <Card
              key={crypto.symbol}
              className="glass p-6 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 border border-emerald-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{crypto.symbol}</h4>
                    <p className="text-sm text-muted-foreground">{crypto.name}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xl font-bold">{crypto.balance.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(crypto.usdValue)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                  <span className="text-xs text-muted-foreground">Wallet Address</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono">
                      {crypto.address.slice(0, 8)}...{crypto.address.slice(-6)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(crypto.address)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    onClick={() => setShowQRModal(crypto.symbol)}
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    Receive
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                    onClick={() => handleSendCrypto(crypto.symbol)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Crypto Transactions */}
      <Card className="glass p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-semibold text-emerald-400">Recent Crypto Transactions</h3>
          <Button
            variant="outline"
            size="sm"
            className="glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
            onClick={() => setShowAllTransactions(!showAllTransactions)}
          >
            {showAllTransactions ? "Show Less" : "View All"}
          </Button>
        </div>
        <div className="space-y-4">
          {displayedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "receive" ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}
                >
                  {transaction.type === "receive" ? (
                    <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.type === "receive" ? "Received" : "Sent"} {transaction.symbol}
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">{transaction.hash}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${transaction.type === "receive" ? "text-emerald-400" : "text-foreground"}`}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toLocaleString()} {transaction.symbol}
                </p>
                <p className="text-sm text-muted-foreground">{formatCurrency(transaction.usdValue)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* QR Code Modal */}
      {showQRModal && (
        <Dialog open={!!showQRModal} onOpenChange={() => setShowQRModal(null)}>
          <DialogContent className="glass max-w-sm border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-center text-emerald-400">
                Receive {showQRModal}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-center">
              {(() => {
                const crypto = mockCryptoBalances.find((c) => c.symbol === showQRModal)
                if (!crypto) return null

                return (
                  <>
                    <div className="flex justify-center">
                      <div className="p-4 bg-background rounded-lg border border-border">
                        <img
                          src={generateQRCode(crypto.address) || "/placeholder.png"}
                          alt={`QR code for ${crypto.symbol} address`}
                          className="w-48 h-48"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Your {crypto.name} Address</p>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="font-mono text-sm break-all">{crypto.address}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(crypto.address)}
                          className="ml-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      {copiedAddress === crypto.address && (
                        <p className="text-xs text-emerald-400 mt-1">Address copied!</p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => copyToClipboard(crypto.address)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Address
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                        onClick={() => {
                          // In real app, would save QR code image
                          const link = document.createElement("a")
                          link.download = `${crypto.symbol}-address-qr.png`
                          link.href = generateQRCode(crypto.address)
                          link.click()
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Save QR
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Send Crypto Modal */}
      {showSendModal && (
        <Dialog open={!!showSendModal} onOpenChange={() => setShowSendModal(null)}>
          <DialogContent className="glass max-w-md border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-center text-emerald-400">
                Send {showSendModal}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {(() => {
                const crypto = mockCryptoBalances.find((c) => c.symbol === showSendModal)
                if (!crypto) return null

                return (
                  <>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Available Balance:</span>
                        <span className="font-semibold">
                          {crypto.balance.toLocaleString()} {crypto.symbol}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="recipientAddress">Recipient Address</Label>
                      <Input
                        id="recipientAddress"
                        value={sendFormData.recipientAddress}
                        onChange={(e) => setSendFormData((prev) => ({ ...prev, recipientAddress: e.target.value }))}
                        className="glass-dark border-emerald-500/30 font-mono text-sm"
                        placeholder={`Enter ${crypto.symbol} address`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.00000001"
                        value={sendFormData.amount}
                        onChange={(e) => setSendFormData((prev) => ({ ...prev, amount: e.target.value }))}
                        className="glass-dark border-emerald-500/30"
                        placeholder={`0.00000000 ${crypto.symbol}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="memo">Memo (Optional)</Label>
                      <Input
                        id="memo"
                        value={sendFormData.memo}
                        onChange={(e) => setSendFormData((prev) => ({ ...prev, memo: e.target.value }))}
                        className="glass-dark border-emerald-500/30"
                        placeholder="Transaction note"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setShowSendModal(null)}
                        variant="outline"
                        className="flex-1 glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSendSubmit}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        disabled={!sendFormData.recipientAddress || !sendFormData.amount}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send {crypto.symbol}
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Transaction Security Modal */}
      <TransactionSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        onSuccess={handleSecuritySuccess}
        transactionType="Crypto Transfer"
        transactionDetails={{
          cryptoType: sendCrypto,
          amount: sendFormData.amount,
          address: sendFormData.recipientAddress,
        }}
      />
    </div>
  )
}
