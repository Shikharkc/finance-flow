"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { Expense } from "@/lib/firebase/firestore"
import { format } from "date-fns"

interface RentAnalyticsProps {
  rentExpenses: Expense[]
}

export function RentAnalytics({ rentExpenses }: RentAnalyticsProps) {
  const chartData = rentExpenses
    .slice(0, 12)
    .reverse()
    .map((expense) => ({
      date: expense.paymentDetails?.rentPeriod
        ? format(expense.paymentDetails.rentPeriod.startDate, "MMM")
        : format(expense.date, "MMM"),
      amount: expense.amount,
      weeks: expense.paymentDetails?.rentPeriod?.totalWeeks || 0,
      weeklyRate: expense.paymentDetails?.weeklyRate || 0,
    }))

  const averageRent = rentExpenses.reduce((sum, e) => sum + e.amount, 0) / rentExpenses.length
  const highestRent = Math.max(...rentExpenses.map((e) => e.amount))
  const lowestRent = Math.min(...rentExpenses.map((e) => e.amount))

  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">📊</span>
          Rent Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-xs text-slate-600 dark:text-slate-400">Average</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">${averageRent.toFixed(0)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-600 dark:text-slate-400">Highest</div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400">${highestRent}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-600 dark:text-slate-400">Lowest</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">${lowestRent}</div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "amount") return [`$${value}`, "Rent"]
                  return [value, name]
                }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.amount > averageRent ? "#f59e0b" : "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 text-center">
          Showing last {chartData.length} rent payments • Green: Below average • Orange: Above average
        </div>
      </CardContent>
    </Card>
  )
}
