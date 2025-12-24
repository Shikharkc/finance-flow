"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch } from "lucide-react"

interface FlowNode {
  name: string
  value: number
  color: string
}

interface SankeyFlowChartProps {
  income: FlowNode[]
  categories: FlowNode[]
  savings: FlowNode
}

export function SankeyFlowChart({ income, categories, savings }: SankeyFlowChartProps) {
  const totalIncome = income.reduce((sum, i) => sum + i.value, 0)
  const totalExpenses = categories.reduce((sum, c) => sum + c.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-blue-600" />
          Money Flow Visualization
        </CardTitle>
        <CardDescription>Income distribution across categories and savings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-1/4">
              <h4 className="mb-3 text-sm font-semibold">Income Sources</h4>
              <div className="space-y-2">
                {income.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border p-2">
                    <span className="text-sm font-medium">{source.name}</span>
                    <span className="text-sm text-muted-foreground">${source.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-1/2 flex-col items-center justify-center">
              <div className="relative h-64 w-full">
                {income.map((source, idx) => {
                  const yStart = (idx * 100) / income.length
                  return (
                    <div key={idx} className="absolute left-0" style={{ top: `${yStart}%`, width: "100%" }}>
                      <svg width="100%" height="40" className="overflow-visible">
                        <defs>
                          <linearGradient id={`gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={source.color} stopOpacity="0.6" />
                            <stop offset="100%" stopColor={source.color} stopOpacity="0.2" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`M 0 20 C 150 20, 150 ${20 + idx * 30}, 300 ${20 + idx * 30}`}
                          stroke={`url(#gradient-${idx})`}
                          strokeWidth={Math.max(2, (source.value / totalIncome) * 40)}
                          fill="none"
                        />
                      </svg>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="w-1/4">
              <h4 className="mb-3 text-sm font-semibold">Allocation</h4>
              <div className="space-y-2">
                {categories.map((category, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border p-2"
                    style={{ borderLeftColor: category.color, borderLeftWidth: 3 }}
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">${category.value.toLocaleString()}</span>
                  </div>
                ))}
                <div
                  className="flex items-center justify-between rounded-lg border bg-emerald-50 p-2 dark:bg-emerald-950/20"
                  style={{ borderLeftColor: savings.color, borderLeftWidth: 3 }}
                >
                  <span className="text-sm font-semibold">{savings.name}</span>
                  <span className="text-sm font-semibold text-emerald-600">${savings.value.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-lg border bg-muted/50 p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-xl font-bold">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-xl font-bold">${totalExpenses.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Savings Rate</p>
              <p className="text-xl font-bold text-emerald-600">{((savings.value / totalIncome) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
