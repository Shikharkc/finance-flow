"use client"

import { Button } from "@/components/ui/button"
import { Plus, Mic, Receipt } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface QuickActionsProps {
  onAddExpense: () => void
  onAddIncome: () => void
  onScanReceipt: () => void
  onVoiceInput: () => void
}

export function QuickActions({ onAddExpense, onAddIncome, onScanReceipt, onVoiceInput }: QuickActionsProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-2xl shadow-emerald-500/50"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={onAddExpense} className="flex items-center gap-3 p-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <Plus className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="font-semibold">Add Expense</div>
              <div className="text-xs text-muted-foreground">Quick expense entry</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddIncome} className="flex items-center gap-3 p-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold">Add Income</div>
              <div className="text-xs text-muted-foreground">Record income</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onScanReceipt} className="flex items-center gap-3 p-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-semibold">Scan Receipt</div>
              <div className="text-xs text-muted-foreground">Camera capture</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onVoiceInput} className="flex items-center gap-3 p-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Mic className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-semibold">Voice Input</div>
              <div className="text-xs text-muted-foreground">Speak to add</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
