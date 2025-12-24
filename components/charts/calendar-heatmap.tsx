"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DayData {
  date: Date
  amount: number
  transactions: number
}

interface CalendarHeatmapProps {
  data: DayData[]
  title?: string
  description?: string
}

export function CalendarHeatmap({
  data,
  title = "Spending Calendar Heatmap",
  description = "Daily spending intensity over the past 90 days",
}: CalendarHeatmapProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount))

  const getIntensityColor = (amount: number) => {
    const intensity = amount / maxAmount
    if (intensity === 0) return "bg-slate-100 dark:bg-slate-800"
    if (intensity < 0.2) return "bg-emerald-200 dark:bg-emerald-900"
    if (intensity < 0.4) return "bg-emerald-400 dark:bg-emerald-700"
    if (intensity < 0.6) return "bg-amber-400 dark:bg-amber-700"
    if (intensity < 0.8) return "bg-orange-500 dark:bg-orange-700"
    return "bg-red-600 dark:bg-red-700"
  }

  const getMonthLabel = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short" })
  }

  const weeks = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <div className="inline-flex flex-col gap-1">
              <div className="flex gap-1">
                <div className="w-12" />
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="flex h-6 w-6 items-center justify-center text-xs text-muted-foreground">
                    {day[0]}
                  </div>
                ))}
              </div>
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex gap-1">
                  <div className="flex w-12 items-center text-xs text-muted-foreground">
                    {weekIdx % 4 === 0 && getMonthLabel(week[0]?.date)}
                  </div>
                  <TooltipProvider>
                    {week.map((day, dayIdx) => (
                      <Tooltip key={dayIdx}>
                        <TooltipTrigger>
                          <div
                            className={`h-6 w-6 rounded-sm ${getIntensityColor(day.amount)} hover:ring-2 hover:ring-slate-400 transition-all cursor-pointer`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-semibold">{day.date.toLocaleDateString()}</p>
                            <p>${day.amount.toFixed(2)}</p>
                            <p className="text-muted-foreground">{day.transactions} transactions</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3 text-xs">
            <span className="text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div className="h-4 w-4 rounded-sm bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-4 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
              <div className="h-4 w-4 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
              <div className="h-4 w-4 rounded-sm bg-amber-400 dark:bg-amber-700" />
              <div className="h-4 w-4 rounded-sm bg-orange-500 dark:bg-orange-700" />
              <div className="h-4 w-4 rounded-sm bg-red-600 dark:bg-red-700" />
            </div>
            <span className="text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
