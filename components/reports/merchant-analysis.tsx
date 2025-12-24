"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Store } from "lucide-react"

interface MerchantAnalysisProps {
  data: Array<{
    merchant: string
    amount: number
    transactions: number
    avgTransaction: number
    percentage: number
  }>
}

export function MerchantAnalysis({ data }: MerchantAnalysisProps) {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Top Merchants</CardTitle>
            <CardDescription>Where you spend the most</CardDescription>
          </div>
          <Store className="h-5 w-5 text-emerald-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((merchant, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{merchant.merchant}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {merchant.transactions} transactions • Avg ${merchant.avgTransaction.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    ${merchant.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{merchant.percentage.toFixed(1)}%</div>
                </div>
              </div>
              <Progress value={merchant.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
