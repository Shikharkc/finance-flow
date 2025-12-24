"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface CashFlowCalendarProps {
  data: Array<{ day: string; income: number; expenses: number; net: number }>
}

export function CashFlowCalendar({ data }: CashFlowCalendarProps) {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">30-Day Cash Flow</CardTitle>
          <Calendar className="h-5 w-5 text-emerald-500" />
        </div>
        <CardDescription>Income vs expenses forecast</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Income</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${data.reduce((sum, d) => sum + d.income, 0).toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Expenses</span>
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${data.reduce((sum, d) => sum + d.expenses, 0).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Bar dataKey="net" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.net >= 0 ? "#10b981" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
