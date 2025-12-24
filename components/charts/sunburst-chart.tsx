"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "lucide-react"

interface CategoryData {
  name: string
  value: number
  color: string
  subcategories?: Array<{
    name: string
    value: number
    color: string
  }>
}

interface SunburstChartProps {
  data: CategoryData[]
  title?: string
  description?: string
}

export function SunburstChart({
  data,
  title = "Hierarchical Spending Breakdown",
  description = "Category and subcategory analysis",
}: SunburstChartProps) {
  const total = data.reduce((sum, cat) => sum + cat.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-orange-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative h-64 w-64">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <circle cx="100" cy="100" r="30" fill="white" className="dark:fill-slate-950" />
              <text
                x="100"
                y="100"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-900 text-xs font-bold dark:fill-white"
              >
                ${total.toLocaleString()}
              </text>
              <text
                x="100"
                y="115"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-500 text-[10px]"
              >
                Total
              </text>

              {data.map((category, idx) => {
                const percentage = category.value / total
                const startAngle = data.slice(0, idx).reduce((sum, c) => sum + (c.value / total) * 360, 0)
                const endAngle = startAngle + percentage * 360

                const innerRadius = 40
                const outerRadius = 70

                const startRad = ((startAngle - 90) * Math.PI) / 180
                const endRad = ((endAngle - 90) * Math.PI) / 180

                const x1 = 100 + innerRadius * Math.cos(startRad)
                const y1 = 100 + innerRadius * Math.sin(startRad)
                const x2 = 100 + outerRadius * Math.cos(startRad)
                const y2 = 100 + outerRadius * Math.sin(startRad)
                const x3 = 100 + outerRadius * Math.cos(endRad)
                const y3 = 100 + outerRadius * Math.sin(endRad)
                const x4 = 100 + innerRadius * Math.cos(endRad)
                const y4 = 100 + innerRadius * Math.sin(endRad)

                const largeArcFlag = percentage > 0.5 ? 1 : 0

                const path = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`

                return (
                  <g key={idx}>
                    <path
                      d={path}
                      fill={category.color}
                      opacity="0.9"
                      className="hover:opacity-100 transition-opacity"
                    />
                  </g>
                )
              })}

              {data.map((category, idx) => {
                if (!category.subcategories) return null

                const categoryPercentage = category.value / total
                const categoryStartAngle = data.slice(0, idx).reduce((sum, c) => sum + (c.value / total) * 360, 0)

                let subStartAngle = categoryStartAngle
                return category.subcategories.map((sub, subIdx) => {
                  const subPercentage = (sub.value / total) * (categoryPercentage / categoryPercentage)
                  const subEndAngle = subStartAngle + (sub.value / category.value) * categoryPercentage * 360

                  const innerRadius = 75
                  const outerRadius = 95

                  const startRad = ((subStartAngle - 90) * Math.PI) / 180
                  const endRad = ((subEndAngle - 90) * Math.PI) / 180

                  const x1 = 100 + innerRadius * Math.cos(startRad)
                  const y1 = 100 + innerRadius * Math.sin(startRad)
                  const x2 = 100 + outerRadius * Math.cos(startRad)
                  const y2 = 100 + outerRadius * Math.sin(startRad)
                  const x3 = 100 + outerRadius * Math.cos(endRad)
                  const y3 = 100 + outerRadius * Math.sin(endRad)
                  const x4 = 100 + innerRadius * Math.cos(endRad)
                  const y4 = 100 + innerRadius * Math.sin(endRad)

                  const largeArcFlag = (sub.value / category.value) * categoryPercentage > 0.5 ? 1 : 0

                  const path = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`

                  const result = (
                    <path
                      key={`${idx}-${subIdx}`}
                      d={path}
                      fill={sub.color}
                      opacity="0.7"
                      className="hover:opacity-100 transition-opacity"
                    />
                  )

                  subStartAngle = subEndAngle
                  return result
                })
              })}
            </svg>
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            {data.map((category, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="ml-auto text-sm text-muted-foreground">${category.value.toLocaleString()}</span>
                </div>
                {category.subcategories && (
                  <div className="ml-5 space-y-1">
                    {category.subcategories.map((sub, subIdx) => (
                      <div key={subIdx} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: sub.color }} />
                        <span className="text-xs text-muted-foreground">{sub.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">${sub.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
