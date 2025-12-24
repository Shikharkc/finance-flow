"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SpendingVelocityProps {
  currentPace: number // $ per day
  averagePace: number // $ per day
  budgetPace: number // $ per day to stay on track
  daysRemaining: number
  monthlyBudget: number
  spent: number
}

export function SpendingVelocity({
  currentPace,
  averagePace,
  budgetPace,
  daysRemaining,
  monthlyBudget,
  spent,
}: SpendingVelocityProps) {
  const projectedSpending = spent + currentPace * daysRemaining
  const paceStatus = currentPace < budgetPace ? "on-track" : currentPace < budgetPace * 1.2 ? "warning" : "over-budget"

  const getStatusIcon = () => {
    if (paceStatus === "on-track") return <TrendingDown className="h-5 w-5 text-emerald-600" />
    if (paceStatus === "warning") return <Minus className="h-5 w-5 text-amber-600" />
    return <TrendingUp className="h-5 w-5 text-red-600" />
  }

  const getStatusColor = () => {
    if (paceStatus === "on-track") return "text-emerald-600"
    if (paceStatus === "warning") return "text-amber-600"
    return "text-red-600"
  }

  const getStatusLabel = () => {
    if (paceStatus === "on-track") return "On Track"
    if (paceStatus === "warning") return "Watch Spending"
    return "Over Budget"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-purple-600" />
          Spending Velocity
        </CardTitle>
        <CardDescription>Your budget pacing for this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Pace</p>
            <p className={`text-3xl font-bold ${getStatusColor()}`}>${currentPace.toFixed(2)}/day</p>
          </div>
          {getStatusIcon()}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget Pace</span>
            <span className="font-medium">${budgetPace.toFixed(2)}/day</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Average Pace</span>
            <span className="font-medium">${averagePace.toFixed(2)}/day</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Days Remaining</span>
            <span className="font-medium">{daysRemaining} days</span>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">Projected Month-End</p>
          <p className="text-xl font-bold">${projectedSpending.toFixed(2)}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={paceStatus === "on-track" ? "default" : "destructive"} className="bg-emerald-600">
              {getStatusLabel()}
            </Badge>
            {projectedSpending > monthlyBudget && (
              <span className="text-xs text-red-600">
                ${(projectedSpending - monthlyBudget).toFixed(2)} over budget
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
