"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Headphones,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Send,
  FileText,
  Users,
  Shield,
  CreditCard,
  ArrowUpDown,
} from "lucide-react"

interface SupportTicket {
  id: string
  subject: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  createdAt: string
  lastUpdate: string
  messages: Array<{
    id: string
    sender: "user" | "support"
    message: string
    timestamp: string
  }>
}

const mockTickets: SupportTicket[] = [
  {
    id: "TKT-2025-001",
    subject: "Wire Transfer Delay Issue",
    status: "resolved",
    priority: "high",
    category: "Transfers",
    createdAt: "2025-01-15",
    lastUpdate: "2025-01-15 16:45",
    messages: [
      {
        id: "1",
        sender: "user",
        message: "My wire transfer to Goldman Sachs has been pending for 3 hours. Can you please check the status?",
        timestamp: "2025-01-15 11:00",
      },
      {
        id: "2",
        sender: "support",
        message:
          "Thank you for contacting Rive Banking. I reviewed your wire transfer and the delay was due to additional compliance verification required for high-value transactions. This has now been resolved and your transfer has been completed successfully.",
        timestamp: "2025-01-15 16:45",
      },
    ],
  },
  {
    id: "TKT-2025-002",
    subject: "Card Replacement Request",
    status: "resolved",
    priority: "medium",
    category: "Cards",
    createdAt: "2025-01-14",
    lastUpdate: "2025-01-14 16:45",
    messages: [
      {
        id: "1",
        sender: "user",
        message: "I need to replace my Platinum card as it was damaged.",
        timestamp: "2025-01-14 10:00",
      },
      {
        id: "2",
        sender: "support",
        message:
          "Your replacement Rive Platinum card has been expedited and delivered successfully. The issue has been resolved.",
        timestamp: "2025-01-14 16:45",
      },
    ],
  },
  {
    id: "TKT-2025-003",
    subject: "Account Access Issue",
    status: "resolved",
    priority: "medium",
    category: "Security",
    createdAt: "2025-01-13",
    lastUpdate: "2025-01-13 14:20",
    messages: [
      {
        id: "1",
        sender: "user",
        message: "I'm having trouble accessing my account through the mobile app.",
        timestamp: "2025-01-13 09:15",
      },
      {
        id: "2",
        sender: "support",
        message:
          "The mobile app access issue has been resolved. Your account security has been verified and full access has been restored.",
        timestamp: "2025-01-13 14:20",
      },
    ],
  },
]

const faqData = [
  {
    category: "Account Management",
    icon: Users,
    questions: [
      {
        question: "How do I update my profile information?",
        answer:
          "Navigate to the Profile section in your dashboard. You can update your personal information, contact details, and preferences. Changes are saved automatically and may require verification for security purposes.",
      },
      {
        question: "What are the different membership tiers?",
        answer:
          "Rive Banking offers Elite, Platinum, and Diamond membership tiers. Each tier provides increasing levels of service, higher transaction limits, and exclusive benefits. Membership tiers are based on account balance and relationship history.",
      },
    ],
  },
  {
    category: "Security",
    icon: Shield,
    questions: [
      {
        question: "How secure is my account?",
        answer:
          "Your account is protected by bank-grade 256-bit encryption, multi-factor authentication, and continuous monitoring. We employ advanced fraud detection systems and comply with all financial regulations.",
      },
      {
        question: "What should I do if I suspect unauthorized access?",
        answer:
          "Immediately contact our 24/7 security hotline at +1-800-RIVE-SEC. We'll freeze your account, investigate the issue, and restore security. You're protected by our zero-liability policy for unauthorized transactions.",
      },
    ],
  },
  {
    category: "Transfers & Payments",
    icon: ArrowUpDown,
    questions: [
      {
        question: "What are the wire transfer limits?",
        answer:
          "Daily wire transfer limits vary by membership tier: Elite ($1M), Platinum ($5M), Diamond ($25M). International transfers may have additional requirements and processing times of 1-3 business days.",
      },
      {
        question: "How long do transfers take to process?",
        answer:
          "Domestic wire transfers typically process within 2-4 hours during business days. International transfers take 1-3 business days. Same-day processing is available for urgent transfers with additional fees.",
      },
    ],
  },
  {
    category: "Cards & Payments",
    icon: CreditCard,
    questions: [
      {
        question: "How do I request a new card?",
        answer:
          "Visit the Cards section in your dashboard and click 'Request New Card'. Choose your card type and delivery method. Standard delivery takes 3-5 business days, while expedited delivery takes 24 hours.",
      },
      {
        question: "What should I do if my card is lost or stolen?",
        answer:
          "Immediately lock your card through the mobile app or dashboard, then contact our 24/7 support line. We'll issue a replacement card and monitor your account for any unauthorized activity.",
      },
    ],
  },
]

