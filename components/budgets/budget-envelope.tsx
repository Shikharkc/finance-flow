"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, AlertTriangle, TrendingUp } from "lucide-react"
import type { Budget } from "@/lib/firebase/firestore"

interface BudgetEnvelopeProps {
  budget: Budget
  onAddFunds: (budget: Budget) => void
  onWithdraw: (budget: Budget) => void
  onEdit: (budget: Budget) => void
}

export function BudgetEnvelope({ budget, onAddFunds, onWithdraw, onEdit }: BudgetEnvelopeProps) {
  const percentage = (budget.spent / budget.amount) * 100
  const remaining = budget.amount - budget.spent
  const isOverBudget = percentage > 100
  const isWarning = percentage > 80 && !isOverBudget

  return (
    <Card
      className={`border-2 transition-all hover:shadow-lg cursor-pointer ${
        isOverBudget
          ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
          : isWarning
            ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10"
            : "border-slate-200 dark:border-slate-800"
      }`}
      onClick={() => onEdit(budget)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                style={{ backgroundColor: `${budget.color}20` }}
              >
                {budget.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{budget.category}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{budget.period}</p>
              </div>
            </div>
            {isOverBudget && <AlertTriangle className="h-5 w-5 text-red-500" />}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Spent</span>
              <span className="font-semibold text-slate-900 dark:text-white">${budget.spent.toLocaleString()}</span>
            </div>
            <Progress
              value={Math.min(percentage, 100)}
              className="h-3"
              style={{ "--progress-color": budget.color } as React.CSSProperties}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Budget</span>
              <span className="font-semibold text-slate-900 dark:text-white">${budget.amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Remaining</p>
              <p
                className={`text-lg font-bold ${
                  remaining >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                ${Math.abs(remaining).toLocaleString()}
              </p>
            </div>
            <Badge
              variant={isOverBudget ? "destructive" : isWarning ? "secondary" : "outline"}
              className="text-sm font-bold"
            >
              {percentage.toFixed(0)}%
            </Badge>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onAddFunds(budget)
              }}
              className="flex-1 gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add Funds
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onWithdraw(budget)
              }}
              className="flex-1 gap-2 bg-transparent"
            >
              <Minus className="h-4 w-4" />
              Withdraw
            </Button>
          </div>

          {budget.rollover && (
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
              <TrendingUp className="h-3 w-3" />
              Rollover enabled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
