"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Shield, Lock, Mail, Check, AlertCircle, ArrowRight, Clock } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { SecurityManager } from "@/lib/security"
import { useCurrentAccountIdStore, useAccountStore } from "@/store/account-store"
import { useUserIdStore } from "@/store/account-store"

interface TransactionSecurityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  transactionType: string
  transactionDetails: {
    recipient?: string
    accountNumber?: string
    amount?: string
    account?: string
    cryptoType?: string
    address?: string
  }
}

type SecurityStep = "pin" | "email" | "success"

export function TransactionSecurityModal({
  isOpen,
  onClose,
  onSuccess,
  transactionType,
  transactionDetails,
}: TransactionSecurityModalProps) {
  const [currentStep, setCurrentStep] = useState<SecurityStep>("pin")
  const [pin, setPin] = useState("")
  const [emailCode, setEmailCode] = useState("")
  const [expectedEmailCode, setExpectedEmailCode] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const [isLocked, setIsLocked] = useState(false)
  const user = getCurrentUser()
  const securityManager = SecurityManager.getInstance()
  const userAccountId = useCurrentAccountIdStore((s) => s.currentAccountId)
  const updateAccounts = useAccountStore((s) => s.fetchAccountDetails)
  const userId = useUserIdStore((s) => s.userId)

  useEffect(() => {
    if (currentStep === "email" && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && currentStep === "email") {
      setErrors({ email: "Confirmation code has expired. Please restart the transaction." })
    }
  }, [currentStep, timeRemaining])

  useEffect(() => {
    if (isOpen && user?.email) {
      const locked = securityManager.isAccountLocked(user.email)
      setIsLocked(locked)
      if (locked) {
        setErrors({ pin: "Account temporarily locked due to failed attempts. Please try again later." })
      }
    }
  }, [isOpen, user?.email])

  const formatCurrency = (amount: string) => {
    const num = Number.parseFloat(amount || "0")
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      setErrors({ pin: "PIN must be 4 digits" })
      return
    }

    if (isLocked) {
      setErrors({ pin: "Account is locked. Please try again later." })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Verify PIN
      const response = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, account_id: userAccountId }),
        credentials: "include",
      })

      if (!response.ok) {
        // server says invalid pin
        setErrors({ pin: "Invalid PIN. Please try again." })
        // Also check lock status in case backend locked it
        const nowLocked = securityManager.isAccountLocked(user?.email || "")
        if (nowLocked) {
          setIsLocked(true)
          setErrors({ pin: "Account locked due to multiple failed attempts. Please try again in 15 minutes." })
        }
        return
      }

      const isValid = await response.json()

      if (!isValid) {
        // fallback: mark as invalid
        const nowLocked = securityManager.isAccountLocked(user?.email || "")
        if (nowLocked) {
          setIsLocked(true)
          setErrors({ pin: "Account locked due to multiple failed attempts. Please try again in 15 minutes." })
        } else {
          setErrors({ pin: "Invalid PIN. Please try again." })
        }
        return
      }

      // PIN is valid — send the confirmation email (keep isLoading true during this)
      const mailResp = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_id: userAccountId,
          recipient_name: transactionDetails.recipient,
          recipient_account_number: transactionDetails.accountNumber,
          amount: transactionDetails.amount,
        }),
        credentials: "include",
      })

      if (!mailResp.ok) {
        // preserve a helpful error
        try {
          const errorData = await mailResp.json()
          console.log("sending transaction issue : ", errorData.error)
        } catch (e) {
          console.log("send-mail failed")
        }
        setErrors({ pin: "Failed to send confirmation email. Please try again." })
        return
      }

      // Success path — move to email step
      setCurrentStep("email")
      setTimeRemaining(300)

      securityManager.logSecurityEvent({
        type: "transaction",
        details: `PIN validated for ${transactionType}`,
        status: "success",
      })
    } catch (error: any) {
      console.log(error?.message ?? error)
      setErrors({ pin: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
}

  const handleEmailSubmit = async () => {
    if (emailCode.length !== 6) {
      setErrors({ email: "Confirmation code must be 6 digits" })
      return
    }

    if (timeRemaining <= 0) {
      setErrors({ email: "Confirmation code has expired" })
      return
    }

    setIsLoading(true)
    setErrors({})

      let isValid = false;
      //where i would put code to confirm the email code and update the balances
      try{
        const response = await fetch("/api/process-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
             account_id: userAccountId,
             emailCode
            }),
          credentials: "include",
        })
        if (!response.ok){
          setIsLoading(false)
          const errorData = await response.json()
          console.log(errorData.error)
          setErrors({ email: "Invalid code" })
          return
        }
        const data = await response.json()
        isValid = true
        setIsLoading(false)
        
      }
      
      catch(error: any){
        setIsLoading(false)
        console.log(error.message)
      }
      

      if (!isValid) {
        setErrors({ email: "Invalid confirmation code" })
      } else {
        if (transactionDetails.amount) {
          const amount = Number.parseFloat(transactionDetails.amount)
          const isAmountValid = securityManager.validateTransactionAmount(amount, "daily")

          if (!isAmountValid) {
            setErrors({ email: "Transaction amount exceeds security limits" })
            return
          }
        }

        setCurrentStep("success")

        securityManager.logSecurityEvent({
          type: "transaction",
          details: `${transactionType} authorized successfully`,
          status: "success",
        })

        await updateAccounts(userId)
        //use the access store here to update the balances
          onSuccess()
          handleClose()
        
      }
  
  }

  const handleClose = () => {
    setCurrentStep("pin")
    setPin("")
    setEmailCode("")
    setExpectedEmailCode("")
    setErrors({})
    setIsLoading(false)
    setTimeRemaining(300)
    setIsLocked(false)
    onClose()
  }

  const getAccountDisplayName = (account: string) => {
    switch (account) {
      case "checking":
        return "Elite Checking (****8392)"
      case "savings":
        return "Wealth Savings (****2847)"
      case "business":
        return "Business Elite (****9384)"
      default:
        return account
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass max-w-md neon-glow-subtle">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-center">Transaction Security</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Summary */}
          <Card className="glass-dark p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-medium">{transactionType}</span>
            </div>
            <div className="space-y-2 text-sm">
              {transactionDetails.recipient && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span>{transactionDetails.recipient}</span>
                </div>
              )}
              {transactionDetails.amount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">{formatCurrency(transactionDetails.amount)}</span>
                </div>
              )}
              {transactionDetails.account && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span>{getAccountDisplayName(transactionDetails.account)}</span>
                </div>
              )}
              {transactionDetails.cryptoType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crypto:</span>
                  <span>{transactionDetails.cryptoType}</span>
                </div>
              )}
              {transactionDetails.address && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To Address:</span>
                  <span className="font-mono text-xs">
                    {transactionDetails.address.slice(0, 8)}...{transactionDetails.address.slice(-6)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* PIN Step */}
          {currentStep === "pin" && (
            <div className="space-y-4">
              <div className="text-center">
                <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Enter Transaction PIN</h3>
                <p className="text-sm text-muted-foreground">Enter your 4-digit PIN to authorize this transaction</p>
              </div>

              {isLocked && (
                <Card className="glass-dark p-3 border-destructive/50">
                  <div className="flex items-center space-x-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Account temporarily locked for security</span>
                  </div>
                </Card>
              )}

              <div>
                <Label htmlFor="pin">Transaction PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, ""))
                    setErrors({})
                  }}
                  className="glass-input text-center text-2xl tracking-widest"
                  placeholder="••••"
                  disabled={isLoading || isLocked}
                />
                {errors.pin && <p className="text-destructive text-sm mt-1">{errors.pin}</p>}
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleClose} variant="outline" className="flex-1 glass-dark bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handlePinSubmit}
                  className="flex-1 neon-glow"
                  disabled={isLoading || pin.length !== 4 || isLocked}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Email Confirmation Step */}
          {currentStep === "email" && (
            <div className="space-y-4">
              <div className="text-center">
                <Mail className="w-12 h-12 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit confirmation code to <strong>{user?.email}</strong>
                </p>
              </div>

              <div>
                <Label htmlFor="emailCode">Confirmation Code</Label>
                <Input
                  id="emailCode"
                  type="text"
                  maxLength={6}
                  value={emailCode}
                  onChange={(e) => {
                    setEmailCode(e.target.value.replace(/\D/g, ""))
                    setErrors({})
                  }}
                  className="glass-input text-center text-2xl tracking-widest"
                  placeholder="••••••"
                  disabled={isLoading || timeRemaining <= 0}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className={timeRemaining <= 60 ? "text-destructive" : "text-muted-foreground"}>
                  Code expires in {formatTime(timeRemaining)}
                </span>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleClose} variant="outline" className="flex-1 glass-dark bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleEmailSubmit}
                  className="flex-1 neon-glow"
                  disabled={isLoading || emailCode.length !== 6 || timeRemaining <= 0}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                      Confirming...
                    </div>
                  ) : (
                    <>
                      Confirm Transaction
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {currentStep === "success" && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center neon-glow-accent animate-pulse">
                  <Check className="w-8 h-8 text-accent" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Transaction Authorized</h3>
                <p className="text-sm text-muted-foreground">
                  Your {transactionType.toLowerCase()} has been successfully authorized and is being processed.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-accent">
                <Check className="w-4 h-4" />
                <span>Processing transaction...</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
