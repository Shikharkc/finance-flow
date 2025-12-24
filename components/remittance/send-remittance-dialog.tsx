"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/firebase/context"
import { addFamilyRemittance, getFamilyRecipients, type FamilyRecipient } from "@/lib/firebase/firestore"
import {
  getUSDToNPRRate,
  convertUSDToNPR,
  formatCurrency,
  getTransferFee,
  getExpectedDeliveryDate,
} from "@/lib/utils/exchange-rate"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Send, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { AddRecipientDialog } from "./add-recipient-dialog"

export function SendRemittanceDialog() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recipients, setRecipients] = useState<FamilyRecipient[]>([])
  const [exchangeRate, setExchangeRate] = useState(132.5)
  const [rateLoading, setRateLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const [formData, setFormData] = useState({
    recipientId: "",
    amount: "",
    purpose: "living",
    transferMethod: "western-union",
    deliveryOption: "cash-pickup",
    notes: "",
    reminderSet: false,
    isRecurring: false,
    recurringPattern: "monthly",
  })

  const amount = Number.parseFloat(formData.amount) || 0
  const transferFee = getTransferFee(formData.transferMethod, amount)
  const totalCost = amount + transferFee
  const localAmount = convertUSDToNPR(amount, exchangeRate)

  useEffect(() => {
    if (open && user) {
      loadRecipients()
      loadExchangeRate()
    }
  }, [open, user])

  const loadRecipients = async () => {
    if (!user) return
    try {
      const data = await getFamilyRecipients(user.uid)
      setRecipients(data)
    } catch (error) {
      console.error("Error loading recipients:", error)
    }
  }

  const loadExchangeRate = async () => {
    setRateLoading(true)
    try {
      const data = await getUSDToNPRRate()
      setExchangeRate(data.usd.sell) // Use sell rate for sending money
      setLastUpdated(data.lastUpdated)
    } catch (error) {
      console.error("Error loading exchange rate:", error)
      toast({
        title: "Exchange rate unavailable",
        description: "Using approximate rate. Please check before sending.",
        variant: "destructive",
      })
    } finally {
      setRateLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.recipientId) return

    const recipient = recipients.find((r) => r.id === formData.recipientId)
    if (!recipient) return

    setLoading(true)
    try {
      const expectedDelivery = getExpectedDeliveryDate(formData.transferMethod)

      await addFamilyRemittance({
        userId: user.uid,
        recipientId: formData.recipientId,
        recipientName: recipient.name,
        amount,
        currency: "USD",
        exchangeRate,
        localAmount,
        localCurrency: "NPR",
        transferMethod: formData.transferMethod as any,
        transferFee,
        totalCost,
        purpose: formData.purpose as any,
        deliveryOption: formData.deliveryOption as any,
        status: "completed",
        expectedDelivery,
        notes: formData.notes || undefined,
        reminderSet: formData.reminderSet,
        isRecurring: formData.isRecurring,
        recurringPattern: formData.isRecurring ? (formData.recurringPattern as any) : undefined,
        date: new Date(),
      })

      toast({
        title: "Remittance sent",
        description: `${formatCurrency(amount, "USD")} sent to ${recipient.name}`,
      })

      setOpen(false)
      setFormData({
        recipientId: "",
        amount: "",
        purpose: "living",
        transferMethod: "western-union",
        deliveryOption: "cash-pickup",
        notes: "",
        reminderSet: false,
        isRecurring: false,
        recurringPattern: "monthly",
      })
    } catch (error) {
      console.error("Send remittance error:", error)
      toast({
        title: "Error",
        description: "Failed to send remittance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedRecipient = recipients.find((r) => r.id === formData.recipientId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Send className="mr-2 h-4 w-4" />
          Send Money to Nepal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Family Remittance to Nepal</DialogTitle>
          <DialogDescription>Send money to your family members in Nepal</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
            <div>
              <p className="text-sm text-muted-foreground">Exchange Rate</p>
              <p className="text-lg font-semibold">1 USD = ₨{exchangeRate.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Updated: {lastUpdated.toLocaleTimeString()}</p>
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={loadExchangeRate} disabled={rateLoading}>
              <RefreshCw className={`h-4 w-4 ${rateLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="recipient">Recipient *</Label>
              <AddRecipientDialog />
            </div>
            <Select
              value={formData.recipientId}
              onValueChange={(value) => setFormData({ ...formData, recipientId: value })}
              required
            >
              <SelectTrigger id="recipient">
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {recipients.map((recipient) => (
                  <SelectItem key={recipient.id} value={recipient.id!}>
                    {recipient.name} ({recipient.relationship})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRecipient && (
              <p className="text-xs text-muted-foreground">
                {selectedRecipient.address?.city && `${selectedRecipient.address.city}, `}
                {selectedRecipient.address?.country}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => setFormData({ ...formData, purpose: value })}
                required
              >
                <SelectTrigger id="purpose">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical Expenses</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="living">Living Expenses</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="gift">Gift</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          {amount > 0 && (
            <div className="rounded-lg border bg-emerald-50 p-4 dark:bg-emerald-950/20">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Recipient will receive</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                ₨{localAmount.toLocaleString("ne-NP", { maximumFractionDigits: 2 })}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="transferMethod">Transfer Method *</Label>
              <Select
                value={formData.transferMethod}
                onValueChange={(value) => setFormData({ ...formData, transferMethod: value })}
                required
              >
                <SelectTrigger id="transferMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="western-union">Western Union</SelectItem>
                  <SelectItem value="moneygram">MoneyGram</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryOption">Delivery Option *</Label>
              <Select
                value={formData.deliveryOption}
                onValueChange={(value) => setFormData({ ...formData, deliveryOption: value })}
                required
              >
                <SelectTrigger id="deliveryOption">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash-pickup">Cash Pickup</SelectItem>
                  <SelectItem value="bank-deposit">Bank Deposit</SelectItem>
                  <SelectItem value="mobile-wallet">Mobile Wallet</SelectItem>
                  <SelectItem value="home-delivery">Home Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{formatCurrency(amount, "USD")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transfer Fee</span>
              <span className="font-medium">{formatCurrency(transferFee, "USD")}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total Cost</span>
              <span>{formatCurrency(totalCost, "USD")}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Expected delivery: {getExpectedDeliveryDate(formData.transferMethod).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="reminderSet" className="cursor-pointer">
                Set monthly reminder
              </Label>
              <Switch
                id="reminderSet"
                checked={formData.reminderSet}
                onCheckedChange={(checked) => setFormData({ ...formData, reminderSet: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isRecurring" className="cursor-pointer">
                Make this recurring
              </Label>
              <Switch
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
              />
            </div>
            {formData.isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="recurringPattern">Frequency</Label>
                <Select
                  value={formData.recurringPattern}
                  onValueChange={(value) => setFormData({ ...formData, recurringPattern: value })}
                >
                  <SelectTrigger id="recurringPattern">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.recipientId || amount <= 0}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? "Sending..." : "Send Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
