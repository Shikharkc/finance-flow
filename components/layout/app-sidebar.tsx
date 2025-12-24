"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  Wallet,
  BarChart3,
  Receipt,
  Settings,
  HelpCircle,
  LogOut,
  TrendingUpIcon,
  Wrench,
  Home,
  Send,
  LineChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/context"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenses", href: "/expenses", icon: TrendingDown },
  { name: "Income", href: "/income", icon: TrendingUp },
  { name: "Budgets", href: "/budgets", icon: Wallet },
  { name: "Room Rent", href: "/rent", icon: Home },
  { name: "Remittance", href: "/remittance", icon: Send },
  { name: "Analytics", href: "/analytics", icon: LineChart },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Receipts", href: "/receipts", icon: Receipt },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Setup Guide", href: "/setup", icon: Wrench },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
          <TrendingUpIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">ExpenseTracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Smart Finance</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="mb-4 rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.displayName || "User"}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="w-full justify-start gap-3 bg-transparent">
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
