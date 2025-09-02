// Authentication utilities for Rive Banking

export interface User {
  email: string
  name?: string
  membershipTier: "Elite" | "Platinum" | "Diamond"
  accountNumber: string
}

export const AUTH_TOKEN_KEY = "rive_auth_token"
export const USER_EMAIL_KEY = "rive_user_email"

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(USER_EMAIL_KEY)
}

export function getCurrentUser(): User | null {
  const email = getUserEmail()
  if (!email) return null

  // Mock user data - in real app this would come from API
  return {
    email,
    name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
    membershipTier: "Elite",
    accountNumber: "****" + Math.random().toString().slice(-4),
  }
}

export function logout(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(USER_EMAIL_KEY)

  // Redirect to home page
  window.location.href = "/"
}

export function login(email: string, token: string): void {
  if (typeof window === "undefined") return

  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(USER_EMAIL_KEY, email)
}

// Mock authentication function
export async function authenticateUser(
  email: string,
  password: string,
): Promise<{
  success: boolean
  token?: string
  error?: string
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock validation - in real app this would validate against backend
  if (email.includes("@") && password.length >= 1) {
    return {
      success: true,
      token: "mock_token_" + Date.now(),
    }
  }

  return {
    success: false,
    error: "Invalid credentials",
  }
}
