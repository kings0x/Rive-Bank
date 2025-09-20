"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getCurrentUser } from "@/lib/auth"
import { SecurityAudit } from "./security-audit"
import { User, Shield, Key, Smartphone, Mail, Check } from "lucide-react"
import { useAccountStore } from "@/store/account-store"

interface ProfileSecurityProps {
  activeTab: "profile" | "security"
  onTabChange?: (tab: "profile" | "security") => void
}

export function ProfileSecurity({ activeTab, onTabChange }: ProfileSecurityProps) {
  const user = getCurrentUser()
  const [isEditing, setIsEditing] = useState(false)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [currentAction, setCurrentAction] = useState("")
  const [transactionPin, setTransactionPin] = useState("")
  const [emailPin, setEmailPin] = useState("")
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    sessionTimeout: 30,
    transactionAlerts: true,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [pinData, setPinData] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  })
  const accountDetails = useAccountStore((s) => s.accountDetails)

  const updateProfileData = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const updatePasswordData = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const updatePinData = (field: string, value: string) => {
    setPinData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTabChange = (value: string) => {
    if (onTabChange && (value === "profile" || value === "security")) {
      onTabChange(value)
    }
  }

  const handlePinVerification = async() => {
    

    if (transactionPin.length === 4) {
      if (currentAction === "save-profile") {
        if (emailPin.length === 6) {
          const response = await fetch("/api/update-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              emailPin: emailPin,
              pin: transactionPin
            }),
          })

          if (!response.ok) {
            const errorData = await response.json();
            
            if(errorData.error === "Incorrect EmailCode or Pin") {
              alert("Email or Pin is Incorrect!");
              return;
            }
            alert("Profile information NOT updated");
            console.log(errorData.error);
            return
          }
          setShowPinDialog(false)
          setIsEditing(false)
          setTransactionPin("")
          setEmailPin("")
          alert("Profile information updated successfully!")
        } else {
          alert("Please enter the 6-digit PIN sent to your email.")
        }
      } else if (currentAction === "update-password") {
        if (emailPin.length === 6) {
          const response = await fetch("/api/update-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              oldPassword: passwordData.currentPassword,
              newPassword: passwordData.newPassword,
              emailPin: emailPin
            }),
          })

          if (!response.ok) {
            const errorData = await response.json();
            
            if(errorData.error === "Incorrect EmailCode or Pin") {
              alert("Email or Pin is Incorrect!");
              return;
            }
            alert("Password is incorrect!");
            console.log(errorData.error);
            return
          }
          setShowPinDialog(false)
          setTransactionPin("")
          setEmailPin("")
          alert("Password updated successfully!")
          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } else {
          alert("Please enter the 6-digit PIN sent to your email.")
        }
      } else if (currentAction === "update-pin") {
        if (emailPin.length === 6) {
          const response = await fetch("/api/confirm-pin-change", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pin: transactionPin,
              emailPin: emailPin,
              accounts: accountDetails,
            }),
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error === "Incorrect PIN") {
              alert("pin is incorrect!");
              return;
            }
            if(errorData.error === "Invalid email pin") {
              alert("email pin is incorrect!");
              return;
            }
            console.log(errorData.error);
          }
          setShowPinDialog(false)
          setTransactionPin("")
          setEmailPin("")
          alert("Transaction PIN updated successfully!")
          setPinData({ currentPin: "", newPin: "", confirmPin: "" })
        } else {
          alert("Please enter the 6-digit PIN sent to your email.")
        }
      }
    } else {
      alert("Please enter your 4-digit transaction PIN.")
    }
  }

  const handleSaveProfile = async() => {
    const response = await fetch("/api/verify-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accounts: accountDetails,
      }),
      credentials: "include"
    })

    if(!response.ok){
      const errorData = await response.json()
      if(errorData){
        alert("Validation Error")
        console.log(errorData.error)
        return
      }
    }
    setCurrentAction("save-profile")
    setShowPinDialog(true)
  }

  const handleUpdatePassword = async() => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!")
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!")
      return
    }

    const response = await fetch("/api/verify-change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accounts: accountDetails,
      }),
      credentials: "include"
    })

    if(!response.ok){
      const errorData = await response.json()
      if(errorData){
        alert("Validation Error")
        console.log(errorData.error)
        return
      }
      
    }


    setCurrentAction("update-password")
    setShowPinDialog(true)
  }

  const handleUpdatePin = async() => {
    if (pinData.newPin !== pinData.confirmPin) {
      alert("New PINs do not match!")
      return
    }
    if (pinData.newPin.length !== 4) {
      alert("PIN must be exactly 4 digits!")
      return
    }

    const response = await fetch("/api/verify-change-pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accounts: accountDetails,
        pin: pinData.currentPin
      })
    })

    if(!response.ok){
      const errorData = await response.json()
      if(errorData.error === "Incorrect PIN"){
        alert("Current pin is incorrect!")
        return
      }
      console.log(process.env.DATABASE_ID,
            process.env.USER_ACCOUNT_COLLECTION_ID,)
      console.log(errorData.error)
      return
    }

    setCurrentAction("update-pin")
    setShowPinDialog(true)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="glass-dark border border-emerald-500/20">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 transition-all duration-200"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 transition-all duration-200"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Information */}
          <Card className="glass p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-emerald-400">Profile Information</h3>
                  <p className="text-muted-foreground">Manage your account details</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTabChange("security")}
                className="glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => updateProfileData("name", e.target.value)}
                  className="glass-input border-emerald-500/20 focus:border-emerald-500/50"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => updateProfileData("email", e.target.value)}
                  className="glass-input border-emerald-500/20 focus:border-emerald-500/50"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => updateProfileData("phone", e.target.value)}
                  className="glass-input border-emerald-500/20 focus:border-emerald-500/50"
                  placeholder="+1 (555) 123-4567"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Membership Tier</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="font-medium text-emerald-400">{user?.membershipTier} Member</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-emerald-500/20">
              {!isEditing ? (
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <Card className="glass p-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-emerald-400">Security Settings</h3>
                  <p className="text-muted-foreground">Manage your account security</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTabChange("profile")}
                className="glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
              >
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  disabled={true}
                  className="data-[state=checked]:bg-emerald-500 opacity-100"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive transaction alerts via email</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.emailNotifications}
                  disabled={true}
                  className="data-[state=checked]:bg-emerald-500 opacity-100"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.smsNotifications}
                  disabled={true}
                  className="data-[state=checked]:bg-emerald-500 opacity-100"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-medium">Transaction Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of all transaction activities</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.transactionAlerts}
                  disabled={true}
                  className="data-[state=checked]:bg-emerald-500 opacity-100"
                />
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="glass p-6 border border-emerald-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <Key className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-emerald-400">Change Password</h4>
                <p className="text-sm text-muted-foreground">Update your login password</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => updatePasswordData("currentPassword", e.target.value)}
                  className="glass-input border-emerald-500/20 focus:border-emerald-500/50"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => updatePasswordData("newPassword", e.target.value)}
                  className="glass-input border-emerald-500/20 focus:border-emerald-500/50"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => updatePasswordData("confirmPassword", e.target.value)}
                  className="glass-input border-emerald-500/20 focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                onClick={handleUpdatePassword}
              >
                Update Password
              </Button>
            </div>
          </Card>

          {/* Change Transaction PIN */}
          <Card className="glass p-6 border border-emerald-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <Shield className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-emerald-400">Change Transaction PIN</h4>
                <p className="text-sm text-muted-foreground">Update your 4-digit transaction PIN</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentPin">Current PIN</Label>
                <Input
                  id="currentPin"
                  type="password"
                  maxLength={4}
                  value={pinData.currentPin}
                  onChange={(e) => updatePinData("currentPin", e.target.value.replace(/\D/g, ""))}
                  className="glass-input text-center border-emerald-500/20 focus:border-emerald-500/50"
                  placeholder="••••"
                />
              </div>
              <div>
                <Label htmlFor="newPin">New PIN</Label>
                <Input
                  id="newPin"
                  type="password"
                  maxLength={4}
                  value={pinData.newPin}
                  onChange={(e) => updatePinData("newPin", e.target.value.replace(/\D/g, ""))}
                  className="glass-input text-center border-emerald-500/20 focus:border-emerald-500/50"
                  placeholder="••••"
                />
              </div>
              <div>
                <Label htmlFor="confirmPin">Confirm PIN</Label>
                <Input
                  id="confirmPin"
                  type="password"
                  maxLength={4}
                  value={pinData.confirmPin}
                  onChange={(e) => updatePinData("confirmPin", e.target.value.replace(/\D/g, ""))}
                  className="glass-input text-center border-emerald-500/20 focus:border-emerald-500/50"
                  placeholder="••••"
                />
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="glass-dark bg-transparent border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                onClick={handleUpdatePin}
              >
                Update PIN
              </Button>
            </div>
          </Card>

          <SecurityAudit />
        </TabsContent>
      </Tabs>

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
