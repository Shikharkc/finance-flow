"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { addBudget } from "@/lib/firebase/firestore"
import { useAuth } from "@/lib/firebase/context"
import { useToast } from "@/hooks/use-toast"

const categories = [
  { value: "Housing", icon: "🏠", color: "#3b82f6" },
  { value: "Food & Dining", icon: "🍔", color: "#10b981" },
  { value: "Groceries", icon: "🛒", color: "#8b5cf6" },
  { value: "Transportation", icon: "🚗", color: "#f59e0b" },
  { value: "Utilities", icon: "⚡", color: "#ef4444" },
  { value: "Entertainment", icon: "🎬", color: "#ec4899" },
  { value: "Healthcare", icon: "🏥", color: "#06b6d4" },
  { value: "Shopping", icon: "🛍️", color: "#f97316" },
  { value: "Education", icon: "📚", color: "#8b5cf6" },
  { value: "Savings", icon: "🏦", color: "#10b981" },
  { value: "Investments", icon: "📈", color: "#6366f1" },
  { value: "Other", icon: "📋", color: "#64748b" },
]

interface CreateBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateBudgetDialog({ open, onOpenChange, onSuccess }: CreateBudgetDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly" as "monthly" | "weekly" | "annual",
    rollover: false,
  })

  const selectedCategory = categories.find((cat) => cat.value === formData.category)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedCategory) return

    setLoading(true)
    try {
      await addBudget({
        userId: user.uid,
        category: formData.category,
        amount: Number.parseFloat(formData.amount),
        spent: 0,
        period: formData.period,
        color: selectedCategory.color,
        icon: selectedCategory.icon,
        rollover: formData.rollover,
      })

      toast({
        title: "Budget created",
        description: "Your budget envelope has been created successfully.",
      })

      setFormData({
        category: "",
        amount: "",
        period: "monthly",
        rollover: false,
      })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create budget. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Budget Envelope</DialogTitle>
          <DialogDescription>Set up a new budget category to track spending</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.value}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                Budget Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="text-lg h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period" className="text-sm font-semibold">
                Period *
              </Label>
              <Select
                value={formData.period}
                onValueChange={(value: any) => setFormData({ ...formData, period: value })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rollover"
              checked={formData.rollover}
              onChange={(e) => setFormData({ ...formData, rollover: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="rollover" className="text-sm font-medium cursor-pointer">
              Enable rollover (carry unused funds to next period)
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Budget"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
