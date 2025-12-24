"use client"

import type { Expense } from "@/lib/firebase/firestore"

export interface Anomaly {
  type: "unusual-amount" | "frequency-spike" | "new-merchant" | "duplicate" | "location-change"
  severity: "low" | "medium" | "high"
  message: string
  expense: Expense
  recommendation: string
}

export function detectAnomalies(expenses: Expense[], currentExpense: Expense): Anomaly[] {
  const anomalies: Anomaly[] = []

  // Filter expenses from same category
  const categoryExpenses = expenses.filter((e) => e.category === currentExpense.category)

  // 1. Unusual Amount Detection
  if (categoryExpenses.length >= 3) {
    const amounts = categoryExpenses.map((e) => e.amount)
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length
    const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + (n - avg) ** 2, 0) / amounts.length)

    if (currentExpense.amount > avg + 2 * stdDev) {
      anomalies.push({
        type: "unusual-amount",
        severity: currentExpense.amount > avg + 3 * stdDev ? "high" : "medium",
        message: `This ${currentExpense.category} expense of $${currentExpense.amount.toFixed(2)} is ${((currentExpense.amount / avg - 1) * 100).toFixed(0)}% higher than your average of $${avg.toFixed(2)}`,
        expense: currentExpense,
        recommendation: "Verify this transaction is correct and consider if it's within your budget.",
      })
    }
  }

  // 2. Frequency Spike Detection
  const last7Days = expenses.filter((e) => {
    const daysDiff = (new Date().getTime() - e.date.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7 && e.category === currentExpense.category
  })

  const last30Days = expenses.filter((e) => {
    const daysDiff = (new Date().getTime() - e.date.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 30 && e.category === currentExpense.category
  })

  if (last7Days.length > (last30Days.length / 30) * 7 * 2) {
    anomalies.push({
      type: "frequency-spike",
      severity: "medium",
      message: `You've had ${last7Days.length} ${currentExpense.category} transactions in the past 7 days, which is unusually high`,
      expense: currentExpense,
      recommendation: "Review if this spending pattern aligns with your goals.",
    })
  }

  // 3. New Merchant Detection
  const merchantExpenses = expenses.filter((e) => e.description === currentExpense.description)
  if (merchantExpenses.length === 0 && currentExpense.amount > 50) {
    anomalies.push({
      type: "new-merchant",
      severity: "low",
      message: `First transaction at ${currentExpense.description}`,
      expense: currentExpense,
      recommendation: "Save this merchant for quick categorization in the future.",
    })
  }

  // 4. Potential Duplicate Detection
  const recentSimilar = expenses.filter((e) => {
    const timeDiff = Math.abs(e.date.getTime() - currentExpense.date.getTime())
    const amountDiff = Math.abs(e.amount - currentExpense.amount)
    return timeDiff < 60 * 60 * 1000 && amountDiff < 1 && e.description === currentExpense.description // Within 1 hour
  })

  if (recentSimilar.length > 0) {
    anomalies.push({
      type: "duplicate",
      severity: "high",
      message: `Potential duplicate: Similar transaction detected within the past hour`,
      expense: currentExpense,
      recommendation: "Check if this is a duplicate entry and delete if necessary.",
    })
  }

  return anomalies
}

export function predictNextMonthSpending(expenses: Expense[]): {
  predicted: number
  confidence: number
  trend: "increasing" | "decreasing" | "stable"
} {
  // Simple moving average prediction
  const monthlyTotals: number[] = []

  for (let i = 0; i < 6; i++) {
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - i - 1)
    startDate.setDate(1)

    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const monthTotal = expenses
      .filter((e) => e.date >= startDate && e.date < endDate)
      .reduce((sum, e) => sum + e.amount, 0)

    monthlyTotals.push(monthTotal)
  }

  if (monthlyTotals.length < 3) {
    return { predicted: 0, confidence: 0, trend: "stable" }
  }

  const avg = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length
  const trend =
    monthlyTotals[0] > monthlyTotals[monthlyTotals.length - 1] * 1.1
      ? "increasing"
      : monthlyTotals[0] < monthlyTotals[monthlyTotals.length - 1] * 0.9
        ? "decreasing"
        : "stable"

  return {
    predicted: avg,
    confidence: 0.7,
    trend,
  }
}
