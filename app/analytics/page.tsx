"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SankeyFlowChart } from "@/components/charts/sankey-flow-chart"
import { CalendarHeatmap } from "@/components/charts/calendar-heatmap"
import { WaterfallChart } from "@/components/charts/waterfall-chart"
import { SunburstChart } from "@/components/charts/sunburst-chart"
import { ScatterPlot } from "@/components/charts/scatter-plot"
import { Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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

  const mockData = {
    sankey: {
      income: [
        { name: "Salary", value: 4500, color: "#10b981" },
        { name: "Freelance", value: 800, color: "#3b82f6" },
        { name: "Investments", value: 200, color: "#8b5cf6" },
      ],
      categories: [
        { name: "Housing", value: 1600, color: "#3b82f6" },
        { name: "Food", value: 650, color: "#10b981" },
        { name: "Transportation", value: 420, color: "#f59e0b" },
        { name: "Entertainment", value: 280, color: "#8b5cf6" },
        { name: "Utilities", value: 320, color: "#ef4444" },
      ],
      savings: { name: "Savings", value: 2230, color: "#10b981" },
    },
    heatmap: Array.from({ length: 90 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (89 - i))
      return {
        date,
        amount: Math.random() * 300 + 20,
        transactions: Math.floor(Math.random() * 10) + 1,
      }
    }),
    waterfall: [
      { label: "Income", value: 5500, type: "positive" as const },
      { label: "Housing", value: -1600, type: "negative" as const },
      { label: "Food", value: -650, type: "negative" as const },
      { label: "Transport", value: -420, type: "negative" as const },
      { label: "Entertainment", value: -280, type: "negative" as const },
      { label: "Utilities", value: -320, type: "negative" as const },
      { label: "Net Savings", value: 2230, type: "total" as const },
    ],
    sunburst: [
      {
        name: "Housing",
        value: 1600,
        color: "#3b82f6",
        subcategories: [
          { name: "Rent", value: 1200, color: "#60a5fa" },
          { name: "Insurance", value: 250, color: "#93c5fd" },
          { name: "Maintenance", value: 150, color: "#bfdbfe" },
        ],
      },
      {
        name: "Food",
        value: 650,
        color: "#10b981",
        subcategories: [
          { name: "Groceries", value: 400, color: "#34d399" },
          { name: "Restaurants", value: 180, color: "#6ee7b7" },
          { name: "Coffee", value: 70, color: "#a7f3d0" },
        ],
      },
      {
        name: "Transportation",
        value: 420,
        color: "#f59e0b",
        subcategories: [
          { name: "Gas", value: 250, color: "#fbbf24" },
          { name: "Uber", value: 120, color: "#fcd34d" },
          { name: "Parking", value: 50, color: "#fde68a" },
        ],
      },
      {
        name: "Entertainment",
        value: 280,
        color: "#8b5cf6",
      },
    ],
    scatter: [
      { x: 4000, y: 3200, label: "Jan", month: "Jan" },
      { x: 4200, y: 3400, label: "Feb", month: "Feb" },
      { x: 4500, y: 3100, label: "Mar", month: "Mar" },
      { x: 4800, y: 3600, label: "Apr", month: "Apr" },
      { x: 5000, y: 3400, label: "May", month: "May" },
      { x: 4600, y: 3800, label: "Jun", month: "Jun" },
      { x: 5200, y: 3500, label: "Jul", month: "Jul" },
      { x: 4900, y: 3300, label: "Aug", month: "Aug" },
      { x: 5500, y: 3270, label: "Sep", month: "Sep" },
    ],
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Advanced Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400">Deep dive into your financial patterns</p>
            </div>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export All Charts
            </Button>
          </div>

          <Tabs defaultValue="flow" className="space-y-6">
            <TabsList>
              <TabsTrigger value="flow">Money Flow</TabsTrigger>
              <TabsTrigger value="patterns">Spending Patterns</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="correlation">Correlation</TabsTrigger>
            </TabsList>

            <TabsContent value="flow" className="space-y-6">
              <SankeyFlowChart {...mockData.sankey} />
              <WaterfallChart data={mockData.waterfall} />
            </TabsContent>

            <TabsContent value="patterns" className="space-y-6">
              <CalendarHeatmap data={mockData.heatmap} />
              <SunburstChart data={mockData.sunburst} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <CalendarHeatmap data={mockData.heatmap} />
                <WaterfallChart data={mockData.waterfall} />
              </div>
            </TabsContent>

            <TabsContent value="correlation" className="space-y-6">
              <ScatterPlot data={mockData.scatter} />
              <SankeyFlowChart {...mockData.sankey} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
