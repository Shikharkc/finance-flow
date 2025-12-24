"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SmartSuggestions } from "@/components/automation/smart-suggestions"
import { AnomalyAlerts } from "@/components/automation/anomaly-alerts"
import { PredictiveForecast } from "@/components/automation/predictive-forecast"
import { generateSmartInsights } from "@/lib/utils/smart-insights"
import { detectAnomalies, predictNextMonthSpending } from "@/lib/utils/anomaly-detection"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AutomationPage() {
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

  // Mock data - replace with real Firebase data
  const mockExpenses: any[] = []
  const mockIncome: any[] = []
  const mockBudgets: any[] = []

  const insights = generateSmartInsights(mockExpenses, mockIncome, mockBudgets)
  const anomalies = mockExpenses.length > 0 ? detectAnomalies(mockExpenses.slice(0, -1), mockExpenses[0]) : []
  const prediction = predictNextMonthSpending(mockExpenses)

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Smart Automation & AI</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Intelligent insights and automated financial management
            </p>
          </div>

          <Tabs defaultValue="insights" className="space-y-6">
            <TabsList>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-6">
              <SmartSuggestions insights={insights} />
            </TabsContent>

            <TabsContent value="anomalies" className="space-y-6">
              <AnomalyAlerts anomalies={anomalies} />
            </TabsContent>

            <TabsContent value="forecast" className="space-y-6">
              <PredictiveForecast
                predicted={prediction.predicted}
                confidence={prediction.confidence}
                trend={prediction.trend}
                currentMonth={mockExpenses.reduce((sum, e) => sum + e.amount, 0)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
