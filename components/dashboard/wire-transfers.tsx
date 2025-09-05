"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Shield, AlertCircle } from "lucide-react"
import { TransactionSecurityModal } from "@/components/transaction-security-modal"
import { useAccountStore } from "@/store/account-store"
import { useCurrentAccountIdStore } from "@/store/account-store"

export function WireTransfers() {
  const [formData, setFormData] = useState({
    fromAccount: "",
    recipientName: "",
    routingNumber: "",
    accountNumber: "",
    amount: "",
    memo: "",
  })
  const setIdStore = useCurrentAccountIdStore((s) => s.setCurrentAccountId)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const accountDetails = useAccountStore((s) => s.accountDetails)

  useEffect(() => {
    const selectedAccount = localStorage.getItem("rive_selected_account")
    if (selectedAccount) {
      setFormData((prev) => ({ ...prev, fromAccount: selectedAccount }))
      // Clear the stored account after using it
      localStorage.removeItem("rive_selected_account")
    }
  }, [])

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const findAccount = (accountType: string) => {
    for (let i in accountDetails) {
      if (accountDetails[i].type === accountType) {
        console.log("in for loop", accountDetails[i])
        return accountDetails[i]
      }
    }
  }

  const validateForm = async() => {
    console.log("formData.fromAccount", formData.fromAccount)
    const newErrors: Record<string, string> = {}
    let userAccount
    if (!formData.fromAccount) newErrors.fromAccount = "Please select an account"
    
    userAccount = findAccount(formData.fromAccount)
    console.log("userAccount", userAccount)
    setIdStore(userAccount ? userAccount.id : "")
    if (!formData.recipientName.trim()) newErrors.recipientName = "Recipient name is required"
    if (formData.routingNumber.length !== 9) newErrors.routingNumber = "Routing number must be 9 digits"
    if (!formData.accountNumber.trim()) newErrors.accountNumber = "Account number is required"

    if (!formData.amount || Number.parseInt(formData.amount) <= 0) newErrors.amount = "Please enter a valid amount"
    if(userAccount && Number.parseInt(formData.amount) > userAccount.balance ) newErrors.amount = "Insufficient Funds"

    const account_id = userAccount && userAccount.id
    const recipient_account_number = formData.accountNumber
    const recipient_name = formData.recipientName
    const routing_number = formData.routingNumber
    const amount = Number.parseInt(formData.amount || "0", 10)

    try{

      const response = await fetch("/api/verify-transaction-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id,
          recipient_account_number,
          recipient_name,
          routing_number,
          amount
        })
      })
      if(!response.ok){
        const errorData = await response.json()
        if(errorData.message === "Insufficient balance"){
          newErrors.amount = errorData.message
        }

        if(errorData.message === "Recipient details not found"){
          newErrors.accountNumber = errorData.message
          newErrors.recipientName = errorData.message
        }

      }

    }
    catch(error: any){
      newErrors.fromAccount = "Something went wrong"
      console.log(error.message)
    }

    

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    try {
      const ok = await validateForm()
      if (!ok) return
      // validation passed — open modal
      setShowSecurityModal(true)
    } catch (err) {
      console.error("handleSubmit error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSecuritySuccess = async () => {
    setShowSecurityModal(false)
    setIsProcessing(true)

    // Simulate wire transfer processing
    setTimeout(() => {
      setIsProcessing(false)
      // Reset form after successful transfer
      setFormData({
        fromAccount: "",
        recipientName: "",
        routingNumber: "",
        accountNumber: "",
        amount: "",
        memo: "",
      })
      // In real app, would show success notification and update transaction history
    }, 2000)
  }

  const handleSecurityCancel = () => {
    setShowSecurityModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <Card className="glass p-4 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-medium">Secure Wire Transfer</p>
            <p className="text-sm text-muted-foreground">
              All transfers require PIN verification and email confirmation
            </p>
          </div>
        </div>
      </Card>

      {/* Wire Transfer Form */}
      <Card className="glass p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <div className="mb-6">
          <h3 className="font-serif text-2xl font-semibold text-emerald-400">Domestic Wire Transfer</h3>
          <p className="text-muted-foreground">Send money to U.S. banks securely</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fromAccount">From Account</Label>
              <Select value={formData.fromAccount} onValueChange={(value) => updateFormData("fromAccount", value)}>
                <SelectTrigger className="glass-dark border-emerald-500/30">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent className="glass-dark">
                  <SelectItem value="checking">Elite Checking (****8392)</SelectItem>
                  <SelectItem value="savings">Wealth Savings (****2847)</SelectItem>
                  <SelectItem value="business">Business Elite (****9384)</SelectItem>
                </SelectContent>
              </Select>
              {errors.fromAccount && <p className="text-destructive text-sm mt-1">{errors.fromAccount}</p>}
            </div>

            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => updateFormData("recipientName", e.target.value)}
                className="glass-dark border-emerald-500/30"
                placeholder="Full name as it appears on account"
                disabled={isProcessing}
              />
              {errors.recipientName && <p className="text-destructive text-sm mt-1">{errors.recipientName}</p>}
            </div>

            <div>
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                value={formData.routingNumber}
                onChange={(e) => updateFormData("routingNumber", e.target.value.replace(/\D/g, "").slice(0, 9))}
                className="glass-dark border-emerald-500/30"
                placeholder="9-digit routing number"
                disabled={isProcessing}
              />
              {errors.routingNumber && <p className="text-destructive text-sm mt-1">{errors.routingNumber}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => updateFormData("accountNumber", e.target.value)}
                className="glass-dark border-emerald-500/30"
                placeholder="Recipient's account number"
                disabled={isProcessing}
              />
              {errors.accountNumber && <p className="text-destructive text-sm mt-1">{errors.accountNumber}</p>}
            </div>

            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="1"
                value={formData.amount}
                onChange={(e) => updateFormData("amount", e.target.value)}
                className="glass-dark border-emerald-500/30"
                placeholder="0.00"
                disabled={isProcessing}
              />
              {errors.amount && <p className="text-destructive text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Input
                id="memo"
                value={formData.memo}
                onChange={(e) => updateFormData("memo", e.target.value)}
                className="glass-dark border-emerald-500/30"
                placeholder="Purpose of transfer"
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>Wire transfers typically process within 1-2 business days</span>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              size="lg"
              disabled={isProcessing||showSecurityModal}
            >
  
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                  Processing Transfer...
                </div>
              ) : (
                <>
                  Initiate Transfer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Wire Transfers */}
      <Card className="glass p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <h3 className="font-serif text-xl font-semibold mb-4 text-emerald-400">Recent Wire Transfers</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="font-medium">Goldman Sachs Private Wealth</p>
              <p className="text-sm text-muted-foreground">Jan 15, 2025 • Completed</p>
            </div>
            <p className="font-semibold">-$2,500,000.00</p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="font-medium">Morgan Stanley Investment</p>
              <p className="text-sm text-muted-foreground">Jan 12, 2025 • Completed</p>
            </div>
            <p className="font-semibold">-$1,750,000.00</p>
          </div>
        </div>
      </Card>

      <TransactionSecurityModal
        isOpen={showSecurityModal}
        onClose={handleSecurityCancel}
        onSuccess={handleSecuritySuccess}
        transactionType="Wire Transfer"
        transactionDetails={{
          recipient: formData.recipientName,
          accountNumber: formData.accountNumber,
          amount: formData.amount,
          account: formData.fromAccount,
        }}
        
      />
    </div>
  )
}
