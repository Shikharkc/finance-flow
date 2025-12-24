"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface NetWorthTrackerProps {
  netWorth: number
  change: number
  changePercent: number
  data: Array<{ date: string; value: number }>
}

export function NetWorthTracker({ netWorth, change, changePercent, data }: NetWorthTrackerProps) {
  const isPositive = change >= 0

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Net Worth</CardTitle>
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </div>
        <CardDescription>Assets minus liabilities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-4xl font-bold text-slate-900 dark:text-white">${netWorth.toLocaleString()}</div>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <ArrowUpRight className="h-5 w-5 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-red-500" />
            )}
            <span
              className={`text-sm font-semibold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
            >
              ${Math.abs(change).toLocaleString()} ({Math.abs(changePercent).toFixed(1)}%)
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">this month</span>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
