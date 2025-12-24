"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: string
  icon: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </div>
          <Clock className="h-5 w-5 text-emerald-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xl">
                  {transaction.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{transaction.description}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{transaction.category}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{transaction.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {transaction.type === "income" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-bold ${transaction.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/expenses" className="block">
          <Button variant="outline" className="w-full bg-transparent">
            View All Transactions
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
