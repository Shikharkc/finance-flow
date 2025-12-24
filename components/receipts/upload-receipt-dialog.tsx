"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Camera, Upload, Loader2, FileImage } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadReceiptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (receiptData: any) => void
}

export function UploadReceiptDialog({ open, onOpenChange, onSuccess }: UploadReceiptDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setLoading(true)
    try {
      // Simulate OCR processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock OCR result
      const ocrData = {
        amount: 127.5,
        merchant: "Whole Foods Market",
        date: new Date(),
        category: "groceries",
        items: ["Organic Bananas", "Greek Yogurt", "Almond Milk", "Fresh Spinach"],
      }

      toast({
        title: "Receipt processed",
        description: "Data extracted successfully. Review and save the expense.",
      })

      onSuccess?.(ocrData)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process receipt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upload Receipt</DialogTitle>
          <DialogDescription>Scan or upload a receipt for automatic data extraction</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {!preview ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center">
                <FileImage className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Upload your receipt</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Take a photo or upload an image for automatic data extraction
                </p>
                <div className="flex gap-3 justify-center">
                  <Label htmlFor="camera" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </div>
                    <input
                      id="camera"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </Label>
                  <Label htmlFor="file" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium">
                      <Upload className="h-4 w-4" />
                      Upload File
                    </div>
                    <input id="file" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </Label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Receipt preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPreview(null)
                    setSelectedFile(null)
                  }}
                  className="flex-1"
                >
                  Change Image
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={loading}
                  className="flex-1 gap-2 bg-emerald-500 hover:bg-emerald-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Process Receipt
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
