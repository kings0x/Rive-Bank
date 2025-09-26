// Enhanced security utilities for RiveTrust
import crypto from 'crypto'
export interface SecurityEvent {
  id: string
  type: "login" | "transaction" | "pin_change" | "failed_attempt" | "suspicious_activity"
  timestamp: Date
  details: string
  ipAddress?: string
  userAgent?: string
  status: "success" | "failed" | "blocked"
}

export interface TransactionLimit {
  daily: number
  weekly: number
  monthly: number
  perTransaction: number
}

export interface SecuritySettings {
  sessionTimeout: number // minutes
  maxFailedAttempts: number
  lockoutDuration: number // minutes
  requireEmailConfirmation: boolean
  require2FA: boolean
  transactionLimits: TransactionLimit
}

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  sessionTimeout: 30,
  maxFailedAttempts: 3,
  lockoutDuration: 15,
  requireEmailConfirmation: true,
  require2FA: false,
  transactionLimits: {
    daily: 1000000, // $1M daily limit
    weekly: 5000000, // $5M weekly limit
    monthly: 20000000, // $20M monthly limit
    perTransaction: 10000000, // $10M per transaction
  },
}

export class SecurityManager {
  private static instance: SecurityManager
  private securityEvents: SecurityEvent[] = []
  private failedAttempts: Map<string, number> = new Map()
  private lockedAccounts: Map<string, Date> = new Map()

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager()
    }
    return SecurityManager.instance
  }

  logSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp">): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }

    this.securityEvents.push(securityEvent)

    // Keep only last 100 events in memory
    if (this.securityEvents.length > 100) {
      this.securityEvents = this.securityEvents.slice(-100)
    }

    // In real app, would send to backend for persistent storage
    console.log("Security Event:", securityEvent)
  }

  getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents].reverse() // Most recent first
  }

  validateTransactionAmount(amount: number, timeframe: "daily" | "weekly" | "monthly"): boolean {
    const limits = DEFAULT_SECURITY_SETTINGS.transactionLimits

    // Check per-transaction limit
    if (amount > limits.perTransaction) {
      this.logSecurityEvent({
        type: "suspicious_activity",
        details: `Transaction amount ${amount} exceeds per-transaction limit`,
        status: "blocked",
      })
      return false
    }

    // In real app, would check actual spending against timeframe limits
    // For demo, we'll just validate against per-transaction limit
    return true
  }

  recordFailedAttempt(identifier: string): boolean {
    const attempts = this.failedAttempts.get(identifier) || 0
    const newAttempts = attempts + 1

    this.failedAttempts.set(identifier, newAttempts)

    this.logSecurityEvent({
      type: "failed_attempt",
      details: `Failed attempt ${newAttempts}/${DEFAULT_SECURITY_SETTINGS.maxFailedAttempts} for ${identifier}`,
      status: "failed",
    })

    if (newAttempts >= DEFAULT_SECURITY_SETTINGS.maxFailedAttempts) {
      this.lockAccount(identifier)
      return true // Account is now locked
    }

    return false // Account not locked yet
  }

  lockAccount(identifier: string): void {
    const lockUntil = new Date()
    lockUntil.setMinutes(lockUntil.getMinutes() + DEFAULT_SECURITY_SETTINGS.lockoutDuration)

    this.lockedAccounts.set(identifier, lockUntil)

    this.logSecurityEvent({
      type: "suspicious_activity",
      details: `Account locked due to failed attempts: ${identifier}`,
      status: "blocked",
    })
  }

  isAccountLocked(identifier: string): boolean {
    const lockUntil = this.lockedAccounts.get(identifier)
    if (!lockUntil) return false

    if (new Date() > lockUntil) {
      // Lock has expired
      this.lockedAccounts.delete(identifier)
      this.failedAttempts.delete(identifier)
      return false
    }

    return true
  }

  clearFailedAttempts(identifier: string): void {
    this.failedAttempts.delete(identifier)
  }

  validatePIN(pin: string, identifier: string): boolean {
    if (this.isAccountLocked(identifier)) {
      return false
    }

    // Mock PIN validation - in real app would hash and compare
    const isValid = pin !== "0000" && pin.length === 4

    if (!isValid) {
      this.recordFailedAttempt(identifier)
    } else {
      this.clearFailedAttempts(identifier)
      this.logSecurityEvent({
        type: "transaction",
        details: "PIN validation successful",
        status: "success",
      })
    }

    return isValid
  }

  generateEmailCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  validateEmailCode(code: string, expectedCode: string): boolean {
    const isValid = code === expectedCode && code !== "000000"

    this.logSecurityEvent({
      type: "transaction",
      details: `Email confirmation ${isValid ? "successful" : "failed"}`,
      status: isValid ? "success" : "failed",
    })

    return isValid
  }
}
export function generateCode(){
    return crypto.randomInt(100000, 1000000).toString();
}