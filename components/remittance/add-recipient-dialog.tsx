"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/firebase/context"
import { addFamilyRecipient } from "@/lib/firebase/firestore"
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
import { UserPlus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function AddRecipientDialog() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    city: "",
    country: "Nepal",
    accountName: "",
    accountNumber: "",
    bankName: "",
    preferredMethod: "cash-pickup",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await addFamilyRecipient({
        userId: user.uid,
        name: formData.name,
        relationship: formData.relationship,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        address: {
          city: formData.city || undefined,
          country: formData.country,
        },
        bankDetails: formData.accountNumber
          ? {
              accountName: formData.accountName || undefined,
              accountNumber: formData.accountNumber,
              bankName: formData.bankName || undefined,
            }
          : undefined,
        preferredMethod: formData.preferredMethod as any,
        notes: formData.notes || undefined,
      })

      toast({
        title: "Recipient added",
        description: `${formData.name} has been added to your recipients.`,
      })

      setOpen(false)
      setFormData({
        name: "",
        relationship: "",
        phone: "",
        email: "",
        city: "",
        country: "Nepal",
        accountName: "",
        accountNumber: "",
        bankName: "",
        preferredMethod: "cash-pickup",
        notes: "",
      })
    } catch (error) {
      console.error("Add recipient error:", error)
      toast({
        title: "Error",
        description: "Failed to add recipient. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Recipient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Family Recipient</DialogTitle>
          <DialogDescription>Add a family member in Nepal to send money to</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                required
              >
                <SelectTrigger id="relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="grandparent">Grandparent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" value={formData.country} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredMethod">Preferred Transfer Method</Label>
            <Select
              value={formData.preferredMethod}
              onValueChange={(value) => setFormData({ ...formData, preferredMethod: value })}
            >
              <SelectTrigger id="preferredMethod">
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

          {formData.preferredMethod === "bank-deposit" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

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
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Recipient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
