"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Investment {
  name: string
  symbol: string
  value: number
  change: number
  changePercent: number
  allocation: number
}

interface InvestmentTrackerProps {
  investments: Investment[]
  totalValue: number
  totalChange: number
  totalChangePercent: number
}

export function InvestmentTracker({
  investments,
  totalValue,
  totalChange,
  totalChangePercent,
}: InvestmentTrackerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {totalChange >= 0 ? (
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
          Investment Portfolio
        </CardTitle>
        <CardDescription>Your investment performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-gradient-to-br from-emerald-50 to-blue-50 p-4 dark:from-emerald-950/20 dark:to-blue-950/20">
          <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={totalChange >= 0 ? "default" : "destructive"} className="bg-emerald-600">
              {totalChange >= 0 ? "+" : ""}${Math.abs(totalChange).toFixed(2)}
            </Badge>
            <span className={`text-sm font-medium ${totalChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {totalChange >= 0 ? "+" : ""}
              {totalChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {investments.map((investment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-mono text-xs font-bold dark:bg-slate-800">
                  {investment.symbol}
                </div>
                <div>
                  <p className="font-medium">{investment.name}</p>
                  <p className="text-xs text-muted-foreground">{investment.allocation}% of portfolio</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${investment.value.toLocaleString()}</p>
                <p className={`text-xs font-medium ${investment.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {investment.change >= 0 ? "+" : ""}${investment.change.toFixed(2)} (
                  {investment.change >= 0 ? "+" : ""}
                  {investment.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
