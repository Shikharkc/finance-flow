"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, FileText } from "lucide-react"

interface ReceiptOCRSimulatorProps {
  file: File
  onDataExtracted: (data: {
    amount: number
    merchantName: string
    date: Date
    items?: string[]
    confidence: number
  }) => void
}

export function ReceiptOCRSimulator({ file, onDataExtracted }: ReceiptOCRSimulatorProps) {
  const [processing, setProcessing] = useState(false)
  const [extracted, setExtracted] = useState(false)

  const simulateOCR = async () => {
    setProcessing(true)

    // Simulate OCR processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate extracted data based on filename or random values
    const mockData = {
      amount: Math.floor(Math.random() * 500) + 50,
      merchantName: getMerchantName(file.name),
      date: new Date(),
      items: getRandomItems(),
      confidence: 0.85 + Math.random() * 0.1,
    }

    setExtracted(true)
    setProcessing(false)
    onDataExtracted(mockData)
  }

  const getMerchantName = (filename: string): string => {
    const merchants = [
      "Whole Foods",
      "Target",
      "Walmart",
      "Costco",
      "Safeway",
      "CVS Pharmacy",
      "Shell Gas Station",
      "Starbucks",
      "McDonald's",
      "Amazon",
    ]

    // Try to extract from filename
    const lower = filename.toLowerCase()
    for (const merchant of merchants) {
      if (lower.includes(merchant.toLowerCase().replace(/\s+/g, ""))) {
        return merchant
      }
    }

    // Return random merchant
    return merchants[Math.floor(Math.random() * merchants.length)]
  }

  const getRandomItems = (): string[] => {
    const allItems = [
      "Organic Apples",
      "Bread",
      "Milk",
      "Eggs",
      "Chicken Breast",
      "Pasta",
      "Tomato Sauce",
      "Coffee",
      "Orange Juice",
      "Bananas",
    ]

    const count = Math.floor(Math.random() * 5) + 2
    return allItems.sort(() => 0.5 - Math.random()).slice(0, count)
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Receipt Processing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600 dark:text-slate-400">File:</span>
          <span className="font-medium text-slate-900 dark:text-white truncate">{file.name}</span>
        </div>

        {!extracted && !processing && (
          <Button onClick={simulateOCR} className="w-full bg-blue-500 hover:bg-blue-600" size="sm">
            Extract Data from Receipt
          </Button>
        )}

        {processing && (
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Scanning receipt and extracting data...</span>
          </div>
        )}

        {extracted && (
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Data extracted successfully!</span>
            <Badge variant="secondary" className="text-xs">
              85%+ confidence
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
