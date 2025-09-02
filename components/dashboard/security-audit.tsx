"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SecurityManager, type SecurityEvent } from "@/lib/security"
import { Shield, AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react"

export function SecurityAudit() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const securityManager = SecurityManager.getInstance()

  const loadSecurityEvents = () => {
    setIsLoading(true)
    setTimeout(() => {
      setSecurityEvents(securityManager.getSecurityEvents())
      setIsLoading(false)
    }, 500)
  }

  useEffect(() => {
    loadSecurityEvents()
  }, [])

  const getEventIcon = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "login":
        return <CheckCircle className="w-4 h-4 text-accent" />
      case "transaction":
        return <Shield className="w-4 h-4 text-primary" />
      case "failed_attempt":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      case "suspicious_activity":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: SecurityEvent["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-accent/20 text-accent">
            Success
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "blocked":
        return (
          <Badge variant="destructive" className="bg-destructive/20">
            Blocked
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatEventType = (type: SecurityEvent["type"]) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-6">
      <Card className="glass p-6 neon-glow-subtle">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl font-semibold">Security Audit Log</h3>
            <p className="text-muted-foreground">Monitor account security events and activities</p>
          </div>
          <Button
            onClick={loadSecurityEvents}
            variant="outline"
            size="sm"
            className="glass-dark bg-transparent"
            disabled={isLoading}
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {securityEvents.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No security events recorded yet</p>
            </div>
          ) : (
            securityEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getEventIcon(event.type)}
                  <div>
                    <p className="font-medium">{formatEventType(event.type)}</p>
                    <p className="text-sm text-muted-foreground">{event.details}</p>
                    <p className="text-xs text-muted-foreground">{event.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">{getStatusBadge(event.status)}</div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
