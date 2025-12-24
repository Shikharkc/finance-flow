"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import type { Expense } from "@/lib/firebase/firestore"
import { format, differenceInDays } from "date-fns"

interface DuplicateDetectionProps {
  currentExpense: {
    amount: number
    category: string
    date: Date
    description?: string
  }
  existingExpenses: Expense[]
  onDismiss: () => void
}

export function DuplicateDetection({ currentExpense, existingExpenses, onDismiss }: DuplicateDetectionProps) {
  const [duplicates, setDuplicates] = useState<Expense[]>([])

  useEffect(() => {
    // Find potential duplicates
    const potentialDuplicates = existingExpenses.filter((expense) => {
      // Check if amounts match exactly
      const amountMatch = Math.abs(expense.amount - currentExpense.amount) < 0.01

      // Check if categories match
      const categoryMatch =
        expense.category === currentExpense.category || expense.subcategory === currentExpense.category

      // Check if dates are within 7 days
      const daysDiff = Math.abs(differenceInDays(expense.date, currentExpense.date))
      const dateClose = daysDiff <= 7

      // Check description similarity if provided
      let descriptionMatch = false
      if (currentExpense.description && expense.description) {
        const currentWords = currentExpense.description.toLowerCase().split(/\s+/)
        const expenseWords = expense.description.toLowerCase().split(/\s+/)
        const commonWords = currentWords.filter((word) => expenseWords.includes(word))
        descriptionMatch = commonWords.length >= 2
      }

      return amountMatch && categoryMatch && (dateClose || descriptionMatch)
    })

    setDuplicates(potentialDuplicates)
  }, [currentExpense, existingExpenses])

  if (duplicates.length === 0) return null

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Possible Duplicate Detected</div>
            <p className="text-sm text-amber-800 dark:text-amber-400 mb-3">
              This expense looks similar to {duplicates.length} existing {duplicates.length === 1 ? "entry" : "entries"}
              :
            </p>
            <div className="space-y-2">
              {duplicates.slice(0, 3).map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white dark:bg-slate-900 rounded-lg p-3 text-sm border border-amber-200 dark:border-amber-800"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-slate-900 dark:text-white">{expense.description}</span>
                    <span className="text-amber-700 dark:text-amber-500 font-semibold">${expense.amount}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {format(expense.date, "MMM dd, yyyy")} • {expense.category}
                  </div>
                </div>
              ))}
            </div>
            {duplicates.length > 3 && (
              <div className="text-xs text-amber-700 dark:text-amber-500 mt-2">
                + {duplicates.length - 3} more similar {duplicates.length - 3 === 1 ? "entry" : "entries"}
              </div>
            )}
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-3">
              Please verify this is not a duplicate before saving.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} className="flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
