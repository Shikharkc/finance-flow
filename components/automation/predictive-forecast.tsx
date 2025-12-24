"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PredictiveForecastProps {
  predicted: number
  confidence: number
  trend: "increasing" | "decreasing" | "stable"
  currentMonth: number
}

export function PredictiveForecast({ predicted, confidence, trend, currentMonth }: PredictiveForecastProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-5 w-5 text-red-600" />
      case "decreasing":
        return <TrendingDown className="h-5 w-5 text-emerald-600" />
      default:
        return <Minus className="h-5 w-5 text-blue-600" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "increasing":
        return "text-red-600"
      case "decreasing":
        return "text-emerald-600"
      default:
        return "text-blue-600"
    }
  }

  const getTrendMessage = () => {
    switch (trend) {
      case "increasing":
        return "Your spending is trending upward. Consider reviewing your budget."
      case "decreasing":
        return "Great job! Your spending is trending downward."
      default:
        return "Your spending is stable and consistent."
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getTrendIcon()}
          Next Month Forecast
        </CardTitle>
        <CardDescription>AI-powered spending prediction based on your patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-blue-50 p-6 dark:from-purple-950/20 dark:to-blue-950/20">
          <p className="text-sm text-muted-foreground">Predicted Spending</p>
          <p className={`text-4xl font-bold ${getTrendColor()}`}>${predicted.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary">{(confidence * 100).toFixed(0)}% confidence</Badge>
            <Badge variant="outline" className="capitalize">
              {trend} trend
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Month</span>
            <span className="font-medium">${currentMonth.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Projected Change</span>
            <span className={`font-medium ${getTrendColor()}`}>
              {trend === "increasing" ? "+" : trend === "decreasing" ? "-" : ""}
              {Math.abs(predicted - currentMonth).toFixed(0)} (
              {((Math.abs(predicted - currentMonth) / currentMonth) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-3">
          <p className="text-sm">{getTrendMessage()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
