"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AddIncomeDialog } from "@/components/income/add-income-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Loader2 } from "lucide-react"
import { subscribeToIncome, deleteIncome, type Income } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

const incomeIcons: Record<string, string> = {
  salary: "💼",
  freelance: "💻",
  business: "🏢",
  investment: "📈",
  rental: "🏘️",
  bonus: "🎁",
  gift: "🎉",
  other: "💰",
}

export default function IncomePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return

    setLoading(true)
    const unsubscribe = subscribeToIncome(user.uid, (data) => {
      setIncomes(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleDelete = async (income: Income) => {
    try {
      await deleteIncome(income.id!)
      toast({
        title: "Income deleted",
        description: "The income entry has been removed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete income.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!user) return null

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Income</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track your revenue streams • Total: ${totalIncome.toLocaleString()}
              </p>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </div>

          <div className="space-y-4">
            {incomes.length === 0 ? (
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="py-16 text-center">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No income recorded yet</h3>
                  <p className="text-slate-600 dark:text-slate-400">Start tracking your income sources</p>
                </CardContent>
              </Card>
            ) : (
              incomes.map((income) => (
                <Card
                  key={income.id}
                  className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-2xl flex-shrink-0">
                        {incomeIcons[income.type] || "💰"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                            {income.source}
                          </h3>
                          {income.recurring && (
                            <Badge variant="secondary" className="text-xs">
                              {income.frequency}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="capitalize">{income.type}</span>
                          <span>•</span>
                          <span>{format(income.date, "MMM dd, yyyy")}</span>
                          {income.description && (
                            <>
                              <span>•</span>
                              <span>{income.description}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          +${income.amount.toLocaleString()}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(income)}
                        className="text-red-600 dark:text-red-400"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <AddIncomeDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={() => {}} />
      </main>
    </div>
  )
}
