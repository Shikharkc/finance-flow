"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CalendarIcon,
  Save,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  X,
  FileText,
  ImageIcon,
} from "lucide-react"
import { format, differenceInDays, addDays } from "date-fns"
import { getUserProfile, updateUserProfile } from "@/lib/firebase/firestore"
import { useAuth } from "@/lib/firebase/context"
import { useToast } from "@/hooks/use-toast"

interface RoomRentFormProps {
  onDataChange: (data: any) => void
  initialData?: any
}

export function RoomRentForm({ onDataChange, initialData }: RoomRentFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [paymentDate, setPaymentDate] = useState<Date>(new Date())
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [weeklyRate, setWeeklyRate] = useState("")
  const [savedRate, setSavedRate] = useState<number | null>(null)
  const [calculatedAmount, setCalculatedAmount] = useState("")
  const [actualAmount, setActualAmount] = useState("")
  const [status, setStatus] = useState<"paid" | "unpaid" | "partial" | "overdue">("paid")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [landlordName, setLandlordName] = useState("")
  const [roomDetails, setRoomDetails] = useState("")
  const [files, setFiles] = useState<Array<{ file: File; preview: string; type: string }>>([])
  const [uploading, setUploading] = useState(false)

  // Load saved rental settings
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then((profile) => {
        if (profile?.rentalSettings) {
          setSavedRate(profile.rentalSettings.weeklyRate)
          setWeeklyRate(profile.rentalSettings.weeklyRate.toString())
          setLandlordName(profile.rentalSettings.currentLandlord?.name || "")
          setRoomDetails(profile.rentalSettings.roomDetails || "")
          setPaymentMethod(profile.rentalSettings.preferredMethod || "")
        }
      })
    }
  }, [user])

  // Calculate rent duration and amount
  useEffect(() => {
    if (startDate && endDate && weeklyRate) {
      const days = differenceInDays(endDate, startDate) + 1
      const weeks = days / 7
      const amount = (Number.parseFloat(weeklyRate) * weeks).toFixed(2)
      setCalculatedAmount(amount)
      setActualAmount(amount)

      // Warning for extended periods
      if (days > 35) {
        toast({
          title: "Extended rent period detected",
          description: `This rent period is ${days} days (${weeks.toFixed(1)} weeks)`,
          variant: "default",
        })
      }
    }
  }, [startDate, endDate, weeklyRate])

  // Auto-suggest rent period based on payment date
  useEffect(() => {
    if (paymentDate && !startDate && !endDate) {
      const suggestedStart = addDays(paymentDate, -30)
      const suggestedEnd = addDays(paymentDate, -1)
      setStartDate(suggestedStart)
      setEndDate(suggestedEnd)
    }
  }, [paymentDate])

  // Emit data changes
  useEffect(() => {
    if (startDate && endDate && actualAmount) {
      const days = differenceInDays(endDate, startDate) + 1
      const weeks = days / 7

      onDataChange({
        amount: Number.parseFloat(actualAmount),
        paymentDetails: {
          paymentDate,
          status,
          actualAmount: Number.parseFloat(actualAmount),
          rentPeriod: {
            startDate,
            endDate,
            totalDays: days,
            totalWeeks: Number.parseFloat(weeks.toFixed(2)),
          },
          weeklyRate: Number.parseFloat(weeklyRate),
          calculatedAmount: Number.parseFloat(calculatedAmount),
          landlordName,
          roomDetails,
        },
        paymentMethod,
        files: files.map((f, idx) => ({
          file: f.file,
          documentType: f.type === "application/pdf" ? "invoice" : "photo",
        })),
        automation: {
          isRecurring: true,
          autoCalculate: true,
          savedRateUsed: weeklyRate === savedRate?.toString(),
        },
      })
    }
  }, [
    paymentDate,
    startDate,
    endDate,
    weeklyRate,
    calculatedAmount,
    actualAmount,
    status,
    paymentMethod,
    landlordName,
    roomDetails,
    files,
  ])

  const handleSaveRate = async () => {
    if (!user || !weeklyRate) return

    const rate = Number.parseFloat(weeklyRate)
    if (savedRate && rate > savedRate * 2) {
      const confirm = window.confirm(
        `Rate increased from $${savedRate} to $${rate}. This is more than double. Save new rate?`,
      )
      if (!confirm) return
    }

    const rentalSettings: any = {
      weeklyRate: rate,
      rateHistory: [...(savedRate ? [{ rate: savedRate, effectiveDate: new Date() }] : [])],
    }

    // Only add fields if they have values
    if (landlordName) {
      rentalSettings.currentLandlord = { name: landlordName }
    }
    if (roomDetails) {
      rentalSettings.roomDetails = roomDetails
    }
    if (paymentMethod) {
      rentalSettings.preferredMethod = paymentMethod
    }

    await updateUserProfile(user.uid, {
      rentalSettings,
    } as any)

    setSavedRate(rate)
    toast({
      title: "Rate saved",
      description: `Weekly rent rate of $${rate} has been saved to your profile.`,
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter((file) => {
      const isValid = file.size <= 10 * 1024 * 1024 // 10MB
      if (!isValid) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        })
      }
      return isValid
    })

    const newFiles = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "unpaid":
        return <XCircle className="h-4 w-4 text-rose-500" />
      case "partial":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case "paid":
        return "text-green-500 bg-green-50 border-green-200"
      case "unpaid":
        return "text-rose-500 bg-rose-50 border-rose-200"
      case "partial":
        return "text-amber-500 bg-amber-50 border-amber-200"
      case "overdue":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return ""
    }
  }

  const totalDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0
  const totalWeeks = totalDays / 7

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
          <span className="text-xl">🏠</span>
          <span>Room Rent Payment</span>
        </div>
        <p className="text-sm text-emerald-600 dark:text-emerald-500">
          Intelligent rent tracking with auto-calculation and rate management
        </p>
      </div>

      {/* Payment Date */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Payment Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full h-12 justify-start text-left font-normal bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(paymentDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={paymentDate} onSelect={(date) => date && setPaymentDate(date)} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Rent Period */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Rent Period *</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PP") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PP") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {totalDays > 0 && (
          <div className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900 p-2 rounded">
            <span className="font-medium">{totalDays} days</span>
            <span className="mx-2">•</span>
            <span className="font-medium">{totalWeeks.toFixed(2)} weeks</span>
            {totalDays > 35 && <span className="ml-2 text-amber-600 dark:text-amber-500">⚠️ Extended period</span>}
          </div>
        )}
      </div>

      {/* Weekly Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Weekly Rent Rate *</Label>
          {savedRate && <span className="text-xs text-green-600 dark:text-green-500">💾 Saved: ${savedRate}/week</span>}
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            placeholder="150.00"
            value={weeklyRate}
            onChange={(e) => setWeeklyRate(e.target.value)}
            className="h-12 text-lg"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveRate}
            className="h-12 bg-transparent"
            disabled={!weeklyRate || weeklyRate === savedRate?.toString()}
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Amount Calculation */}
      {calculatedAmount && (
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="text-sm text-blue-700 dark:text-blue-400 mb-1">Calculated Amount</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">${calculatedAmount}</div>
            <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">
              ${weeklyRate}/week × {totalWeeks.toFixed(2)} weeks
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Actual Amount Paid *</Label>
            <Input
              type="number"
              step="0.01"
              value={actualAmount}
              onChange={(e) => setActualAmount(e.target.value)}
              className="h-12 text-lg"
            />
            {actualAmount !== calculatedAmount && actualAmount && (
              <div className="text-xs text-amber-600 dark:text-amber-500">⚠️ Amount differs from calculation</div>
            )}
          </div>
        </div>
      )}

      {/* Payment Status */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Payment Status *</Label>
        <Select value={status} onValueChange={(v: any) => setStatus(v)}>
          <SelectTrigger className={`h-12 ${getStatusColor(status)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(status)}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paid">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Paid</span>
              </div>
            </SelectItem>
            <SelectItem value="unpaid">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-rose-500" />
                <span>Unpaid</span>
              </div>
            </SelectItem>
            <SelectItem value="partial">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Partial Payment</span>
              </div>
            </SelectItem>
            <SelectItem value="overdue">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span>Overdue</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="check">Check</SelectItem>
            <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Landlord Name</Label>
          <Input
            placeholder="e.g., John Smith"
            value={landlordName}
            onChange={(e) => setLandlordName(e.target.value)}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Room Details</Label>
          <Input
            placeholder="e.g., Room 2A, Second Floor"
            value={roomDetails}
            onChange={(e) => setRoomDetails(e.target.value)}
            className="h-12"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Attachments (Receipts, Contracts, Photos)</Label>
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-600 dark:text-slate-400">Drop files here or click to browse</p>
            <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG, DOC (max 10MB each)</p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {files.map((file, idx) => (
              <div key={idx} className="relative border rounded-lg p-2 flex items-center gap-2">
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                ) : (
                  <FileText className="h-8 w-8 text-red-500" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">{file.file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(idx)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
