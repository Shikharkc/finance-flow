"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Tag, Download, X } from "lucide-react"

interface BulkActionsProps {
  selectedCount: number
  onDelete: () => void
  onCategorize: () => void
  onExport: () => void
  onClear: () => void
}

export function BulkActions({ selectedCount, onDelete, onCategorize, onExport, onClear }: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
            </span>
            <div className="h-4 w-px bg-emerald-300 dark:bg-emerald-700" />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onCategorize} className="gap-2 bg-transparent">
                <Tag className="h-4 w-4" />
                Categorize
              </Button>
              <Button variant="outline" size="sm" onClick={onExport} className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="gap-2 text-red-600 dark:text-red-400 bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-2">
            <X className="h-4 w-4" />
            Clear Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
