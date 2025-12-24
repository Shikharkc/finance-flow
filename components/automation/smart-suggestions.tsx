"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Insight } from "@/lib/utils/smart-insights"

interface SmartSuggestionsProps {
  insights: Insight[]
}

export function SmartSuggestions({ insights }: SmartSuggestionsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "savings":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      case "spending":
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "tip":
        return <Lightbulb className="h-5 w-5 text-purple-600" />
      default:
        return <Sparkles className="h-5 w-5 text-slate-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-600 bg-red-50 dark:bg-red-950/20"
      case "medium":
        return "border-l-amber-600 bg-amber-50 dark:bg-amber-950/20"
      default:
        return "border-l-blue-600 bg-blue-50 dark:bg-blue-950/20"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          AI Insights & Recommendations
        </CardTitle>
        <CardDescription>Personalized financial insights powered by smart analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Sparkles className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
              <p>No insights available yet. Add more transactions to get personalized recommendations.</p>
            </div>
          ) : (
            insights.map((insight, idx) => (
              <div
                key={idx}
                className={`rounded-lg border-l-4 p-4 transition-all hover:shadow-md ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge variant={insight.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                    {insight.actionable && insight.action && (
                      <Link href={insight.action.href}>
                        <Button size="sm" variant="outline" className="mt-3 bg-transparent">
                          {insight.action.label}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
