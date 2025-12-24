"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { useState } from "react"

interface ComparisonData {
  category: string
  current: number
  previous: number
  change: number
  changePercent: number
}

interface ComparativeAnalysisProps {
  data: ComparisonData[]
}

export function ComparativeAnalysis({ data }: ComparativeAnalysisProps) {
  const [period, setPeriod] = useState("month")

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Comparative Analysis</CardTitle>
            <CardDescription>Period-over-period comparison</CardDescription>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const isIncrease = item.change > 0
            const isDecrease = item.change < 0
            const isNeutral = item.change === 0

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{item.category}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <span>Current: ${item.current.toLocaleString()}</span>
                    <span>•</span>
                    <span>Previous: ${item.previous.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${
                        isIncrease
                          ? "text-red-600 dark:text-red-400"
                          : isDecrease
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {isIncrease ? "+" : ""}${Math.abs(item.change).toLocaleString()}
                    </div>
                    <div
                      className={`text-xs ${
                        isIncrease
                          ? "text-red-600 dark:text-red-400"
                          : isDecrease
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {isIncrease ? "+" : ""}
                      {item.changePercent.toFixed(1)}%
                    </div>
                  </div>
                  {isIncrease && <ArrowUpRight className="h-5 w-5 text-red-500" />}
                  {isDecrease && <ArrowDownRight className="h-5 w-5 text-emerald-500" />}
                  {isNeutral && <Minus className="h-5 w-5 text-slate-400" />}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
