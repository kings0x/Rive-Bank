"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Mail, Check } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    // Mock password reset request
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <Card className="glass p-4 sm:p-6 md:p-8 lg:p-10 neon-glow-subtle text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 neon-glow">
              <Check className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 lg:mb-6">
              Check Your Email
            </h2>
            <p className="text-muted-foreground mb-4 sm:mb-6 lg:mb-8 text-xs sm:text-sm md:text-base leading-relaxed">
              We've sent password reset instructions to <strong className="break-all text-primary">{email}</strong>
            </p>
            <Link href="/login">
              <Button className="w-full neon-glow min-h-[48px] sm:min-h-[52px] md:min-h-[56px] text-sm sm:text-base md:text-lg font-medium">
                Return to Login
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-3 sm:mb-4 lg:mb-6 min-h-[44px] text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
            Back to Login
          </Link>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-primary">
            Reset Password
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
            Enter your email to receive reset instructions
          </p>
        </div>

        <Card className="glass p-4 sm:p-6 md:p-8 lg:p-10 neon-glow-subtle">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-primary mx-auto mb-3 sm:mb-4 lg:mb-6" />
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
                Forgot Your Password?
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                No worries. We'll send you reset instructions.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              <div>
                <Label htmlFor="email" className="text-xs sm:text-sm md:text-base font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  className="glass-input min-h-[44px] sm:min-h-[48px] md:min-h-[52px] text-sm sm:text-base mt-1 sm:mt-2"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                {error && <p className="text-destructive text-xs sm:text-sm mt-1">{error}</p>}
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full neon-glow min-h-[48px] sm:min-h-[52px] md:min-h-[56px] text-sm sm:text-base md:text-lg font-medium"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2 sm:mr-3"></div>
                    <span className="text-sm sm:text-base">Sending...</span>
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base md:text-lg">Send Reset Instructions</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
