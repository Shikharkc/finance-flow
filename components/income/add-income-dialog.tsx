"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { addIncome } from "@/lib/firebase/firestore"
import { useAuth } from "@/lib/firebase/context"
import { useToast } from "@/hooks/use-toast"

const incomeTypes = [
  { value: "salary", label: "Salary", icon: "💼" },
  { value: "freelance", label: "Freelance", icon: "💻" },
  { value: "business", label: "Business", icon: "🏢" },
  { value: "investment", label: "Investment", icon: "📈" },
  { value: "rental", label: "Rental Income", icon: "🏘️" },
  { value: "bonus", label: "Bonus", icon: "🎁" },
  { value: "gift", label: "Gift", icon: "🎉" },
  { value: "other", label: "Other", icon: "💰" },
]

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
]

interface AddIncomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddIncomeDialog({ open, onOpenChange, onSuccess }: AddIncomeDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>(new Date())

  const [formData, setFormData] = useState({
    amount: "",
    type: "",
    source: "",
    description: "",
    recurring: false,
    frequency: "monthly" as "weekly" | "bi-weekly" | "monthly" | "quarterly" | "annual",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await addIncome({
        userId: user.uid,
        amount: Number.parseFloat(formData.amount),
        type: formData.type,
        source: formData.source,
        description: formData.description,
        date,
        recurring: formData.recurring,
        frequency: formData.recurring ? formData.frequency : undefined,
      })

      toast({
        title: "Income added",
        description: "Your income has been recorded successfully.",
      })

      setFormData({
        amount: "",
        type: "",
        source: "",
        description: "",
        recurring: false,
        frequency: "monthly",
      })
      setDate(new Date())
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add income. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Income</DialogTitle>
          <DialogDescription>Record a new income transaction</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                Amount *
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
              <Label htmlFor="type" className="text-sm font-semibold">
                Income Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {incomeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-semibold">
              Source *
            </Label>
            <Input
              id="source"
              type="text"
              placeholder="e.g., Company Name, Client Name, etc."
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., Monthly salary, Project payment, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300"
              />
              <Label htmlFor="recurring" className="text-sm font-medium cursor-pointer">
                This is recurring income
              </Label>
            </div>

            {formData.recurring && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="frequency" className="text-sm font-semibold">
                  Frequency
                </Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Income"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
