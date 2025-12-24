"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SpendingTrendsChart } from "@/components/reports/spending-trends-chart"
import { CategoryBreakdown } from "@/components/reports/category-breakdown"
import { ComparativeAnalysis } from "@/components/reports/comparative-analysis"
import { CashFlowForecast } from "@/components/reports/cash-flow-forecast"
import { MerchantAnalysis } from "@/components/reports/merchant-analysis"
import { ExportReportDialog } from "@/components/reports/export-report-dialog"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

// Mock data for demonstration
const mockData = {
  trends: [
    { month: "Jan", expenses: 3200, income: 5000, net: 1800 },
    { month: "Feb", expenses: 2800, income: 5000, net: 2200 },
    { month: "Mar", expenses: 3500, income: 5200, net: 1700 },
    { month: "Apr", expenses: 3100, income: 5000, net: 1900 },
    { month: "May", expenses: 2900, income: 5500, net: 2600 },
    { month: "Jun", expenses: 3400, income: 5000, net: 1600 },
  ],
  categories: [
    { category: "Housing", amount: 1500, color: "#3b82f6" },
    { category: "Food", amount: 650, color: "#10b981" },
    { category: "Transport", amount: 420, color: "#f59e0b" },
    { category: "Entertainment", amount: 280, color: "#8b5cf6" },
    { category: "Utilities", amount: 320, color: "#ef4444" },
    { category: "Healthcare", amount: 180, color: "#06b6d4" },
  ],
  comparison: [
    { category: "Total Spending", current: 3400, previous: 3100, change: 300, changePercent: 9.7 },
    { category: "Housing", current: 1500, previous: 1500, change: 0, changePercent: 0 },
    { category: "Food & Dining", current: 680, previous: 750, change: -70, changePercent: -9.3 },
    { category: "Transportation", current: 450, previous: 380, change: 70, changePercent: 18.4 },
    { category: "Entertainment", current: 320, previous: 240, change: 80, changePercent: 33.3 },
  ],
  forecast: {
    data: [
      { date: "Week 1", actual: 850, forecast: 850, confidence: "high" as const },
      { date: "Week 2", actual: 920, forecast: 920, confidence: "high" as const },
      { date: "Week 3", actual: 780, forecast: 780, confidence: "high" as const },
      { date: "Week 4", actual: 850, forecast: 850, confidence: "high" as const },
      { date: "Week 5", forecast: 890, confidence: "high" as const },
      { date: "Week 6", forecast: 920, confidence: "medium" as const },
      { date: "Week 7", forecast: 850, confidence: "medium" as const },
      { date: "Week 8", forecast: 880, confidence: "medium" as const },
      { date: "Week 9", forecast: 910, confidence: "low" as const },
      { date: "Week 10", forecast: 870, confidence: "low" as const },
      { date: "Week 11", forecast: 900, confidence: "low" as const },
      { date: "Week 12", forecast: 920, confidence: "low" as const },
    ],
    confidenceScore: 87,
  },
  merchants: [
    { merchant: "Whole Foods", amount: 450, transactions: 12, avgTransaction: 37.5, percentage: 13.2 },
    { merchant: "Shell Gas Station", amount: 320, transactions: 8, avgTransaction: 40.0, percentage: 9.4 },
    { merchant: "Amazon", amount: 280, transactions: 15, avgTransaction: 18.67, percentage: 8.2 },
    { merchant: "Netflix", amount: 15.99, transactions: 1, avgTransaction: 15.99, percentage: 0.5 },
    { merchant: "Starbucks", amount: 145, transactions: 22, avgTransaction: 6.59, percentage: 4.3 },
  ],
}

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [showExportDialog, setShowExportDialog] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Reports & Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400">Comprehensive financial insights and trends</p>
            </div>
            <Button onClick={() => setShowExportDialog(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          <div className="space-y-6">
            <SpendingTrendsChart data={mockData.trends} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryBreakdown data={mockData.categories} />
              <MerchantAnalysis data={mockData.merchants} />
            </div>

            <CashFlowForecast data={mockData.forecast.data} confidenceScore={mockData.forecast.confidenceScore} />

            <ComparativeAnalysis data={mockData.comparison} />
          </div>
        </div>

        <ExportReportDialog open={showExportDialog} onOpenChange={setShowExportDialog} />
      </main>
    </div>
  )
}
