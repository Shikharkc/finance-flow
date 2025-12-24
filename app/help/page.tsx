"use client"

import { Suspense, useEffect } from "react"
import { useAuth } from "@/lib/firebase/context"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Book, Video, MessageCircle, Mail, FileText } from "lucide-react"

const helpCategories = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn the basics of ExpenseTracker",
    articles: 12,
    color: "emerald",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    articles: 8,
    color: "blue",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Comprehensive feature documentation",
    articles: 24,
    color: "purple",
  },
  {
    icon: MessageCircle,
    title: "FAQs",
    description: "Frequently asked questions",
    articles: 35,
    color: "amber",
  },
]

function HelpContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

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

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Help Center</h1>
            <p className="text-slate-600 dark:text-slate-400">Find answers and get support</p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for help articles, tutorials, and FAQs..."
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {helpCategories.map((category, index) => (
              <Card
                key={index}
                className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full bg-${category.color}-100 dark:bg-${category.color}-900/30`}
                    >
                      <category.icon className={`h-7 w-7 text-${category.color}-600 dark:text-${category.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{category.articles} articles available</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl">Need More Help?</CardTitle>
              <CardDescription>Our support team is here to assist you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 justify-start gap-4 bg-transparent">
                  <Mail className="h-6 w-6 text-emerald-500" />
                  <div className="text-left">
                    <div className="font-semibold">Email Support</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">support@expensetracker.com</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4 justify-start gap-4 bg-transparent">
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                  <div className="text-left">
                    <div className="font-semibold">Live Chat</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Available 24/7</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function HelpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <HelpContent />
    </Suspense>
  )
}
