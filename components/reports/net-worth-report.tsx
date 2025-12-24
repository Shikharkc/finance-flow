"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface NetWorthData {
  month: string
  assets: number
  liabilities: number
  netWorth: number
}

interface NetWorthReportProps {
  data: NetWorthData[]
  currentNetWorth: number
  change: number
  changePercent: number
  onExport: () => void
}

export function NetWorthReport({ data, currentNetWorth, change, changePercent, onExport }: NetWorthReportProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Net Worth Statement
            </CardTitle>
            <CardDescription>Track your wealth over time</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-blue-50 p-6 dark:from-purple-950/20 dark:to-blue-950/20">
          <p className="text-sm text-muted-foreground">Current Net Worth</p>
          <p className="text-4xl font-bold text-purple-600">${currentNetWorth.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-sm font-medium ${change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {change >= 0 ? "+" : ""}${change.toLocaleString()} ({change >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="netWorth" stroke="#8b5cf6" strokeWidth={3} />
              <Line type="monotone" dataKey="assets" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="liabilities" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total Assets</p>
            <p className="text-xl font-bold text-emerald-600">${data[data.length - 1]?.assets.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total Liabilities</p>
            <p className="text-xl font-bold text-red-600">${data[data.length - 1]?.liabilities.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Net Worth</p>
            <p className="text-xl font-bold text-purple-600">${data[data.length - 1]?.netWorth.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
