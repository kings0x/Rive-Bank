import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Users, Globe, Award, TrendingUp, Lock, Zap, Crown, ArrowRight, CheckCircle, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-40 sm:h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 text-center px-3 sm:px-4 md:px-6 lg:px-8 max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto">
          <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8 text-primary leading-tight">
              RIVE
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light mb-2 sm:mb-3 md:mb-4 text-foreground/90 leading-tight">
              Banking for the 1% of the 1%
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
              Experience ultra-luxury digital banking designed exclusively for high-net-worth individuals and elite
              businesses with unparalleled security, personalized service, and global reach.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:justify-center md:items-center max-w-xs sm:max-w-lg md:max-w-none mx-auto">
            <Link href="/login" className="w-full md:w-auto">
              <Button
                size="lg"
                className="glass neon-glow transition-all duration-300 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium hover:shadow-[0_0_30px_rgba(213,0,109,0.5)] w-full md:w-auto min-h-[48px] sm:min-h-[52px]"
              >
                <span className="truncate">Login to Rive Online Banking</span>
              </Button>
            </Link>
            <Link href="/onboarding" className="w-full md:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="glass-dark border-secondary/50 hover:border-secondary hover:shadow-[0_0_30px_rgba(213,0,109,0.5)] transition-all duration-300 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium bg-transparent w-full md:w-auto min-h-[48px] sm:min-h-[52px]"
              >
                <span className="truncate">Exclusive Onboarding</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 sm:py-12 md:py-16 px-4 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">$50B+</div>
              <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Assets Under Management</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">99.99%</div>
              <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Uptime Guarantee</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Concierge Support</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">FDIC</div>
              <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Insured Member</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-foreground leading-tight">
              Invitation-Only Excellence
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
              Rive Banking operates on an exclusive invitation-only basis, serving only the most distinguished clients
              with unparalleled financial services and cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <Card className="glass p-4 sm:p-6 lg:p-8 hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
                </div>
                <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 text-foreground leading-tight">
                  VIP Banking Services
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Personalized banking solutions tailored to your unique financial needs and lifestyle with dedicated
                  relationship managers.
                </p>
              </div>
            </Card>

            <Card className="glass p-4 sm:p-6 lg:p-8 hover:shadow-[0_0_30px_rgba(213,0,109,0.5)] transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-secondary" />
                </div>
                <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 text-foreground leading-tight">
                  Large Transaction Support
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Seamless handling of high-value transactions with institutional-grade security, same-day processing,
                  and global reach.
                </p>
              </div>
            </Card>

            <Card className="glass p-4 sm:p-6 lg:p-8 hover:shadow-[0_0_30px_rgba(76,175,80,0.5)] transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-accent" />
                </div>
                <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 text-foreground leading-tight">
                  Crypto + Fiat Banking
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Advanced digital asset management alongside traditional banking services with real-time portfolio
                  tracking.
                </p>
              </div>
            </Card>

            <Card className="glass p-4 sm:p-6 lg:p-8 hover:shadow-[0_0_30px_rgba(0,188,212,0.5)] transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
                </div>
                <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 text-foreground leading-tight">
                  Concierge Membership
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  24/7 dedicated support with white-glove service, priority assistance, and exclusive financial advisory
                  services.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Banking Services Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-muted/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-foreground leading-tight">
              Comprehensive Banking Solutions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
              From everyday banking to complex financial strategies, we provide the full spectrum of services you expect
              from a world-class institution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold leading-tight">
                Private Banking
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                Exclusive private banking services with dedicated wealth managers and customized investment strategies.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Portfolio Management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Estate Planning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Tax Optimization</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-secondary" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold leading-tight">
                International Banking
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                Global banking solutions with multi-currency accounts and international wire transfers.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Multi-Currency Accounts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Foreign Exchange</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Global Wire Transfers</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-accent/20 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-accent" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold leading-tight">
                Security & Compliance
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                Bank-grade security with advanced encryption and regulatory compliance across all jurisdictions.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>256-bit Encryption</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Multi-Factor Authentication</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Regulatory Compliance</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold leading-tight">
                Investment Services
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                Access to exclusive investment opportunities and alternative assets typically reserved for institutions.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Private Equity</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Hedge Funds</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Real Estate</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-secondary" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold leading-tight">
                Business Banking
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                Comprehensive business banking solutions for enterprises, startups, and high-growth companies.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Corporate Accounts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Credit Lines</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Treasury Management</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-accent/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-accent" />
              </div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold leading-tight">
                Lifestyle Services
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                Beyond banking - exclusive lifestyle services and experiences curated for our elite members.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Concierge Services</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Exclusive Events</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 flex-shrink-0" />
                  <span>Travel Benefits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Membership Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 relative">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative z-10 max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8 md:mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-foreground leading-tight">
              Membership is Earned, Not Requested
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 md:mb-8 leading-relaxed">
              Our exclusive VIP cards represent more than banking—they symbolize membership in an elite financial
              ecosystem with access to opportunities unavailable elsewhere.
            </p>
          </div>

          <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
            <div className="relative">
              <Card className="glass-dark p-4 sm:p-6 md:p-8 w-64 sm:w-72 md:w-80 h-32 sm:h-40 md:h-48 flex items-center justify-center shadow-[0_0_20px_rgba(213,0,109,0.3)]">
                <div className="text-center">
                  <div className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-primary">
                    RIVE ELITE
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 md:mb-4">INVITATION ONLY</div>
                  <div className="w-full h-4 sm:h-6 md:h-8 bg-primary/30 rounded"></div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Elite Status</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Exclusive access to premium services and investment opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-secondary" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Priority Support</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Dedicated relationship managers and 24/7 concierge services
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Global Access</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Worldwide banking privileges and exclusive partner benefits
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground italic mb-4 sm:mb-6 md:mb-8">
            "Only by invitation. Membership is earned, not requested."
          </p>

          <Link href="/onboarding">
            <Button
              size="lg"
              className="neon-glow px-4 sm:px-6 md:px-8 py-3 sm:py-4 min-h-[48px] sm:min-h-[52px] text-sm sm:text-base md:text-lg font-medium"
            >
              Request Invitation
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 md:py-12 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-4 sm:mb-6 md:mb-8">
            <div>
              <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2">RIVE</h3>
              <p className="text-sm text-muted-foreground mb-3 sm:mb-4">Banking for the Elite</p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Rive Banking is a member of FDIC and provides banking services exclusively to qualified high-net-worth
                individuals and institutions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <Link
                  href="/services/private-banking"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Private Banking
                </Link>
                <Link
                  href="/services/investment"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Investment Services
                </Link>
                <Link
                  href="/services/business"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Business Banking
                </Link>
                <Link
                  href="/services/international"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  International Banking
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Contact Support
                </Link>
                <Link
                  href="/security"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Security Center
                </Link>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Help Center
                </Link>
                <Link
                  href="/status"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  System Status
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/compliance"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Compliance
                </Link>
                <Link
                  href="/disclosures"
                  className="text-muted-foreground hover:text-primary transition-colors block min-h-[32px] flex items-center"
                >
                  Disclosures
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 md:pt-8 border-t border-border/30 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 Rive Banking. All rights reserved. Member FDIC. Equal Housing Lender.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