export function CustomerSupport() {
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null)
  const [newTicketData, setNewTicketData] = useState({
    subject: "",
    category: "",
    priority: "medium" as const,
    description: "",
  })
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: "1",
      sender: "support" as const,
      message: "Hello! I'm Sarah from Rive Banking. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "resolved":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "closed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-500/20 text-green-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "high":
        return "bg-orange-500/20 text-orange-400"
      case "urgent":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const handleCreateTicket = () => {
    if (!newTicketData.subject || !newTicketData.description) {
      alert("Please fill in all required fields.")
      return
    }

    console.log("[v0] Creating support ticket:", newTicketData)
    alert("Support ticket created successfully! The bank will reach out via email as soon as possible.")
    setNewTicketData({ subject: "", category: "", priority: "medium", description: "" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      sender: "user" as const,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    }

    setChatMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate support response
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        sender: "support" as const,
        message:
          "Hello, our support system is currently undergoing maintenance. A ticket has been created for you with the following ID: RVB-01156. Please email our support team at support.rivebank@gmail.com with your ticket ID and details of your complaint, and we will get back to you promptly.",
        timestamp: new Date().toLocaleTimeString(),
      }
      setChatMessages((prev) => [...prev, response])
    }, 2000)
  }

  const filteredFaq = faqData.filter((category) =>
    category.questions.some(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-emerald-400">Customer Support</h2>
          <p className="text-muted-foreground">24/7 premium support for our elite members</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-emerald-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Support Online</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="glass-dark border border-emerald-500/20">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="tickets"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            My Tickets
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            FAQ
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className="glass p-6 border border-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer"
              onClick={() => setChatOpen(true)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Instant support</p>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 border border-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">Call Support</h3>
                  <p className="text-sm text-muted-foreground">+1-800-RIVE-VIP</p>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 border border-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support.rivebank@gmail.com</p>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 border border-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">24/7 Available</h3>
                  <p className="text-sm text-muted-foreground">Always here</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Tickets */}
          <Card className="glass p-6 border border-emerald-500/20">
            <h3 className="font-serif text-xl font-semibold text-emerald-400 mb-4">Recent Support Tickets</h3>
            <div className="space-y-4">
              {mockTickets.slice(0, 3).map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  onClick={() => setActiveTicket(ticket)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">#{ticket.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                    <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          {/* Create New Ticket */}
          <Card className="glass p-6 border border-emerald-500/20">
            <h3 className="font-serif text-xl font-semibold text-emerald-400 mb-4">Create New Support Ticket</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newTicketData.subject}
                  onChange={(e) => setNewTicketData((prev) => ({ ...prev, subject: e.target.value }))}
                  className="glass-input border-emerald-500/20 focus:border-emerald-500/50"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newTicketData.category}
                  onChange={(e) => setNewTicketData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full glass-input border-emerald-500/20 focus:border-emerald-500/50 bg-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="account">Account Management</option>
                  <option value="transfers">Transfers & Payments</option>
                  <option value="cards">Cards & Services</option>
                  <option value="security">Security & Access</option>
                  <option value="technical">Technical Support</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTicketData.description}
                onChange={(e) => setNewTicketData((prev) => ({ ...prev, description: e.target.value }))}
                className="glass-input border-emerald-500/20 focus:border-emerald-500/50 min-h-[100px]"
                placeholder="Please provide detailed information about your issue..."
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Label>Priority:</Label>
                <select
                  value={newTicketData.priority}
                  onChange={(e) => setNewTicketData((prev) => ({ ...prev, priority: e.target.value as any }))}
                  className="glass-input border-emerald-500/20 focus:border-emerald-500/50 bg-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <Button
                onClick={handleCreateTicket}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
            </div>
          </Card>

          {/* Existing Tickets */}
          <Card className="glass p-6 border border-emerald-500/20">
            <h3 className="font-serif text-xl font-semibold text-emerald-400 mb-4">Your Support Tickets</h3>
            <div className="space-y-4">
              {mockTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  onClick={() => setActiveTicket(ticket)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{ticket.subject}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      #{ticket.id} • {ticket.category}
                    </span>
                    <span>Last updated: {ticket.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          {/* FAQ Search */}
          <Card className="glass p-6 border border-emerald-500/20">
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-emerald-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input border-emerald-500/20 focus:border-emerald-500/50"
                placeholder="Search frequently asked questions..."
              />
            </div>
          </Card>

          {/* FAQ Categories */}
          <div className="space-y-4">
            {filteredFaq.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.category} className="glass border border-emerald-500/20">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-emerald-400">{category.category}</h3>
                    </div>
                    <div className="space-y-3">
                      {category.questions.map((faq, index) => (
                        <div key={index} className="border border-emerald-500/20 rounded-lg">
                          <button
                            onClick={() =>
                              setExpandedFaq(
                                expandedFaq === `${category.category}-${index}`
                                  ? null
                                  : `${category.category}-${index}`,
                              )
                            }
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-emerald-500/5 transition-colors"
                          >
                            <span className="font-medium">{faq.question}</span>
                            {expandedFaq === `${category.category}-${index}` ? (
                              <ChevronDown className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                          {expandedFaq === `${category.category}-${index}` && (
                            <div className="p-4 pt-0 text-muted-foreground">{faq.answer}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass p-6 border border-emerald-500/20">
              <h3 className="font-serif text-xl font-semibold text-emerald-400 mb-4">Elite Support Hotline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-semibold">+1-800-RIVE-VIP (748-3847)</p>
                    <p className="text-sm text-muted-foreground">24/7 Premium Support</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-semibold">Available 24/7</p>
                    <p className="text-sm text-muted-foreground">Including holidays</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Headphones className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-semibold">Average Wait Time</p>
                    <p className="text-sm text-muted-foreground">Less than 30 seconds</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 border border-emerald-500/20">
              <h3 className="font-serif text-xl font-semibold text-emerald-400 mb-4">Digital Support</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-semibold">support.rivebank@gmail.com</p>
                    <p className="text-sm text-muted-foreground">Email Support</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-semibold">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Instant messaging support</p>
                  </div>
                </div>
                <Button
                  onClick={() => setChatOpen(true)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
              </div>
            </Card>
          </div>

          {/* Emergency Contacts */}
          <Card className="glass p-6 border border-red-500/20">
            <h3 className="font-serif text-xl font-semibold text-red-400 mb-4">Emergency Support</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-400 mb-2">Security Incidents</h4>
                <p className="text-sm text-muted-foreground mb-2">Unauthorized access, fraud, or security concerns</p>
                <p className="font-mono text-red-400">+1-800-RIVE-SEC (748-3732)</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-400 mb-2">Card Emergencies</h4>
                <p className="text-sm text-muted-foreground mb-2">Lost, stolen, or compromised cards</p>
                <p className="font-mono text-red-400">+1-800-RIVE-CARD (748-3227)</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Live Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4">
          <Card className="glass w-96 h-96 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col">
            <div className="p-4 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">Live Support</h3>
                  <p className="text-xs text-muted-foreground">Sarah - Elite Support Agent</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setChatOpen(false)}>
                ×
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user" ? "bg-emerald-500/20 text-emerald-100" : "bg-gray-500/20 text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-emerald-500/20">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="glass-input border-emerald-500/20 focus:border-emerald-500/50"
                  placeholder="Type your message..."
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {activeTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glass max-w-2xl w-full border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-emerald-400">{activeTicket.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    #{activeTicket.id} • {activeTicket.category}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(activeTicket.priority)}>{activeTicket.priority}</Badge>
                  <Badge className={getStatusColor(activeTicket.status)}>{activeTicket.status}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTicket(null)}>
                    ×
                  </Button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activeTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.sender === "user" ? "bg-emerald-500/10 ml-8" : "bg-gray-500/10 mr-8"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">
                        {message.sender === "user" ? "You" : "Rive Support"}
                      </span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-500/20">
                <Button
                  variant="outline"
                  className="w-full glass-dark bg-transparent border-emerald-500/30"
                  onClick={() => setActiveTicket(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
