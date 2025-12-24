"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase/context"
import {
  subscribeToFamilyRemittances,
  getFamilyRecipients,
  type FamilyRemittance,
  type FamilyRecipient,
} from "@/lib/firebase/firestore"
import { formatCurrency } from "@/lib/utils/exchange-rate"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Users, TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowRight, Calendar } from "lucide-react"
import { SendRemittanceDialog } from "@/components/remittance/send-remittance-dialog"
import { AddRecipientDialog } from "@/components/remittance/add-recipient-dialog"

export default function RemittancePage() {
  const { user } = useAuth()
  const [remittances, setRemittances] = useState<FamilyRemittance[]>([])
  const [recipients, setRecipients] = useState<FamilyRecipient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    setLoading(true)
    const unsubscribe = subscribeToFamilyRemittances(user.uid, (data) => {
      setRemittances(data)
      setLoading(false)
    })

    loadRecipients()

    return () => unsubscribe()
  }, [user])

  const loadRecipients = async () => {
    if (!user) return
    try {
      const data = await getFamilyRecipients(user.uid)
      setRecipients(data)
    } catch (error) {
      console.error("Error loading recipients:", error)
    }
  }

  const totalSent = remittances.reduce((sum, r) => sum + r.totalCost, 0)
  const totalSentNPR = remittances.reduce((sum, r) => sum + r.localAmount, 0)
  const completedCount = remittances.filter((r) => r.status === "completed").length
  const avgExchangeRate =
    remittances.length > 0 ? remittances.reduce((sum, r) => sum + r.exchangeRate, 0) / remittances.length : 0

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: "default" as const, icon: CheckCircle2, label: "Completed" },
      "in-transit": { variant: "secondary" as const, icon: Clock, label: "In Transit" },
      pending: { variant: "outline" as const, icon: Clock, label: "Pending" },
      failed: { variant: "destructive" as const, icon: AlertCircle, label: "Failed" },
    }
    const config = variants[status as keyof typeof variants] || variants.pending
    const Icon = config.icon
    return (
      <Badge variant={config.variant}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPurposeLabel = (purpose: string) => {
    const labels: Record<string, string> = {
      medical: "Medical",
      education: "Education",
      living: "Living Expenses",
      emergency: "Emergency",
      gift: "Gift",
      other: "Other",
    }
    return labels[purpose] || purpose
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view remittances</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Family Remittances</h1>
          <p className="text-muted-foreground">Send money to your family in Nepal</p>
        </div>
        <SendRemittanceDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/20">
              <Send className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="text-2xl font-bold">{formatCurrency(totalSent, "USD")}</p>
              <p className="text-xs text-muted-foreground">₨{totalSentNPR.toLocaleString("ne-NP")}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Rate</p>
              <p className="text-2xl font-bold">₨{avgExchangeRate.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">per USD</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
              <CheckCircle2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">
                of {remittances.length} transfer{remittances.length !== 1 && "s"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/20">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recipients</p>
              <p className="text-2xl font-bold">{recipients.length}</p>
              <AddRecipientDialog />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transfers</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">Loading remittances...</div>
            </Card>
          ) : remittances.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Send className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No remittances yet</h3>
                <p className="text-sm text-muted-foreground">Start sending money to your family in Nepal</p>
              </div>
            </Card>
          ) : (
            remittances.map((remittance) => (
              <Card key={remittance.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{remittance.recipientName}</h3>
                      {getStatusBadge(remittance.status)}
                      {remittance.isRecurring && (
                        <Badge variant="secondary">
                          <Calendar className="mr-1 h-3 w-3" />
                          {remittance.recurringPattern}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{getPurposeLabel(remittance.purpose)}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">{formatCurrency(remittance.amount, "USD")}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        ₨{remittance.localAmount.toLocaleString("ne-NP")}
                      </span>
                      <span className="text-muted-foreground">@ ₨{remittance.exchangeRate.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{remittance.date.toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{remittance.transferMethod}</p>
                    {remittance.expectedDelivery && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Delivery: {remittance.expectedDelivery.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {remittance.notes && <p className="mt-4 text-sm text-muted-foreground">{remittance.notes}</p>}
                <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="text-muted-foreground">Total Cost</span>
                  <span className="font-semibold">{formatCurrency(remittance.totalCost, "USD")}</span>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed">
          {remittances.filter((r) => r.status === "completed").length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">No completed transfers</div>
            </Card>
          ) : (
            remittances
              .filter((r) => r.status === "completed")
              .map((remittance) => (
                <Card key={remittance.id} className="mb-4 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{remittance.recipientName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(remittance.amount, "USD")} → ₨{remittance.localAmount.toLocaleString("ne-NP")}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{remittance.date.toLocaleDateString()}</p>
                  </div>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="recurring">
          {remittances.filter((r) => r.isRecurring).length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">No recurring transfers</div>
            </Card>
          ) : (
            remittances
              .filter((r) => r.isRecurring)
              .map((remittance) => (
                <Card key={remittance.id} className="mb-4 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{remittance.recipientName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(remittance.amount, "USD")} • {remittance.recurringPattern}
                      </p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="recipients">
          {recipients.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No recipients yet</h3>
                <p className="text-sm text-muted-foreground">Add family members to send money to</p>
                <div className="mt-4">
                  <AddRecipientDialog />
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recipients.map((recipient) => (
                <Card key={recipient.id} className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{recipient.name}</h3>
                      <Badge variant="outline">{recipient.relationship}</Badge>
                    </div>
                    {recipient.phone && <p className="text-sm text-muted-foreground">{recipient.phone}</p>}
                    {recipient.address && (
                      <p className="text-sm text-muted-foreground">
                        {recipient.address.city && `${recipient.address.city}, `}
                        {recipient.address.country}
                      </p>
                    )}
                    {recipient.preferredMethod && (
                      <p className="text-xs text-muted-foreground">
                        Preferred: {recipient.preferredMethod.replace("-", " ")}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
