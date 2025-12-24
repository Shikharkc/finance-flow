"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Merchant {
  name: string
  category: string
  amount: number
  transactions: number
  avgTransaction: number
  trend: "up" | "down" | "stable"
  loyaltyPoints?: number
}

interface MerchantSpendingProps {
  merchants: Merchant[]
  totalSpending: number
}

export function MerchantSpending({ merchants, totalSpending }: MerchantSpendingProps) {
  const topMerchants = merchants.sort((a, b) => b.amount - a.amount).slice(0, 6)

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-red-500" />
    if (trend === "down") return <TrendingUp className="h-3 w-3 rotate-180 text-emerald-500" />
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-orange-600" />
          Top Merchants
        </CardTitle>
        <CardDescription>Where you spend most frequently</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topMerchants.map((merchant, index) => {
            const percentage = (merchant.amount / totalSpending) * 100
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{merchant.name}</p>
                      {getTrendIcon(merchant.trend)}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {merchant.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {merchant.transactions} visits • ${merchant.avgTransaction.toFixed(2)} avg
                      </span>
                    </div>
                    {merchant.loyaltyPoints && (
                      <p className="mt-1 text-xs text-emerald-600">{merchant.loyaltyPoints} loyalty points</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${merchant.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full bg-orange-600" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
