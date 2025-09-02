"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Shield, Lock, UserCheck } from "lucide-react"

type OnboardingStep = "invitation" | "account" | "security" | "confirmation"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("invitation")
  const [formData, setFormData] = useState({
    invitationCode: "",
    email: "",
    password: "",
    confirmPassword: "",
    transactionPin: "",
    confirmPin: "",
    agreementAccepted: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateInvitationCode = () => {
    // Mock validation - in real app this would call an API
    if (formData.invitationCode.length !== 7) {
      setErrors({ invitationCode: "Invitation code must be 7 digits" })
      return false
    }
    setErrors({})
    return true
  }

  const validateAccountStep = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSecurityStep = () => {
    const newErrors: Record<string, string> = {}

    if (formData.transactionPin.length !== 4 || !/^\d{4}$/.test(formData.transactionPin)) {
      newErrors.transactionPin = "PIN must be exactly 4 digits"
    }

    if (formData.transactionPin !== formData.confirmPin) {
      newErrors.confirmPin = "PINs do not match"
    }

    if (!formData.agreementAccepted) {
      newErrors.agreement = "You must accept the security agreement"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = false

    switch (currentStep) {
      case "invitation":
        isValid = validateInvitationCode()
        if (isValid) setCurrentStep("account")
        break
      case "account":
        isValid = validateAccountStep()
        if (isValid) setCurrentStep("security")
        break
      case "security":
        isValid = validateSecurityStep()
        if (isValid) setCurrentStep("confirmation")
        break
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case "account":
        setCurrentStep("invitation")
        break
      case "security":
        setCurrentStep("account")
        break
      case "confirmation":
        setCurrentStep("security")
        break
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const getStepIcon = (step: OnboardingStep) => {
    switch (step) {
      case "invitation":
        return <Shield className="w-5 h-5" />
      case "account":
        return <UserCheck className="w-5 h-5" />
      case "security":
        return <Lock className="w-5 h-5" />
      case "confirmation":
        return <Check className="w-5 h-5" />
    }
  }

  const steps = [
    { key: "invitation", label: "Invitation", icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { key: "account", label: "Account", icon: <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { key: "security", label: "Security", icon: <Lock className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { key: "confirmation", label: "Complete", icon: <Check className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ]

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-3 sm:mb-4 lg:mb-6 min-h-[44px] text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
            Back to Home
          </Link>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-primary">
            Exclusive Onboarding
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Join the elite banking experience</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-4 sm:mb-6 lg:mb-8 px-1 sm:px-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center flex-1 max-w-[80px] sm:max-w-none">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStepIndex
                    ? "bg-primary text-primary-foreground neon-glow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-xs sm:text-sm mt-1 sm:mt-2 text-muted-foreground text-center leading-tight">
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="glass p-4 sm:p-6 md:p-8 lg:p-10 neon-glow-subtle">
          {currentStep === "invitation" && (
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="text-center">
                <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
                  Invitation Code
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                  Enter your exclusive 7-digit invitation code
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <div>
                  <Label htmlFor="invitationCode" className="text-xs sm:text-sm md:text-base font-medium">
                    Invitation Code
                  </Label>
                  <Input
                    id="invitationCode"
                    type="text"
                    maxLength={7}
                    value={formData.invitationCode}
                    onChange={(e) => updateFormData("invitationCode", e.target.value.replace(/\D/g, ""))}
                    className="glass-input text-center text-lg sm:text-xl md:text-2xl tracking-widest min-h-[48px] sm:min-h-[52px] md:min-h-[56px] mt-1 sm:mt-2"
                    placeholder="0000000"
                  />
                  {errors.invitationCode && (
                    <p className="text-destructive text-xs sm:text-sm mt-1">{errors.invitationCode}</p>
                  )}
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full neon-glow min-h-[48px] sm:min-h-[52px] md:min-h-[56px] text-sm sm:text-base md:text-lg font-medium"
                  size="lg"
                >
                  <span>Verify Code</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === "account" && (
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="text-center">
                <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
                  Create Account
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                  Set up your exclusive banking credentials
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <Label htmlFor="email" className="text-xs sm:text-sm md:text-base font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="glass-input min-h-[44px] sm:min-h-[48px] md:min-h-[52px] text-sm sm:text-base mt-1 sm:mt-2"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-destructive text-xs sm:text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="password" className="text-xs sm:text-sm md:text-base font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="glass-input min-h-[44px] sm:min-h-[48px] md:min-h-[52px] text-sm sm:text-base mt-1 sm:mt-2"
                    placeholder="Create a strong password"
                  />
                  {errors.password && <p className="text-destructive text-xs sm:text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-xs sm:text-sm md:text-base font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className="glass-input min-h-[44px] sm:min-h-[48px] md:min-h-[52px] text-sm sm:text-base mt-1 sm:mt-2"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-destructive text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 glass-dark bg-transparent min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 neon-glow min-h-[48px] sm:min-h-[48px] text-sm sm:text-base font-medium"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === "security" && (
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="text-center">
                <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
                  Security Setup
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                  Configure your transaction security
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <Label htmlFor="transactionPin" className="text-xs sm:text-sm md:text-base font-medium">
                    4-Digit Transaction PIN
                  </Label>
                  <Input
                    id="transactionPin"
                    type="password"
                    maxLength={4}
                    value={formData.transactionPin}
                    onChange={(e) => updateFormData("transactionPin", e.target.value.replace(/\D/g, ""))}
                    className="glass-input text-center text-lg sm:text-xl md:text-2xl tracking-widest min-h-[48px] sm:min-h-[52px] md:min-h-[56px] mt-1 sm:mt-2"
                    placeholder="••••"
                  />
                  {errors.transactionPin && (
                    <p className="text-destructive text-xs sm:text-sm mt-1">{errors.transactionPin}</p>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    This PIN will be required for all transactions
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPin" className="text-xs sm:text-sm md:text-base font-medium">
                    Confirm Transaction PIN
                  </Label>
                  <Input
                    id="confirmPin"
                    type="password"
                    maxLength={4}
                    value={formData.confirmPin}
                    onChange={(e) => updateFormData("confirmPin", e.target.value.replace(/\D/g, ""))}
                    className="glass-input text-center text-lg sm:text-xl md:text-2xl tracking-widest min-h-[48px] sm:min-h-[52px] md:min-h-[56px] mt-1 sm:mt-2"
                    placeholder="••••"
                  />
                  {errors.confirmPin && <p className="text-destructive text-xs sm:text-sm mt-1">{errors.confirmPin}</p>}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-2 sm:p-3">
                    <Checkbox
                      id="agreement"
                      checked={formData.agreementAccepted}
                      onCheckedChange={(checked) => updateFormData("agreementAccepted", checked as boolean)}
                      className="mt-1 flex-shrink-0"
                    />
                    <Label htmlFor="agreement" className="text-xs sm:text-sm leading-relaxed cursor-pointer">
                      I accept the security and compliance agreement, and understand that all transactions require PIN
                      verification and email confirmation.
                    </Label>
                  </div>
                  {errors.agreement && <p className="text-destructive text-xs sm:text-sm">{errors.agreement}</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 glass-dark bg-transparent min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 neon-glow min-h-[48px] sm:min-h-[48px] text-sm sm:text-base font-medium"
                  >
                    Complete Setup
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === "confirmation" && (
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/20 rounded-full flex items-center justify-center neon-glow animate-pulse">
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
                </div>
              </div>

              <div>
                <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
                  Welcome to Rive
                </h2>
                <p className="text-muted-foreground mb-4 sm:mb-6 lg:mb-8 text-xs sm:text-sm md:text-base leading-relaxed">
                  You now have access to elite banking. Your account has been created successfully.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Link href="/dashboard">
                  <Button
                    className="w-full neon-glow min-h-[48px] sm:min-h-[52px] md:min-h-[56px] text-sm sm:text-base md:text-lg font-medium"
                    size="lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full glass-dark bg-transparent min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium"
                  >
                    Login Later
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
