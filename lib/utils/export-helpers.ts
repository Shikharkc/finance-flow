"use client"

import type { Expense, Income, Budget } from "@/lib/firebase/firestore"

export function generateCSV(data: any[], headers: string[]): string {
  const csvHeaders = headers.join(",")
  const csvRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header]
        if (value === null || value === undefined) return ""
        if (typeof value === "string" && value.includes(",")) return `"${value}"`
        if (value instanceof Date) return value.toISOString()
        return value
      })
      .join(","),
  )
  return [csvHeaders, ...csvRows].join("\n")
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportExpensesCSV(expenses: Expense[]) {
  const headers = ["date", "category", "subcategory", "description", "amount", "paymentMethod", "location", "tags"]
  const data = expenses.map((e) => ({
    date: e.date.toISOString().split("T")[0],
    category: e.category,
    subcategory: e.subcategory || "",
    description: e.description,
    amount: e.amount,
    paymentMethod: e.paymentMethod || "",
    location: e.location || "",
    tags: e.tags?.join("; ") || "",
  }))
  const csv = generateCSV(data, headers)
  downloadFile(csv, `expenses-${new Date().toISOString().split("T")[0]}.csv`, "text/csv")
}

export function exportIncomeCSV(income: Income[]) {
  const headers = ["date", "source", "type", "description", "amount", "recurring", "frequency"]
  const data = income.map((i) => ({
    date: i.date.toISOString().split("T")[0],
    source: i.source,
    type: i.type,
    description: i.description,
    amount: i.amount,
    recurring: i.recurring ? "Yes" : "No",
    frequency: i.frequency || "",
  }))
  const csv = generateCSV(data, headers)
  downloadFile(csv, `income-${new Date().toISOString().split("T")[0]}.csv`, "text/csv")
}

export function exportBudgetsCSV(budgets: Budget[]) {
  const headers = ["category", "amount", "spent", "remaining", "period", "rollover"]
  const data = budgets.map((b) => ({
    category: b.category,
    amount: b.amount,
    spent: b.spent,
    remaining: b.amount - b.spent,
    period: b.period,
    rollover: b.rollover ? "Yes" : "No",
  }))
  const csv = generateCSV(data, headers)
  downloadFile(csv, `budgets-${new Date().toISOString().split("T")[0]}.csv`, "text/csv")
}

export interface FinancialSummary {
  period: string
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
  expensesByCategory: Record<string, number>
  topExpenses: Array<{ description: string; amount: number; date: Date }>
}

export function generateFinancialSummary(
  expenses: Expense[],
  income: Income[],
  startDate: Date,
  endDate: Date,
): FinancialSummary {
  const filteredExpenses = expenses.filter((e) => e.date >= startDate && e.date <= endDate)
  const filteredIncome = income.filter((i) => i.date >= startDate && i.date <= endDate)

  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

  const expensesByCategory: Record<string, number> = {}
  filteredExpenses.forEach((e) => {
    expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount
  })

  const topExpenses = filteredExpenses
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((e) => ({
      description: e.description,
      amount: e.amount,
      date: e.date,
    }))

  return {
    period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    expensesByCategory,
    topExpenses,
  }
}
