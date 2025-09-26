"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useEffect } from "react";
import { useUserIdStore } from "@/store/account-store";
import { Toaster, toast } from "sonner"
import {performLogin} from "../../lib/actions/user.actions";

//on reload, checks wether the user is connected if not redirects to login
//make it get balances from the backend
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false }, []);
  const userId = useUserIdStore(s => s.userId);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.password.length < 1) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    if(userId) {
      router.push("/dashboard");
      return
    };

    setIsLoading(true)
    
    try{
        const response = await performLogin(formData);

      if (!response) {
        setErrors({ email: "Invalid email or password" })
        setIsLoading(false);
        return
      }
      console.log(response);
      router.push("/dashboard");
      toast.success("successful");
      
      if (isMountedRef.current) setIsLoading(false);
    }
    
    catch(error: any){
      console.log(error)
      if (isMountedRef.current) setIsLoading(false);
    }
    
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
  <>
      
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-40 sm:h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500"></div>
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
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-primary">
            RIVE
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Secure Online Banking</p>
        </div>

        {/* Login Form */}
        <Card className="glass p-4 sm:p-6 md:p-8 lg:p-10 neon-glow-subtle">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
                Welcome Back
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Access your exclusive banking portal
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
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="glass-input min-h-[44px] sm:min-h-[48px] md:min-h-[52px] text-sm sm:text-base mt-1 sm:mt-2"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                {errors.email && <p className="text-destructive text-xs sm:text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-xs sm:text-sm md:text-base font-medium">
                  Password
                </Label>
                <div className="relative mt-1 sm:mt-2">
                  <Input
                    id="password"
                    type="text"                     // NEVER "password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className={`glass-input pr-12 sm:pr-14 min-h-[44px] sm:min-h-[48px] md:min-h-[52px] text-sm sm:text-base ${!showPassword ? 'masked-input' : ''}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs sm:text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:text-primary/80 transition-colors min-h-[44px] flex items-center justify-center sm:justify-start font-medium"
                >
                  Forgot password?
                </Link>
                <Link
                  href="/onboarding"
                  className="text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center justify-center sm:justify-end font-medium"
                >
                  Need an account?
                </Link>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full neon-glow min-h-[48px] sm:min-h-[52px] md:min-h-[56px] text-sm sm:text-base md:text-lg font-medium"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2 sm:mr-3"></div>
                    <span className="text-sm sm:text-base">Authenticating...</span>
                  </div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base md:text-lg">Login to Rive</span>
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">Protected by enterprise-grade security</p>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="mt-3 sm:mt-4 lg:mt-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your connection is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  </>
    
  )
}
