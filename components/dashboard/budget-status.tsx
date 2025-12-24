"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BudgetStatusProps {
  budgets: Array<{
    category: string
    spent: number
    limit: number
    color: string
    icon: string
  }>
}

export function BudgetStatus({ budgets }: BudgetStatusProps) {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Budget Status</CardTitle>
          <Target className="h-5 w-5 text-emerald-500" />
        </div>
        <CardDescription>Monthly envelope spending</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {budgets.map((budget, i) => {
          const percentage = (budget.spent / budget.limit) * 100
          const isOverBudget = percentage > 100
          const isWarning = percentage > 80 && !isOverBudget

          return (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xl">{budget.icon}</div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{budget.category}</span>
                  {isOverBudget && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    ${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                  </div>
                  <Badge
                    variant={isOverBudget ? "destructive" : isWarning ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {percentage.toFixed(0)}%
                  </Badge>
                </div>
              </div>
              <Progress
                value={Math.min(percentage, 100)}
                className="h-2"
                style={
                  {
                    "--progress-color": isOverBudget ? "#ef4444" : isWarning ? "#f59e0b" : budget.color,
                  } as React.CSSProperties
                }
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
