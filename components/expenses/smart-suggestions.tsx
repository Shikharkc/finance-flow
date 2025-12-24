"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingDown, Calendar } from "lucide-react"
import type { Expense } from "@/lib/firebase/firestore"

interface SmartSuggestionsProps {
  recentExpenses: Expense[]
  onSuggestionClick: (suggestion: Partial<Expense>) => void
}

export function SmartSuggestions({ recentExpenses, onSuggestionClick }: SmartSuggestionsProps) {
  const getFrequentCategories = () => {
    const categoryCount: Record<string, number> = {}
    recentExpenses.forEach((expense) => {
      categoryCount[expense.category] = (categoryCount[expense.category] || 0) + 1
    })
    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)
  }

  const getRecurringExpenses = () => {
    return recentExpenses.filter((expense) => expense.recurring).slice(0, 2)
  }

  const frequentCategories = getFrequentCategories()
  const recurringExpenses = getRecurringExpenses()

  if (frequentCategories.length === 0 && recurringExpenses.length === 0) return null

  return (
    <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="font-semibold text-purple-900 dark:text-purple-300 text-sm">Smart Suggestions</span>
        </div>

        <div className="space-y-2">
          {recurringExpenses.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-purple-700 dark:text-purple-400 font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Recent Recurring
              </div>
              {recurringExpenses.map((expense) => (
                <Button
                  key={expense.id}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onSuggestionClick({
                      category: expense.category,
                      description: expense.description,
                      amount: expense.amount,
                      paymentMethod: expense.paymentMethod,
                      recurring: true,
                    })
                  }
                  className="w-full justify-start text-left h-auto py-2 bg-white dark:bg-slate-900"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{expense.description}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {expense.category} • ${expense.amount}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {frequentCategories.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-purple-700 dark:text-purple-400 font-medium flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Frequent Categories
              </div>
              <div className="flex flex-wrap gap-2">
                {frequentCategories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    onClick={() => onSuggestionClick({ category })}
                    className="text-xs bg-white dark:bg-slate-900"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
