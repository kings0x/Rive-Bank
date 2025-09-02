"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, Lock, Settings, Eye, EyeOff, Download, Plus, TrendingUp } from "lucide-react"

const mockCards = [
  {
    id: "1",
    name: "Rive Elite Debit",
    type: "Debit",
    last4: "8392",
    status: "active",
    limit: 50000,
    spent: 12847,
    locked: false,
    color: "emerald",
  },
  {
    id: "2",
    name: "Rive Platinum Credit",
    type: "Credit",
    last4: "2847",
    status: "active",
    limit: 500000,
    spent: 84739,
    locked: false,
    color: "platinum",
  },
  {
    id: "3",
    name: "Rive Business Elite",
    type: "Business Credit",
    last4: "9384",
    status: "active",
    limit: 1000000,
    spent: 284739,
    locked: true,
    color: "gold",
  },
]

export function CardsSection() {
  const [cards, setCards] = useState(mockCards)
  const [detailsVisible, setDetailsVisible] = useState(true)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [showNewCardDialog, setShowNewCardDialog] = useState(false)
  const [showManageLimitDialog, setShowManageLimitDialog] = useState(false)
  const [currentAction, setCurrentAction] = useState("")
  const [transactionPin, setTransactionPin] = useState("")
  const [emailPin, setEmailPin] = useState("")
  const [newCardForm, setNewCardForm] = useState({
    cardType: "",
    deliveryAddress: "",
    reason: "",
  })
  const [limitForm, setLimitForm] = useState({
    cardId: "",
    newLimit: "",
    reason: "",
  })

  const toggleCardLock = (cardId: string) => {
    setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, locked: !card.locked } : card)))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getCardGradient = (color: string) => {
    switch (color) {
      case "emerald":
        return "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900"
      case "platinum":
        return "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900"
      case "gold":
        return "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900"
      default:
        return "bg-gradient-to-br from-primary/60 via-primary/70 to-primary/90"
    }
  }

  const handlePinVerification = () => {
    if (transactionPin.length === 4) {
      if (currentAction === "download-statement") {
        setShowPinDialog(false)
        setTransactionPin("")
        alert("Your card statements have been sent to your registered email address.")
      } else if (currentAction === "new-card") {
        if (emailPin.length === 6) {
          setShowPinDialog(false)
          setShowNewCardDialog(false)
          setTransactionPin("")
          setEmailPin("")
          setNewCardForm({ cardType: "", deliveryAddress: "", reason: "" })
          alert(
            "Your new card request has been submitted successfully. You will receive an email confirmation from the bank shortly.",
          )
        } else {
          alert("Please enter the 6-digit PIN sent to your email.")
        }
      } else if (currentAction === "manage-limit") {
        if (emailPin.length === 6) {
          setShowPinDialog(false)
          setShowManageLimitDialog(false)
          setTransactionPin("")
          setEmailPin("")
          setLimitForm({ cardId: "", newLimit: "", reason: "" })
          alert("Your spending limit has been updated successfully. Changes will take effect within 24 hours.")
        } else {
          alert("Please enter the 6-digit PIN sent to your email.")
        }
      }
    } else {
      alert("Please enter your 4-digit transaction PIN.")
    }
  }

  const handleNewCardRequest = () => {
    if (newCardForm.cardType && newCardForm.deliveryAddress && newCardForm.reason) {
      setCurrentAction("new-card")
      setShowPinDialog(true)
    } else {
      alert("Please fill in all required fields.")
    }
  }

  const handleManageLimit = () => {
    if (limitForm.cardId && limitForm.newLimit && limitForm.reason) {
      setCurrentAction("manage-limit")
      setShowPinDialog(true)
    } else {
      alert("Please fill in all required fields.")
    }
  }

  const handleDownloadStatement = () => {
    setCurrentAction("download-statement")
    setShowPinDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-2xl font-semibold">Your Rive Cards</h3>
          <p className="text-muted-foreground">Manage your exclusive banking cards</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDetailsVisible(!detailsVisible)}
          className="text-muted-foreground hover:text-foreground"
        >
          {detailsVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            className="glass p-6 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 group"
          >
            {/* Card Visual */}
            <div className="relative mb-6">
              <div
                className={`relative w-full h-48 ${getCardGradient(card.color)} rounded-xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl`}
              >
                <div className="absolute inset-0 opacity-20 grain-texture pointer-events-none"></div>

                {/* Geometric illustration */}
                <div className="absolute top-4 right-4 opacity-10">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 0L80 40L40 80L0 40L40 0Z" fill="white" fillOpacity="0.2" />
                    <path d="M40 20L60 40L40 60L20 40L40 20Z" fill="white" fillOpacity="0.1" />
                  </svg>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/90 font-semibold tracking-wider">RIVE</p>
                    <p className="text-xs text-white/70 font-medium">{card.type.toUpperCase()}</p>
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-white/90 text-lg font-mono tracking-widest mb-3">
                    {detailsVisible ? `•••• •••• •••• ${card.last4}` : "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">{card.name}</p>
                    <div className="text-right">
                      <p className="text-xs text-white/70">VALID THRU</p>
                      <p className="text-xs text-white/90 font-mono">12/28</p>
                    </div>
                  </div>
                </div>

                {/* Holographic effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                {card.locked && (
                  <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-white font-medium">Card Locked</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`text-sm font-medium ${card.locked ? "text-red-400" : "text-emerald-400"}`}>
                  {card.locked ? "Locked" : "Active"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Spending Limit</span>
                <span className="text-sm font-medium">{detailsVisible ? formatCurrency(card.limit) : "••••••"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-sm font-medium text-emerald-400">
                  {detailsVisible ? formatCurrency(card.spent) : "••••••"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="text-muted-foreground">
                    {detailsVisible ? `${Math.round((card.spent / card.limit) * 100)}%` : "••%"}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${(card.spent / card.limit) * 100}%` }}
                  />
                </div>
              </div>

              {/* Card Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={!card.locked}
                    onCheckedChange={() => toggleCardLock(card.id)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <span className="text-sm">{card.locked ? "Unlock" : "Lock"} Card</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-emerald-500/10"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Card Actions */}
      <Card className="glass p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <h4 className="font-serif text-lg font-semibold mb-4 text-emerald-400">Card Management</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <Dialog open={showNewCardDialog} onOpenChange={setShowNewCardDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Request New Card
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-dark border-emerald-500/20">
              <DialogHeader>
                <DialogTitle className="text-emerald-400">Request New Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardType">Card Type</Label>
                  <Select
                    value={newCardForm.cardType}
                    onValueChange={(value) => setNewCardForm({ ...newCardForm, cardType: value })}
                  >
                    <SelectTrigger className="glass-dark border-emerald-500/30">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debit">Rive Elite Debit</SelectItem>
                      <SelectItem value="credit">Rive Platinum Credit</SelectItem>
                      <SelectItem value="business">Rive Business Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Input
                    id="deliveryAddress"
                    value={newCardForm.deliveryAddress}
                    onChange={(e) => setNewCardForm({ ...newCardForm, deliveryAddress: e.target.value })}
                    className="glass-dark border-emerald-500/30"
                    placeholder="Enter delivery address"
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason for Request</Label>
                  <Select
                    value={newCardForm.reason}
                    onValueChange={(value) => setNewCardForm({ ...newCardForm, reason: value })}
                  >
                    <SelectTrigger className="glass-dark border-emerald-500/30">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lost">Lost Card</SelectItem>
                      <SelectItem value="stolen">Stolen Card</SelectItem>
                      <SelectItem value="damaged">Damaged Card</SelectItem>
                      <SelectItem value="additional">Additional Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleNewCardRequest} className="w-full bg-emerald-600 hover:bg-emerald-500">
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showManageLimitDialog} onOpenChange={setShowManageLimitDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Manage Limits
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-dark border-emerald-500/20">
              <DialogHeader>
                <DialogTitle className="text-emerald-400">Manage Spending Limits</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardSelect">Select Card</Label>
                  <Select
                    value={limitForm.cardId}
                    onValueChange={(value) => setLimitForm({ ...limitForm, cardId: value })}
                  >
                    <SelectTrigger className="glass-dark border-emerald-500/30">
                      <SelectValue placeholder="Select card" />
                    </SelectTrigger>
                    <SelectContent>
                      {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} - ****{card.last4}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="newLimit">New Spending Limit</Label>
                  <Input
                    id="newLimit"
                    type="number"
                    value={limitForm.newLimit}
                    onChange={(e) => setLimitForm({ ...limitForm, newLimit: e.target.value })}
                    className="glass-dark border-emerald-500/30"
                    placeholder="Enter new limit"
                  />
                </div>
                <div>
                  <Label htmlFor="limitReason">Reason for Change</Label>
                  <Select
                    value={limitForm.reason}
                    onValueChange={(value) => setLimitForm({ ...limitForm, reason: value })}
                  >
                    <SelectTrigger className="glass-dark border-emerald-500/30">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">Increase Spending Power</SelectItem>
                      <SelectItem value="decrease">Reduce Risk</SelectItem>
                      <SelectItem value="temporary">Temporary Adjustment</SelectItem>
                      <SelectItem value="business">Business Requirements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleManageLimit} className="w-full bg-emerald-600 hover:bg-emerald-500">
                  Update Limit
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
            onClick={handleDownloadStatement}
          >
            <Download className="w-4 h-4 mr-2" />
            View Statements
          </Button>
        </div>
      </Card>

      {/* PIN Verification Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="glass-dark border-emerald-500/20">
          <DialogHeader>
            <DialogTitle className="text-emerald-400">Security Verification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transactionPin">Transaction PIN</Label>
              <Input
                id="transactionPin"
                type="password"
                maxLength={4}
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                className="glass-dark border-emerald-500/30"
                placeholder="Enter 4-digit PIN"
              />
            </div>
            {(currentAction === "new-card" || currentAction === "manage-limit") && (
              <div>
                <Label htmlFor="emailPin">Email Verification PIN</Label>
                <Input
                  id="emailPin"
                  type="password"
                  maxLength={6}
                  value={emailPin}
                  onChange={(e) => setEmailPin(e.target.value)}
                  className="glass-dark border-emerald-500/30"
                  placeholder="Enter 6-digit PIN from email"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A 6-digit PIN has been sent to your registered email address.
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handlePinVerification} className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                Verify
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPinDialog(false)
                  setTransactionPin("")
                  setEmailPin("")
                }}
                className="flex-1"
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

export default CardsSection
