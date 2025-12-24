"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter, useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"
import { ExpenseFilters } from "@/components/expenses/expense-filters"
import { ExpenseList } from "@/components/expenses/expense-list"
import { BulkActions } from "@/components/expenses/bulk-actions"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Download } from "lucide-react"
import { subscribeToExpenses, deleteExpense, type Expense } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function ExpensesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowAddDialog(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (!user) return

    setLoading(true)
    const unsubscribe = subscribeToExpenses(user.uid, (data) => {
      setExpenses(data)
      setFilteredExpenses(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleFilterChange = (filters: any) => {
    let filtered = [...expenses]

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((e) => e.category === filters.category)
    }

    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.description.toLowerCase().includes(search) ||
          e.category.toLowerCase().includes(search) ||
          e.location?.toLowerCase().includes(search),
      )
    }

    if (filters.minAmount) {
      filtered = filtered.filter((e) => e.amount >= Number.parseFloat(filters.minAmount))
    }

    if (filters.maxAmount) {
      filtered = filtered.filter((e) => e.amount <= Number.parseFloat(filters.maxAmount))
    }

    if (filters.dateRange?.from) {
      filtered = filtered.filter((e) => e.date >= filters.dateRange.from)
    }

    if (filters.dateRange?.to) {
      filtered = filtered.filter((e) => e.date <= filters.dateRange.to)
    }

    setFilteredExpenses(filtered)
  }

  const handleDelete = async (expense: Expense) => {
    try {
      await deleteExpense(expense.id!)
      toast({
        title: "Expense deleted",
        description: "The expense has been removed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense.",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteExpense(id)))
      toast({
        title: "Expenses deleted",
        description: `${selectedIds.length} expense(s) removed successfully.`,
      })
      setSelectedIds([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expenses.",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const selected = filteredExpenses.filter((e) => selectedIds.includes(e.id!))
    const csv = [
      ["Date", "Category", "Description", "Amount", "Payment Method", "Location"].join(","),
      ...selected.map((e) =>
        [
          e.date.toLocaleDateString(),
          e.category,
          e.description,
          e.amount,
          e.paymentMethod || "",
          e.location || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    toast({
      title: "Exported successfully",
      description: `${selected.length} expense(s) exported to CSV.`,
    })
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!user) return null

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Expenses</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track and manage your spending • Total: ${totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleExport} className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export All
              </Button>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <ExpenseFilters onFilterChange={handleFilterChange} />

            {selectedIds.length > 0 && (
              <BulkActions
                selectedCount={selectedIds.length}
                onDelete={handleBulkDelete}
                onCategorize={() => {}}
                onExport={handleExport}
                onClear={() => setSelectedIds([])}
              />
            )}

            <ExpenseList
              expenses={filteredExpenses}
              onEdit={(expense) => console.log("Edit", expense)}
              onDelete={handleDelete}
              onSelectionChange={setSelectedIds}
            />
          </div>
        </div>

        <AddExpenseDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={() => {}} />
      </main>
    </div>
  )
}
