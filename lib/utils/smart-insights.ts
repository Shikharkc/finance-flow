"use client"

import type { Expense, Income, Budget } from "@/lib/firebase/firestore"

export interface Insight {
  type: "savings" | "spending" | "budget" | "goal" | "warning" | "tip"
  title: string
  description: string
  priority: "low" | "medium" | "high"
  actionable: boolean
  action?: {
    label: string
    href: string
  }
}

export function generateSmartInsights(expenses: Expense[], income: Income[], budgets: Budget[]): Insight[] {
  const insights: Insight[] = []
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const thisMonthExpenses = expenses.filter((e) => e.date >= thisMonthStart)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const lastMonthExpenses = expenses.filter((e) => e.date >= lastMonthStart && e.date <= lastMonthEnd)

  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const thisMonthIncome = income.filter((i) => i.date >= thisMonthStart).reduce((sum, i) => sum + i.amount, 0)

  // Insight 1: Spending Comparison
  if (lastMonthTotal > 0) {
    const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    if (Math.abs(change) > 10) {
      insights.push({
        type: change > 0 ? "warning" : "savings",
        title: change > 0 ? "Spending Increased" : "Great Progress!",
        description: `Your spending is ${Math.abs(change).toFixed(1)}% ${change > 0 ? "higher" : "lower"} than last month`,
        priority: change > 20 ? "high" : "medium",
        actionable: true,
        action: {
          label: "View Details",
          href: "/expenses",
        },
      })
    }
  }

  // Insight 2: Budget Alerts
  for (const budget of budgets) {
    const spent = (budget.spent / budget.amount) * 100
    if (spent > 90) {
      insights.push({
        type: "warning",
        title: `${budget.category} Budget Alert`,
        description: `You've used ${spent.toFixed(0)}% of your ${budget.category} budget`,
        priority: spent > 100 ? "high" : "medium",
        actionable: true,
        action: {
          label: "Adjust Budget",
          href: "/budgets",
        },
      })
    }
  }

  // Insight 3: Savings Rate
  if (thisMonthIncome > 0) {
    const savingsRate = ((thisMonthIncome - thisMonthTotal) / thisMonthIncome) * 100
    if (savingsRate >= 20) {
      insights.push({
        type: "savings",
        title: "Excellent Savings Rate",
        description: `You're saving ${savingsRate.toFixed(1)}% of your income this month!`,
        priority: "medium",
        actionable: false,
      })
    } else if (savingsRate < 10) {
      insights.push({
        type: "tip",
        title: "Consider Increasing Savings",
        description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% to build wealth.`,
        priority: "medium",
        actionable: true,
        action: {
          label: "Create Savings Plan",
          href: "/budgets",
        },
      })
    }
  }

  // Insight 4: Recurring Expense Optimization
  const subscriptions = expenses.filter((e) => e.recurring || e.category === "Entertainment")
  const subscriptionTotal = subscriptions.reduce((sum, e) => sum + e.amount, 0)
  if (subscriptionTotal > 100) {
    insights.push({
      type: "tip",
      title: "Review Subscriptions",
      description: `You're spending $${subscriptionTotal.toFixed(2)}/month on subscriptions. Cancel unused services to save money.`,
      priority: "low",
      actionable: true,
      action: {
        label: "View Subscriptions",
        href: "/expenses?category=Entertainment",
      },
    })
  }

  // Insight 5: Top Spending Category
  const categoryTotals = new Map<string, number>()
  thisMonthExpenses.forEach((e) => {
    categoryTotals.set(e.category, (categoryTotals.get(e.category) || 0) + e.amount)
  })

  const topCategory = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])[0]
  if (topCategory && topCategory[1] > thisMonthTotal * 0.4) {
    insights.push({
      type: "spending",
      title: `${topCategory[0]} is Your Top Expense`,
      description: `${topCategory[0]} accounts for ${((topCategory[1] / thisMonthTotal) * 100).toFixed(0)}% of your spending this month`,
      priority: "low",
      actionable: true,
      action: {
        label: "See Breakdown",
        href: `/expenses?category=${topCategory[0]}`,
      },
    })
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}
