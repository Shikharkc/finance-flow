"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { UploadReceiptDialog } from "@/components/receipts/upload-receipt-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Loader2, Search, FileImage, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock receipt data
const mockReceipts = [
  {
    id: "1",
    merchant: "Whole Foods Market",
    amount: 127.5,
    date: new Date("2024-01-15"),
    category: "Groceries",
    imageUrl: "/paper-receipt.png",
    items: 8,
  },
  {
    id: "2",
    merchant: "Shell Gas Station",
    amount: 45.0,
    date: new Date("2024-01-14"),
    category: "Transportation",
    imageUrl: "/gas-receipt.jpg",
    items: 1,
  },
  {
    id: "3",
    merchant: "Amazon",
    amount: 89.99,
    date: new Date("2024-01-12"),
    category: "Shopping",
    imageUrl: "/amazon-receipt.jpg",
    items: 3,
  },
]

export default function ReceiptsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!user) return null

  const filteredReceipts = mockReceipts.filter(
    (receipt) =>
      receipt.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Receipts</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage and organize your receipt documents</p>
            </div>
            <Button onClick={() => setShowUploadDialog(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
              <Plus className="h-4 w-4" />
              Upload Receipt
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search receipts by merchant or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {filteredReceipts.length === 0 ? (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="py-16 text-center">
                <FileImage className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No receipts found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Start uploading receipts to track your expenses
                </p>
                <Button onClick={() => setShowUploadDialog(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="h-4 w-4" />
                  Upload Your First Receipt
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredReceipts.map((receipt) => (
                <Card
                  key={receipt.id}
                  className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={receipt.imageUrl || "/placeholder.svg"}
                        alt={receipt.merchant}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                          {receipt.merchant}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>{receipt.date.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {receipt.category}
                        </Badge>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{receipt.items} items</span>
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        ${receipt.amount.toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <UploadReceiptDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onSuccess={(data) => console.log("Receipt data:", data)}
        />
      </main>
    </div>
  )
}
