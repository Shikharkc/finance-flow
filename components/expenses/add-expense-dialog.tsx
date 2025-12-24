"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { addExpense, subscribeToExpenses, type Expense } from "@/lib/firebase/firestore"
import { useAuth } from "@/lib/firebase/context"
import { useToast } from "@/hooks/use-toast"
import { RoomRentForm } from "./room-rent-form"
import { DuplicateDetection } from "./duplicate-detection"
import { SmartSuggestions } from "./smart-suggestions"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase/config"

const categories = [
  {
    value: "house_expenses",
    label: "House Expenses",
    icon: "🏠",
    subcategories: [
      { value: "room_rent", label: "Room Rent" },
      { value: "utilities", label: "Utilities (Electricity, Water, Gas, Internet)" },
      { value: "maintenance", label: "Maintenance & Repairs" },
      { value: "home_insurance", label: "Home Insurance" },
      { value: "property_tax", label: "Property Tax" },
    ],
  },
  { value: "food", label: "Food & Dining", icon: "🍔" },
  { value: "groceries", label: "Groceries", icon: "🛒" },
  { value: "transportation", label: "Transportation", icon: "🚗" },
  { value: "utilities", label: "Utilities", icon: "⚡" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "other", label: "Other", icon: "📋" },
]

const paymentMethods = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "digital_wallet", label: "Digital Wallet" },
]

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddExpenseDialog({ open, onOpenChange, onSuccess }: AddExpenseDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [roomRentData, setRoomRentData] = useState<any>(null)
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([])
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(true)

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    paymentMethod: "",
    location: "",
    recurring: false,
  })

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToExpenses(user.uid, (expenses) => {
      setRecentExpenses(expenses.slice(0, 50))
    })

    return () => unsubscribe()
  }, [user])

  const categoryObj = categories.find((c) => c.value === selectedCategory)
  const showRoomRentForm = selectedCategory === "house_expenses" && selectedSubcategory === "room_rent"

  const handleSuggestionClick = (suggestion: Partial<Expense>) => {
    setFormData({
      ...formData,
      category: suggestion.category || formData.category,
      description: suggestion.description || formData.description,
      amount: suggestion.amount?.toString() || formData.amount,
      paymentMethod: suggestion.paymentMethod || formData.paymentMethod,
      recurring: suggestion.recurring || formData.recurring,
    })

    if (suggestion.category) {
      setSelectedCategory(suggestion.category)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      let expenseData: any

      if (showRoomRentForm && roomRentData) {
        const uploadedFiles = []
        if (roomRentData.files && roomRentData.files.length > 0) {
          for (const fileData of roomRentData.files) {
            const fileRef = ref(storage, `users/${user.uid}/receipts/${Date.now()}_${fileData.file.name}`)
            await uploadBytes(fileRef, fileData.file)
            const fileUrl = await getDownloadURL(fileRef)

            uploadedFiles.push({
              fileId: `${Date.now()}_${Math.random()}`,
              fileName: fileData.file.name,
              fileUrl,
              fileType: fileData.file.type,
              fileSize: fileData.file.size,
              uploadDate: new Date(),
              documentType: fileData.documentType,
            })
          }
        }

        expenseData = {
          userId: user.uid,
          amount: roomRentData.amount,
          category: "House Expenses",
          subcategory: "Room Rent",
          description: `Room rent for ${format(roomRentData.paymentDetails.rentPeriod.startDate, "MMM d")} - ${format(roomRentData.paymentDetails.rentPeriod.endDate, "MMM d, yyyy")}`,
          date: roomRentData.paymentDetails.paymentDate,
          paymentMethod: roomRentData.paymentMethod,
          paymentDetails: roomRentData.paymentDetails,
          files: uploadedFiles,
          automation: roomRentData.automation,
          tags: ["rent", "housing"],
        }
      } else {
        expenseData = {
          userId: user.uid,
          amount: Number.parseFloat(formData.amount),
          category: formData.category,
          subcategory: selectedSubcategory || undefined,
          description: formData.description,
          date,
          paymentMethod: formData.paymentMethod,
          location: formData.location,
          recurring: formData.recurring,
          tags: [],
        }
      }

      await addExpense(expenseData)

      toast({
        title: "Expense added",
        description: showRoomRentForm
          ? "Your rent payment has been recorded successfully."
          : "Your expense has been recorded successfully.",
      })

      setFormData({
        amount: "",
        category: "",
        description: "",
        paymentMethod: "",
        location: "",
        recurring: false,
      })
      setSelectedCategory("")
      setSelectedSubcategory("")
      setRoomRentData(null)
      setDate(new Date())
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Add expense error:", error)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
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
          <DialogTitle className="text-2xl font-bold">Add Expense</DialogTitle>
          <DialogDescription>Record a new expense transaction</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {recentExpenses.length > 0 && (
            <SmartSuggestions recentExpenses={recentExpenses} onSuggestionClick={handleSuggestionClick} />
          )}

          {formData.amount && formData.category && showDuplicateWarning && (
            <DuplicateDetection
              currentExpense={{
                amount: Number.parseFloat(formData.amount),
                category: formData.category,
                date,
                description: formData.description,
              }}
              existingExpenses={recentExpenses}
              onDismiss={() => setShowDuplicateWarning(false)}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">
              Category *
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value)
                setSelectedSubcategory("")
                setFormData({ ...formData, category: value })
              }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {categoryObj?.subcategories && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Subcategory *</Label>
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {categoryObj.subcategories.map((sub) => (
                    <SelectItem key={sub.value} value={sub.value}>
                      {sub.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showRoomRentForm ? (
            <RoomRentForm onDataChange={setRoomRentData} />
          ) : (
            <>
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
                  <Label htmlFor="category" className="text-sm font-semibold">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description *
                </Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="e.g., Grocery shopping at Whole Foods"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-semibold">
                    Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-start text-left font-normal bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-sm font-semibold">
                    Payment Method
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold">
                  Location (Optional)
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Whole Foods Market, Downtown"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <Label htmlFor="recurring" className="text-sm font-medium cursor-pointer">
                  This is a recurring expense
                </Label>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (showRoomRentForm && !roomRentData)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
