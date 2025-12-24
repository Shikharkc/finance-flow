"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/context"
import { TrendingUp, Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 animate-pulse">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading ExpenseTracker...</p>
      </div>
    </div>
  )
}
