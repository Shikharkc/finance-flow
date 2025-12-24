"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { FinancialHealthScore } from "@/components/dashboard/financial-health-score"
import { NetWorthTracker } from "@/components/dashboard/net-worth-tracker"
import { CashFlowCalendar } from "@/components/dashboard/cash-flow-calendar"
import { SpendingAnalytics } from "@/components/dashboard/spending-analytics"
import { BudgetStatus } from "@/components/dashboard/budget-status"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RentHistoryWidget } from "@/components/expenses/rent-history-widget"
import { GeographicSpendingMap } from "@/components/dashboard/geographic-spending-map"
import { BillPaymentCalendar } from "@/components/dashboard/bill-payment-calendar"
import { InvestmentTracker } from "@/components/dashboard/investment-tracker"
import { SpendingVelocity } from "@/components/dashboard/spending-velocity"
import { MerchantSpending } from "@/components/dashboard/merchant-spending"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showAddExpense, setShowAddExpense] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!user) return null

  // Mock data - will be replaced with real Firebase data
  const mockData = {
    healthScore: {
      score: 78,
      trend: "up" as const,
      insights: [
        "Your spending is 12% lower than last month",
        "Emergency fund goal is 85% complete",
        "Consider increasing retirement contributions",
      ],
    },
    netWorth: {
      netWorth: 45750,
      change: 2340,
      changePercent: 5.4,
      data: [
        { date: "Jan", value: 40000 },
        { date: "Feb", value: 41200 },
        { date: "Mar", value: 42800 },
        { date: "Apr", value: 43410 },
        { date: "May", value: 45750 },
      ],
    },
    cashFlow: {
      data: [
        { day: "Mon", income: 500, expenses: 320, net: 180 },
        { day: "Tue", income: 0, expenses: 150, net: -150 },
        { day: "Wed", income: 1200, expenses: 280, net: 920 },
        { day: "Thu", income: 0, expenses: 420, net: -420 },
        { day: "Fri", income: 800, expenses: 380, net: 420 },
        { day: "Sat", income: 0, expenses: 520, net: -520 },
        { day: "Sun", income: 0, expenses: 180, net: -180 },
      ],
    },
    spending: {
      data: [
        { category: "Housing", amount: 1500, color: "#3b82f6" },
        { category: "Food", amount: 650, color: "#10b981" },
        { category: "Transportation", amount: 420, color: "#f59e0b" },
        { category: "Entertainment", amount: 280, color: "#8b5cf6" },
        { category: "Utilities", amount: 320, color: "#ef4444" },
      ],
    },
    budgets: [
      { category: "Housing", spent: 1500, limit: 1600, color: "#3b82f6", icon: "🏠" },
      { category: "Food", spent: 650, limit: 700, color: "#10b981", icon: "🍔" },
      { category: "Transportation", spent: 420, limit: 400, color: "#f59e0b", icon: "🚗" },
      { category: "Entertainment", spent: 280, limit: 500, color: "#8b5cf6", icon: "🎬" },
    ],
    transactions: [
      {
        id: "1",
        type: "expense" as const,
        category: "Groceries",
        description: "Whole Foods",
        amount: 127.5,
        date: "Today",
        icon: "🛒",
      },
      {
        id: "2",
        type: "income" as const,
        category: "Salary",
        description: "Monthly Salary",
        amount: 4500,
        date: "Today",
        icon: "💰",
      },
      {
        id: "3",
        type: "expense" as const,
        category: "Transportation",
        description: "Uber",
        amount: 23.4,
        date: "Yesterday",
        icon: "🚕",
      },
      {
        id: "4",
        type: "expense" as const,
        category: "Entertainment",
        description: "Netflix",
        amount: 15.99,
        date: "2 days ago",
        icon: "📺",
      },
      {
        id: "5",
        type: "expense" as const,
        category: "Food",
        description: "Starbucks",
        amount: 6.75,
        date: "2 days ago",
        icon: "☕",
      },
    ],
  }

  const extendedMockData = {
    geographicSpending: {
      locations: [
        { location: "Downtown Seattle", amount: 2450, count: 45, lat: 47.6062, lng: -122.3321, category: "Mixed" },
        { location: "Capitol Hill", amount: 1820, count: 32, lat: 47.6205, lng: -122.3212, category: "Food" },
        { location: "Bellevue", amount: 1250, count: 18, lat: 47.6101, lng: -122.2015, category: "Shopping" },
        { location: "University District", amount: 890, count: 28, lat: 47.6553, lng: -122.3035, category: "Food" },
        { location: "Fremont", amount: 650, count: 15, lat: 47.6512, lng: -122.3501, category: "Entertainment" },
      ],
      totalSpending: 7060,
    },
    bills: [
      {
        id: "1",
        name: "Rent",
        amount: 1600,
        dueDate: new Date(2025, 0, 1),
        status: "paid" as const,
        category: "Housing",
        autopay: true,
      },
      {
        id: "2",
        name: "Electric",
        amount: 120,
        dueDate: new Date(2025, 0, 15),
        status: "upcoming" as const,
        category: "Utilities",
        autopay: true,
      },
      {
        id: "3",
        name: "Internet",
        amount: 80,
        dueDate: new Date(2025, 0, 10),
        status: "due" as const,
        category: "Utilities",
        autopay: false,
      },
      {
        id: "4",
        name: "Car Insurance",
        amount: 150,
        dueDate: new Date(2025, 0, 20),
        status: "upcoming" as const,
        category: "Insurance",
        autopay: true,
      },
      {
        id: "5",
        name: "Phone",
        amount: 65,
        dueDate: new Date(2025, 0, 5),
        status: "paid" as const,
        category: "Utilities",
        autopay: true,
      },
    ],
    investments: {
      totalValue: 52400,
      totalChange: 2340,
      totalChangePercent: 4.68,
      investments: [
        { name: "S&P 500 Index", symbol: "VOO", value: 25000, change: 1200, changePercent: 5.04, allocation: 47.7 },
        { name: "Tech ETF", symbol: "QQQ", value: 15000, change: 850, changePercent: 6.01, allocation: 28.6 },
        { name: "International", symbol: "VXUS", value: 8000, change: 180, changePercent: 2.3, allocation: 15.3 },
        { name: "Bonds", symbol: "BND", value: 4400, change: 110, changePercent: 2.56, allocation: 8.4 },
      ],
    },
    spendingVelocity: {
      currentPace: 85.5,
      averagePace: 78.2,
      budgetPace: 80,
      daysRemaining: 7,
      monthlyBudget: 2400,
      spent: 2000,
    },
    merchantSpending: {
      merchants: [
        {
          name: "Whole Foods",
          category: "Groceries",
          amount: 680,
          transactions: 12,
          avgTransaction: 56.67,
          trend: "stable" as const,
          loyaltyPoints: 340,
        },
        {
          name: "Starbucks",
          category: "Coffee",
          amount: 245,
          transactions: 28,
          avgTransaction: 8.75,
          trend: "up" as const,
          loyaltyPoints: 490,
        },
        {
          name: "Amazon",
          category: "Shopping",
          amount: 520,
          transactions: 8,
          avgTransaction: 65,
          trend: "down" as const,
        },
        {
          name: "Shell Gas",
          category: "Transportation",
          amount: 320,
          transactions: 10,
          avgTransaction: 32,
          trend: "stable" as const,
        },
        {
          name: "Netflix",
          category: "Entertainment",
          amount: 15.99,
          transactions: 1,
          avgTransaction: 15.99,
          trend: "stable" as const,
        },
        {
          name: "Chipotle",
          category: "Dining",
          amount: 185,
          transactions: 9,
          avgTransaction: 20.56,
          trend: "up" as const,
          loyaltyPoints: 92,
        },
      ],
      totalSpending: 1965.99,
    },
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {user.displayName}</h1>
            <p className="text-slate-600 dark:text-slate-400">{"Here's your financial overview for today"}</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FinancialHealthScore {...mockData.healthScore} />
                <NetWorthTracker {...mockData.netWorth} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CashFlowCalendar {...mockData.cashFlow} />
                <SpendingAnalytics {...mockData.spending} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <BudgetStatus budgets={mockData.budgets} />
                </div>
                <RentHistoryWidget />
              </div>

              <div className="grid grid-cols-1">
                <RecentTransactions transactions={mockData.transactions} />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GeographicSpendingMap {...extendedMockData.geographicSpending} />
                <MerchantSpending {...extendedMockData.merchantSpending} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpendingVelocity {...extendedMockData.spendingVelocity} />
                <InvestmentTracker {...extendedMockData.investments} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CashFlowCalendar {...mockData.cashFlow} />
                <SpendingAnalytics {...mockData.spending} />
              </div>
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BillPaymentCalendar bills={extendedMockData.bills} />
                <BudgetStatus budgets={mockData.budgets} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <InvestmentTracker {...extendedMockData.investments} />
                </div>
                <SpendingVelocity {...extendedMockData.spendingVelocity} />
              </div>

              <div className="grid grid-cols-1">
                <RecentTransactions transactions={mockData.transactions} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <QuickActions
          onAddExpense={() => router.push("/expenses?action=add")}
          onAddIncome={() => router.push("/income?action=add")}
          onScanReceipt={() => router.push("/receipts?action=scan")}
          onVoiceInput={() => setShowAddExpense(true)}
        />
      </main>
    </div>
  )
}
