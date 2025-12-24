"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/firebase/context"
import { subscribeToExpenses, type Expense } from "@/lib/firebase/firestore"
import { format } from "date-fns"
import { TrendingUp, Calendar, DollarSign } from "lucide-react"

export function RentHistoryWidget() {
  const { user } = useAuth()
  const [rentExpenses, setRentExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToExpenses(user.uid, (expenses) => {
      const rentOnly = expenses.filter((e) => e.subcategory === "Room Rent").slice(0, 5)
      setRentExpenses(rentOnly)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const calculateStats = () => {
    if (rentExpenses.length === 0) return null

    const totalPaid = rentExpenses.reduce((sum, e) => sum + e.amount, 0)
    const averageRent = totalPaid / rentExpenses.length
    const lastRent = rentExpenses[0]
    const previousRent = rentExpenses[1]

    let trend = 0
    if (previousRent) {
      trend = ((lastRent.amount - previousRent.amount) / previousRent.amount) * 100
    }

    return { totalPaid, averageRent, trend, lastRent }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-xl">🏠</span>
            Rent History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400">No rent payments recorded yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-xl">🏠</span>
          Rent History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <Calendar className="h-3 w-3" />
              Last Payment
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              ${stats.lastRent.amount.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <DollarSign className="h-3 w-3" />
              Average
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">${stats.averageRent.toFixed(0)}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <TrendingUp className="h-3 w-3" />
              Trend
            </div>
            <div
              className={`text-lg font-bold ${stats.trend > 0 ? "text-red-600" : stats.trend < 0 ? "text-green-600" : "text-slate-600"}`}
            >
              {stats.trend > 0 ? "+" : ""}
              {stats.trend.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Recent Payments</div>
          {rentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {expense.paymentDetails?.rentPeriod
                    ? `${format(expense.paymentDetails.rentPeriod.startDate, "MMM d")} - ${format(expense.paymentDetails.rentPeriod.endDate, "MMM d")}`
                    : format(expense.date, "MMM d, yyyy")}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {expense.paymentDetails?.rentPeriod?.totalWeeks.toFixed(1)} weeks
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">${expense.amount}</div>
                {expense.paymentDetails?.weeklyRate && (
                  <div className="text-xs text-slate-500">${expense.paymentDetails.weeklyRate}/wk</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
