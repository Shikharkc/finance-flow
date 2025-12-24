"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TaxDeduction {
  category: string
  amount: number
  count: number
  deductible: boolean
}

interface TaxReportProps {
  deductions: TaxDeduction[]
  totalDeductible: number
  year: number
  onExport: () => void
}

export function TaxReport({ deductions, totalDeductible, year, onExport }: TaxReportProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-green-600" />
              Tax Deduction Report
            </CardTitle>
            <CardDescription>Potentially deductible expenses for {year}</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-green-50 p-6 dark:bg-green-950/20">
          <p className="text-sm text-muted-foreground">Total Potential Deductions</p>
          <p className="text-4xl font-bold text-green-600">${totalDeductible.toLocaleString()}</p>
          <p className="mt-2 text-xs text-muted-foreground">Consult with a tax professional to confirm eligibility</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Deduction Breakdown</h3>
          <div className="space-y-3">
            {deductions.map((deduction, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{deduction.category}</span>
                    {deduction.deductible && (
                      <Badge variant="default" className="bg-green-600">
                        Deductible
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{deduction.count} transactions</p>
                </div>
                <span className="text-lg font-semibold">${deduction.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-amber-50 p-4 dark:bg-amber-950/20">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Important Notice</p>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
            This report is for informational purposes only. Consult with a qualified tax professional or CPA to
            determine which expenses are deductible for your specific situation. Keep all receipts and documentation for
            verification.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
