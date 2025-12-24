"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FinancialHealthScoreProps {
  score: number
  trend: "up" | "down" | "stable"
  insights: string[]
}

export function FinancialHealthScore({ score, trend, insights }: FinancialHealthScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400"
    if (score >= 60) return "text-blue-600 dark:text-blue-400"
    if (score >= 40) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Attention"
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Financial Health Score</CardTitle>
          {trend === "up" ? (
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          ) : trend === "down" ? (
            <TrendingDown className="h-5 w-5 text-red-500" />
          ) : (
            <div className="h-5 w-5" />
          )}
        </div>
        <CardDescription>Your overall financial wellness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-4">
          <div className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}</div>
          <div className="pb-2">
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {getScoreLabel(score)}
            </Badge>
          </div>
        </div>
        <Progress value={score} className="h-3" />
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            AI Insights
          </h4>
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
