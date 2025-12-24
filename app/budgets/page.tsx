"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { BudgetEnvelope } from "@/components/budgets/budget-envelope"
import { CreateBudgetDialog } from "@/components/budgets/create-budget-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Loader2, Wallet, TrendingDown, AlertCircle } from "lucide-react"
import { subscribeToBudgets, type Budget } from "@/lib/firebase/firestore"

export default function BudgetsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return

    setLoading(true)
    const unsubscribe = subscribeToBudgets(user.uid, (data) => {
      setBudgets(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!user) return null

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalBudget - totalSpent
  const overBudgetCount = budgets.filter((b) => b.spent > b.amount).length

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Budget Envelopes</h1>
              <p className="text-slate-600 dark:text-slate-400">Zero-based budgeting for every dollar</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
              <Plus className="h-4 w-4" />
              Create Envelope
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Budget</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">${totalBudget.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Remaining</span>
                </div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${totalRemaining.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Over Budget</span>
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{overBudgetCount}</div>
              </CardContent>
            </Card>
          </div>

          {budgets.length === 0 ? (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="py-16 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No budget envelopes yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Create your first budget envelope to start managing your spending
                </p>
                <Button onClick={() => setShowCreateDialog(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="h-4 w-4" />
                  Create Your First Envelope
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => (
                <BudgetEnvelope
                  key={budget.id}
                  budget={budget}
                  onAddFunds={() => console.log("Add funds", budget)}
                  onWithdraw={() => console.log("Withdraw", budget)}
                  onEdit={() => console.log("Edit", budget)}
                />
              ))}
            </div>
          )}
        </div>

        <CreateBudgetDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={() => {}} />
      </main>
    </div>
  )
}
