"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Bill {
  id: string
  name: string
  amount: number
  dueDate: Date
  status: "paid" | "due" | "overdue" | "upcoming"
  category: string
  autopay: boolean
}

interface BillPaymentCalendarProps {
  bills: Bill[]
}

export function BillPaymentCalendar({ bills }: BillPaymentCalendarProps) {
  const sortedBills = [...bills].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "due":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "default",
      due: "secondary",
      overdue: "destructive",
      upcoming: "outline",
    }
    return variants[status as keyof typeof variants] || "outline"
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `Due in ${diffDays} days`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Bill Payment Calendar
        </CardTitle>
        <CardDescription>Upcoming and recent bill payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedBills.map((bill) => (
            <div
              key={bill.id}
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(bill.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{bill.name}</p>
                    {bill.autopay && (
                      <Badge variant="outline" className="text-xs">
                        Auto-pay
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{getDaysUntilDue(bill.dueDate)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                <Badge variant={getStatusBadge(bill.status) as any} className="text-xs capitalize">
                  {bill.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
