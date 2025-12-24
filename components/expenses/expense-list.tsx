"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { format } from "date-fns"
import type { Expense } from "@/lib/firebase/firestore"
import { Badge } from "@/components/ui/badge"

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
  onSelectionChange?: (selected: string[]) => void
}

const categoryIcons: Record<string, string> = {
  housing: "🏠",
  house_expenses: "🏠",
  food: "🍔",
  groceries: "🛒",
  transportation: "🚗",
  utilities: "⚡",
  entertainment: "🎬",
  healthcare: "🏥",
  shopping: "🛍️",
  education: "📚",
  other: "📋",
}

export function ExpenseList({ expenses, onEdit, onDelete, onSelectionChange }: ExpenseListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(expenses.map((e) => e.id!))
      setSelectedIds(allIds)
      onSelectionChange?.(Array.from(allIds))
    } else {
      setSelectedIds(new Set())
      onSelectionChange?.([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
    onSelectionChange?.(Array.from(newSelected))
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const getStatusDisplay = (status?: string) => {
    switch (status) {
      case "paid":
        return { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-500", label: "Paid" }
      case "unpaid":
        return { icon: <XCircle className="h-4 w-4" />, color: "text-rose-500", label: "Unpaid" }
      case "partial":
        return { icon: <Clock className="h-4 w-4" />, color: "text-amber-500", label: "Partial" }
      case "overdue":
        return { icon: <AlertCircle className="h-4 w-4" />, color: "text-red-600", label: "Overdue" }
      default:
        return null
    }
  }

  if (expenses.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="py-16 text-center">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No expenses yet</h3>
          <p className="text-slate-600 dark:text-slate-400">Start tracking your expenses by adding your first one</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-4">
        <Checkbox
          checked={selectedIds.size === expenses.length && expenses.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all"}
        </span>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => {
          const isRoomRent = expense.subcategory === "Room Rent"
          const isExpanded = expandedIds.has(expense.id!)
          const statusDisplay = expense.paymentDetails?.status ? getStatusDisplay(expense.paymentDetails.status) : null

          return (
            <Card key={expense.id} className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedIds.has(expense.id!)}
                    onCheckedChange={(checked) => handleSelectOne(expense.id!, checked as boolean)}
                  />

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-2xl flex-shrink-0">
                    {categoryIcons[expense.category] || "📋"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                        {expense.description}
                      </h3>
                      {expense.subcategory && (
                        <Badge variant="outline" className="text-xs">
                          {expense.subcategory}
                        </Badge>
                      )}
                      {expense.recurring && (
                        <Badge variant="secondary" className="text-xs">
                          Recurring
                        </Badge>
                      )}
                      {statusDisplay && (
                        <Badge variant="outline" className={`text-xs ${statusDisplay.color} border-current`}>
                          <span className="mr-1">{statusDisplay.icon}</span>
                          {statusDisplay.label}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="capitalize">{expense.category.replace("_", " ")}</span>
                      <span>•</span>
                      <span>{format(expense.date, "MMM dd, yyyy")}</span>
                      {expense.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {expense.location}
                          </span>
                        </>
                      )}
                      {isRoomRent && expense.paymentDetails?.rentPeriod && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {expense.paymentDetails.rentPeriod.totalWeeks.toFixed(1)} weeks
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      -${expense.amount.toLocaleString()}
                    </div>
                    {expense.paymentMethod && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {expense.paymentMethod.replace("_", " ")}
                      </div>
                    )}
                    {isRoomRent && expense.paymentDetails?.weeklyRate && (
                      <div className="text-xs text-emerald-600 dark:text-emerald-500">
                        ${expense.paymentDetails.weeklyRate}/week
                      </div>
                    )}
                  </div>

                  {isRoomRent && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpanded(expense.id!)}
                      className="flex-shrink-0"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(expense)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(expense)}
                        className="text-red-600 dark:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {isRoomRent && isExpanded && expense.paymentDetails && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    {/* Rent Period Details */}
                    {expense.paymentDetails.rentPeriod && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3">
                        <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 mb-2">
                          Rent Period Details
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-slate-600 dark:text-slate-400">Start Date</div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {format(expense.paymentDetails.rentPeriod.startDate, "MMM dd, yyyy")}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600 dark:text-slate-400">End Date</div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {format(expense.paymentDetails.rentPeriod.endDate, "MMM dd, yyyy")}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600 dark:text-slate-400">Total Days</div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {expense.paymentDetails.rentPeriod.totalDays} days
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600 dark:text-slate-400">Total Weeks</div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {expense.paymentDetails.rentPeriod.totalWeeks.toFixed(2)} weeks
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Calculation */}
                    {expense.paymentDetails.weeklyRate && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                        <div className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                          Payment Calculation
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-slate-600 dark:text-slate-400">Weekly Rate</div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              ${expense.paymentDetails.weeklyRate}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-600 dark:text-slate-400">Calculated Amount</div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              ${expense.paymentDetails.calculatedAmount?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    {(expense.paymentDetails.landlordName || expense.paymentDetails.roomDetails) && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {expense.paymentDetails.landlordName && (
                          <div>
                            <div className="text-slate-600 dark:text-slate-400 text-xs">Landlord</div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {expense.paymentDetails.landlordName}
                            </div>
                          </div>
                        )}
                        {expense.paymentDetails.roomDetails && (
                          <div>
                            <div className="text-slate-600 dark:text-slate-400 text-xs">Room Details</div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {expense.paymentDetails.roomDetails}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* File Attachments */}
                    {expense.files && expense.files.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                          Attachments ({expense.files.length})
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {expense.files.map((file, idx) => (
                            <a
                              key={idx}
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border border-slate-200 dark:border-slate-700 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {file.fileType.startsWith("image/") ? (
                                  <ImageIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                                ) : (
                                  <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium truncate">{file.fileName}</div>
                                  <div className="text-xs text-slate-500">{(file.fileSize / 1024).toFixed(1)} KB</div>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
