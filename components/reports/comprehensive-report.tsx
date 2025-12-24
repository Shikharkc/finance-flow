"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FinancialSummary } from "@/lib/utils/export-helpers"

interface ComprehensiveReportProps {
  summary: FinancialSummary
  onExport: (format: "pdf" | "excel") => void
}

export function ComprehensiveReport({ summary, onExport }: ComprehensiveReportProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Financial Summary Report
            </CardTitle>
            <CardDescription>{summary.period}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => onExport("excel")}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-emerald-50 p-4 dark:bg-emerald-950/20">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-emerald-600">${summary.totalIncome.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-red-50 p-4 dark:bg-red-950/20">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">${summary.totalExpenses.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
            <p className="text-sm text-muted-foreground">Net Savings</p>
            <p className="text-2xl font-bold text-blue-600">${summary.netSavings.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-purple-50 p-4 dark:bg-purple-950/20">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <p className="text-2xl font-bold text-purple-600">{summary.savingsRate.toFixed(1)}%</p>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Expenses by Category</h3>
          <div className="space-y-2">
            {Object.entries(summary.expensesByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{category}</span>
                  <span className="font-medium">${amount.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Top 10 Expenses</h3>
          <div className="space-y-2">
            {summary.topExpenses.map((expense, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{expense.description}</span>
                  <span className="ml-2 text-muted-foreground">{expense.date.toLocaleDateString()}</span>
                </div>
                <span className="font-medium">${expense.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
