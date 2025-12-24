"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface DataPoint {
  x: number // income
  y: number // spending
  label: string
  month: string
}

interface ScatterPlotProps {
  data: DataPoint[]
  title?: string
  description?: string
}

export function ScatterPlot({
  data,
  title = "Income vs Spending Correlation",
  description = "Analyze your spending patterns relative to income",
}: ScatterPlotProps) {
  const maxX = Math.max(...data.map((d) => d.x))
  const maxY = Math.max(...data.map((d) => d.y))
  const padding = 40

  const xScale = (value: number) => padding + (value / maxX) * (300 - 2 * padding)
  const yScale = (value: number) => 300 - padding - (value / maxY) * (300 - 2 * padding)

  const avgX = data.reduce((sum, d) => sum + d.x, 0) / data.length
  const avgY = data.reduce((sum, d) => sum + d.y, 0) / data.length

  const slope =
    data.reduce((sum, d) => sum + (d.x - avgX) * (d.y - avgY), 0) / data.reduce((sum, d) => sum + (d.x - avgX) ** 2, 0)
  const intercept = avgY - slope * avgX

  const trendlineStart = { x: 0, y: intercept }
  const trendlineEnd = { x: maxX, y: slope * maxX + intercept }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <svg viewBox="0 0 300 300" className="h-80 w-full">
            <defs>
              <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            <line
              x1={padding}
              y1={300 - padding}
              x2={300 - padding}
              y2={300 - padding}
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-300 dark:text-slate-700"
            />
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={300 - padding}
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-300 dark:text-slate-700"
            />

            <text x={150} y={295} textAnchor="middle" className="fill-slate-600 text-xs dark:fill-slate-400">
              Income ($)
            </text>
            <text
              x={15}
              y={150}
              textAnchor="middle"
              transform="rotate(-90 15 150)"
              className="fill-slate-600 text-xs dark:fill-slate-400"
            >
              Spending ($)
            </text>

            <line
              x1={xScale(trendlineStart.x)}
              y1={yScale(trendlineStart.y)}
              x2={xScale(trendlineEnd.x)}
              y2={yScale(trendlineEnd.y)}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.5"
            />

            {data.map((point, idx) => (
              <g key={idx}>
                <circle
                  cx={xScale(point.x)}
                  cy={yScale(point.y)}
                  r="6"
                  fill="url(#dotGradient)"
                  className="hover:r-8 transition-all cursor-pointer"
                  opacity="0.8"
                />
                <text
                  x={xScale(point.x)}
                  y={yScale(point.y) - 12}
                  textAnchor="middle"
                  className="fill-slate-700 text-[10px] font-medium dark:fill-slate-300"
                >
                  {point.month}
                </text>
              </g>
            ))}
          </svg>

          <div className="grid w-full grid-cols-3 gap-4 rounded-lg border bg-muted/50 p-4 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Correlation</p>
              <p className="font-bold">{(slope * 100).toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Avg Income</p>
              <p className="font-bold">${avgX.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Avg Spending</p>
              <p className="font-bold">${avgY.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
