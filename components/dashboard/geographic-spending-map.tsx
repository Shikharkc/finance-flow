"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface SpendingLocation {
  location: string
  amount: number
  count: number
  lat: number
  lng: number
  category: string
}

interface GeographicSpendingMapProps {
  locations: SpendingLocation[]
  totalSpending: number
}

export function GeographicSpendingMap({ locations, totalSpending }: GeographicSpendingMapProps) {
  const topLocations = locations.sort((a, b) => b.amount - a.amount).slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-600" />
          Geographic Spending
        </CardTitle>
        <CardDescription>Where you spend the most</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topLocations.map((location, index) => {
            const percentage = (location.amount / totalSpending) * 100
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
                        index === 0
                          ? "bg-emerald-600"
                          : index === 1
                            ? "bg-blue-600"
                            : index === 2
                              ? "bg-purple-600"
                              : "bg-slate-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{location.location}</p>
                      <p className="text-xs text-muted-foreground">{location.count} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${location.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full ${
                      index === 0
                        ? "bg-emerald-600"
                        : index === 1
                          ? "bg-blue-600"
                          : index === 2
                            ? "bg-purple-600"
                            : "bg-slate-400"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
