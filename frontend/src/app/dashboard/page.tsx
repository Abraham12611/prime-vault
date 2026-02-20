import { Metadata } from "next";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";

export const metadata: Metadata = {
  title: "Dashboard | Prime Vault",
  description: "Manage your institutional DeFi portfolio",
};

// This would check authentication in a real app
export default function DashboardPage() {
  // For now, we'll show a placeholder
  // In production, redirect if not connected
  // if (!isConnected) redirect('/connect');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 text-white">Dashboard</h1>
            <p className="text-text-secondary">Overview of your institutional vault</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary">
              Export Report
            </button>
            <button className="btn-primary">
              New Trade
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Portfolio Value"
            value="$2,456,789.00"
            change="+5.23%"
            changeType="positive"
          />
          <StatCard
            title="Collateral Ratio"
            value="165%"
            subtitle="Min: 150%"
            status="healthy"
          />
          <StatCard
            title="Active Positions"
            value="12"
            subtitle="Across 4 protocols"
          />
          <StatCard
            title="Pending Transactions"
            value="3"
            subtitle="Awaiting signatures"
            status="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Chart */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Portfolio Performance</h3>
              <div className="flex items-center gap-2">
                {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      period === "1M"
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:text-white"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-surface/50 rounded-lg">
              <p className="text-text-tertiary">Chart placeholder - integrate Recharts</p>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-6">Asset Allocation</h3>
            <div className="h-48 flex items-center justify-center bg-surface/50 rounded-lg mb-4">
              <p className="text-text-tertiary">Pie chart placeholder</p>
            </div>
            <div className="space-y-2">
              {[
                { asset: "ETH", percentage: 45, color: "#627EEA" },
                { asset: "USDC", percentage: 30, color: "#2775CA" },
                { asset: "WBTC", percentage: 15, color: "#F7931A" },
                { asset: "Other", percentage: 10, color: "#9CA3AF" },
              ].map((item) => (
                <div key={item.asset} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-text-secondary text-sm">{item.asset}</span>
                  </div>
                  <span className="text-white font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <button className="text-primary text-sm hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-tertiary text-sm font-medium">Transaction</th>
                  <th className="text-left py-3 px-4 text-text-tertiary text-sm font-medium">Asset</th>
                  <th className="text-left py-3 px-4 text-text-tertiary text-sm font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-text-tertiary text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-text-tertiary text-sm font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Swap", asset: "ETH → USDC", amount: "+12,500 USDC", status: "Success", time: "2 mins ago" },
                  { type: "Deposit", asset: "ETH", amount: "+50.0 ETH", status: "Success", time: "1 hour ago" },
                  { type: "Governance", asset: "-", amount: "Approve Trade", status: "Pending", time: "3 hours ago" },
                  { type: "Swap", asset: "USDC → WBTC", amount: "+0.45 WBTC", status: "Success", time: "5 hours ago" },
                ].map((tx, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-surface/50">
                    <td className="py-4 px-4">
                      <span className="text-white">{tx.type}</span>
                    </td>
                    <td className="py-4 px-4 text-text-secondary">{tx.asset}</td>
                    <td className="py-4 px-4 text-white">{tx.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`badge-${tx.status === "Success" ? "success" : "warning"}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-text-tertiary text-sm">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  subtitle,
  status
}: { 
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  status?: "healthy" | "warning" | "critical";
}) {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-text-secondary",
  };

  const statusColors = {
    healthy: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    critical: "bg-error/10 text-error",
  };

  return (
    <div className="card">
      <p className="text-text-tertiary text-sm mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {change && (
          <span className={`text-sm ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-text-tertiary text-xs mt-1">{subtitle}</p>
      )}
      {status && (
        <div className={`mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status === "healthy" ? "bg-success" : status === "warning" ? "bg-warning" : "bg-error"}`} />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      )}
    </div>
  );
}
