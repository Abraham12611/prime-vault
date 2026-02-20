import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Lock, 
  ArrowRight, 
  CheckCircle2,
  BarChart3,
  Wallet,
  Activity
} from "lucide-react";

export const metadata: Metadata = {
  title: "Prime Vault - Institutional DeFi Prime Brokerage",
  description: "Secure, compliant prime brokerage for decentralized finance on Arbitrum",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Prime Vault</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/connect" className="text-text-secondary hover:text-white transition-colors">
                Connect
              </Link>
              <Link href="/connect">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-h1 mb-6 text-white">
            Institutional DeFi,{" "}
            <span className="gradient-text">Simplified</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Secure, compliant prime brokerage for decentralized finance. 
            Built on Arbitrum with Safe multi-sig security.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/connect">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-tertiary text-sm mb-8">
            Trusted by leading institutions
          </p>
          <div className="flex items-center justify-center gap-12 opacity-50">
            {/* Partner logos placeholder */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-surface rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-white mb-4">
              Everything you need for institutional DeFi
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Complete prime brokerage infrastructure with enterprise-grade security and compliance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Multi-Sig Security"
              description="Secure your assets with Safe smart contract wallets requiring multiple signatures for every transaction."
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Advanced Trading"
              description="Access top DeFi protocols including Uniswap, Curve, and Aave with institutional-grade risk controls."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Risk Management"
              description="Real-time portfolio monitoring with automated risk alerts and liquidation protection."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Team Governance"
              description="Configure custom approval workflows with flexible multi-signature requirements."
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6" />}
              title="Compliance Ready"
              description="Built-in compliance features with transaction monitoring and reporting tools."
            />
            <FeatureCard
              icon={<Wallet className="w-6 h-6" />}
              title="Portfolio Analytics"
              description="Comprehensive reporting and analytics for performance tracking and risk assessment."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-white mb-4">How It Works</h2>
            <p className="text-text-secondary">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Connect & Configure"
              description="Connect your wallet and configure your institutional Safe with custom signature requirements."
            />
            <StepCard
              number="02"
              title="Deposit & Trade"
              description="Deposit assets into your secure vault and start trading across top DeFi protocols."
            />
            <StepCard
              number="03"
              title="Monitor & Govern"
              description="Track performance, manage risk, and govern your vault with your team."
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 text-white mb-6">
                Enterprise-Grade Security
              </h2>
              <ul className="space-y-4">
                {[
                  "Safe smart contract architecture",
                  "Multi-signature transaction requirements",
                  "Real-time risk monitoring",
                  "Emergency pause functionality",
                  "Regular security audits",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-elevated p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Audited & Verified</h3>
                  <p className="text-text-tertiary">By leading security firms</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <span className="text-text-secondary">OpenZeppelin Audit</span>
                  <span className="badge-success">Passed</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <span className="text-text-secondary">Certik Audit</span>
                  <span className="badge-success">Passed</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <span className="text-text-secondary">Immunefi Bug Bounty</span>
                  <span className="badge-info">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center card-elevated p-12">
          <h2 className="text-h2 text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Join institutions already using Prime Vault for secure, compliant DeFi access.
          </p>
          <Link href="/connect">
            <Button size="lg" className="gap-2">
              Connect Wallet <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Prime Vault</span>
              </div>
              <p className="text-text-tertiary text-sm">
                Institutional DeFi prime brokerage built on Arbitrum.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#">Pricing</Link></li>
                <li><Link href="#">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li><Link href="#">Documentation</Link></li>
                <li><Link href="#">API Reference</Link></li>
                <li><Link href="#">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Careers</Link></li>
                <li><Link href="#">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-text-tertiary text-sm">
            © 2026 Prime Vault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card hover:border-primary/50 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="text-6xl font-bold text-primary/20 mb-4">{number}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
