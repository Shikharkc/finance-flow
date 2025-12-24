"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface WaterfallItem {
  label: string
  value: number
  type: "positive" | "negative" | "total"
}

interface WaterfallChartProps {
  data: WaterfallItem[]
  title?: string
  description?: string
}

export function WaterfallChart({
  data,
  title = "Budget Waterfall",
  description = "Monthly budget progression",
}: WaterfallChartProps) {
  let runningTotal = 0
  const chartData = data.map((item) => {
    const start = runningTotal
    if (item.type !== "total") {
      runningTotal += item.value
    } else {
      runningTotal = item.value
    }
    return {
      ...item,
      start,
      end: runningTotal,
      height: Math.abs(item.value),
    }
  })

  const maxValue = Math.max(...chartData.map((d) => Math.max(d.start, d.end)))
  const minValue = Math.min(...chartData.map((d) => Math.min(d.start, d.end)))
  const range = maxValue - minValue

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex h-64 items-end justify-between gap-2">
            {chartData.map((item, idx) => {
              const bottomPosition = ((item.start - minValue) / range) * 100
              const barHeight = (item.height / range) * 100
              const isPositive = item.type === "positive" || (item.type === "total" && item.value > 0)
              const isTotal = item.type === "total"

              return (
                <div key={idx} className="flex flex-1 flex-col items-center">
                  <div className="relative h-64 w-full">
                    <div
                      className={`absolute bottom-0 w-full rounded-t ${
                        isTotal
                          ? "bg-gradient-to-t from-blue-600 to-blue-400"
                          : isPositive
                            ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                            : "bg-gradient-to-t from-red-600 to-red-400"
                      } transition-all hover:opacity-80`}
                      style={{
                        height: `${barHeight}%`,
                        bottom: `${bottomPosition}%`,
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold">
                        ${Math.abs(item.value).toLocaleString()}
                      </div>
                    </div>
                    {idx < chartData.length - 1 && !isTotal && (
                      <div
                        className="absolute left-full top-1/2 h-0.5 w-full bg-slate-300 dark:bg-slate-700"
                        style={{
                          top: `${100 - ((item.end - minValue) / range) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium">{item.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-emerald-600" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-600" />
              <span>Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-600" />
              <span>Total</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
