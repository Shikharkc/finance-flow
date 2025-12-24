"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Anomaly } from "@/lib/utils/anomaly-detection"

interface AnomalyAlertsProps {
  anomalies: Anomaly[]
  onDismiss?: (anomaly: Anomaly) => void
}

export function AnomalyAlerts({ anomalies, onDismiss }: AnomalyAlertsProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-l-red-600 bg-red-50 dark:bg-red-950/20"
      case "medium":
        return "border-l-amber-600 bg-amber-50 dark:bg-amber-950/20"
      default:
        return "border-l-blue-600 bg-blue-50 dark:bg-blue-950/20"
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "unusual-amount": "Unusual Amount",
      "frequency-spike": "High Frequency",
      "new-merchant": "New Merchant",
      duplicate: "Duplicate Alert",
      "location-change": "Location Change",
    }
    return labels[type] || type
  }

  if (anomalies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Anomaly Detection
          </CardTitle>
          <CardDescription>Monitoring your transactions for unusual activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <Shield className="mx-auto mb-2 h-12 w-12 text-emerald-600/50" />
            <p className="font-medium text-emerald-700 dark:text-emerald-400">All Clear!</p>
            <p className="text-sm text-muted-foreground">No anomalies detected in your recent transactions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-600" />
          Anomaly Detection
        </CardTitle>
        <CardDescription>{anomalies.length} potential issue(s) detected</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {anomalies.map((anomaly, idx) => (
            <div key={idx} className={`rounded-lg border-l-4 p-4 transition-all ${getSeverityColor(anomaly.severity)}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {getSeverityIcon(anomaly.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{getTypeLabel(anomaly.type)}</h4>
                      <Badge
                        variant={anomaly.severity === "high" ? "destructive" : "secondary"}
                        className="text-xs capitalize"
                      >
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{anomaly.message}</p>
                    <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      Recommendation: {anomaly.recommendation}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      ${anomaly.expense.amount.toFixed(2)} • {anomaly.expense.description} •{" "}
                      {anomaly.expense.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {onDismiss && (
                  <Button size="sm" variant="ghost" onClick={() => onDismiss(anomaly)}>
                    Dismiss
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
