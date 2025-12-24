"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { subscribeToExpenses, type Expense, getUserProfile } from "@/lib/firebase/firestore"
import { RentHistoryWidget } from "@/components/expenses/rent-history-widget"
import { RentAnalytics } from "@/components/expenses/rent-analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2, TrendingUp, Calendar, DollarSign, Home } from "lucide-react"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"
import { getRentInsights } from "@/lib/utils/rent-helpers"
import { Badge } from "@/components/ui/badge"

export default function RentManagementPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [rentExpenses, setRentExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [savedRate, setSavedRate] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return

    setLoading(true)

    // Load user profile for saved rate
    getUserProfile(user.uid).then((profile) => {
      if (profile?.rentalSettings?.weeklyRate) {
        setSavedRate(profile.rentalSettings.weeklyRate)
      }
    })

    // Subscribe to rent expenses
    const unsubscribe = subscribeToExpenses(user.uid, (expenses) => {
      const rentOnly = expenses.filter((e) => e.subcategory === "Room Rent")
      setRentExpenses(rentOnly)
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

  const insights = getRentInsights(rentExpenses)
  const totalPaid = rentExpenses.reduce((sum, e) => sum + e.amount, 0)
  const averageRent = rentExpenses.length > 0 ? totalPaid / rentExpenses.length : 0
  const lastPayment = rentExpenses[0]

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <span className="text-4xl">🏠</span>
                Room Rent Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Intelligent rent tracking with auto-calculation and insights
              </p>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
              <Plus className="h-4 w-4" />
              Add Rent Payment
            </Button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">${totalPaid.toLocaleString()}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">All time</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Average Rent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">${averageRent.toFixed(0)}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Per payment</div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Total Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{rentExpenses.length}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Recorded</div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Saved Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {savedRate ? `$${savedRate}` : "—"}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Per week</div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          {insights.hasData && insights.insights.length > 0 && (
            <Card className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Rent Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {insights.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-300">
                      <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Last Payment Preview */}
          {lastPayment && (
            <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Last Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Amount</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">${lastPayment.amount}</div>
                  </div>
                  {lastPayment.paymentDetails?.rentPeriod && (
                    <>
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Period</div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {lastPayment.paymentDetails.rentPeriod.totalDays} days
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Weeks</div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {lastPayment.paymentDetails.rentPeriod.totalWeeks.toFixed(1)}
                        </div>
                      </div>
                    </>
                  )}
                  {lastPayment.paymentDetails?.weeklyRate && (
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Weekly Rate</div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        ${lastPayment.paymentDetails.weeklyRate}
                      </div>
                    </div>
                  )}
                </div>
                {lastPayment.paymentDetails?.status && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Status:</span>
                    <Badge
                      variant={lastPayment.paymentDetails.status === "paid" ? "default" : "destructive"}
                      className="capitalize"
                    >
                      {lastPayment.paymentDetails.status}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Analytics and History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rentExpenses.length > 0 ? (
              <>
                <RentAnalytics rentExpenses={rentExpenses} />
                <RentHistoryWidget />
              </>
            ) : (
              <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
                <CardContent className="py-16 text-center">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No rent payments yet</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Start tracking your room rent with intelligent automation and insights
                  </p>
                  <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                    <Plus className="h-4 w-4" />
                    Add Your First Rent Payment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <AddExpenseDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={() => {
            setShowAddDialog(false)
          }}
        />
      </main>
    </div>
  )
}
