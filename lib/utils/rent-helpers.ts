import { differenceInDays, addDays, format } from "date-fns"
import type { Expense } from "@/lib/firebase/firestore"

export function calculateRentPeriod(paymentDate: Date, startDate: Date, endDate: Date) {
  const totalDays = differenceInDays(endDate, startDate) + 1
  const totalWeeks = totalDays / 7

  return {
    totalDays,
    totalWeeks: Number.parseFloat(totalWeeks.toFixed(2)),
    isExtended: totalDays > 35,
  }
}

export function calculateRentAmount(weeklyRate: number, totalWeeks: number) {
  return Number.parseFloat((weeklyRate * totalWeeks).toFixed(2))
}

export function suggestRentPeriod(paymentDate: Date, lastRentExpense?: Expense) {
  if (lastRentExpense?.paymentDetails?.rentPeriod) {
    // Suggest period starting one day after previous rent period ended
    const previousEndDate = lastRentExpense.paymentDetails.rentPeriod.endDate
    const suggestedStart = addDays(previousEndDate, 1)
    const suggestedEnd = addDays(paymentDate, -1)

    return {
      startDate: suggestedStart,
      endDate: suggestedEnd,
      isSequential: true,
    }
  }

  // Default: suggest 30 days before payment date
  return {
    startDate: addDays(paymentDate, -30),
    endDate: addDays(paymentDate, -1),
    isSequential: false,
  }
}

export function validateRentData(data: {
  paymentDate: Date
  startDate: Date
  endDate: Date
  weeklyRate: number
  savedRate?: number
}) {
  const errors: string[] = []
  const warnings: string[] = []

  // Date validation
  if (data.startDate >= data.paymentDate) {
    warnings.push("Payment date should typically be after the rent period")
  }

  if (data.endDate < data.startDate) {
    errors.push("End date must be after start date")
  }

  // Period validation
  const totalDays = differenceInDays(data.endDate, data.startDate) + 1
  if (totalDays > 35) {
    warnings.push(`Extended rent period detected: ${totalDays} days`)
  }

  if (totalDays < 1) {
    errors.push("Rent period must be at least 1 day")
  }

  // Rate validation
  if (data.weeklyRate <= 0) {
    errors.push("Weekly rate must be greater than 0")
  }

  if (data.savedRate && data.weeklyRate > data.savedRate * 2) {
    warnings.push(
      `Rate increased from $${data.savedRate} to $${data.weeklyRate}. This is more than double the previous rate.`,
    )
  }

  return { errors, warnings, isValid: errors.length === 0 }
}

export function formatRentPeriod(startDate: Date, endDate: Date) {
  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`
}

export function getRentInsights(rentExpenses: Expense[]) {
  if (rentExpenses.length === 0) {
    return {
      hasData: false,
      insights: [],
    }
  }

  const insights: string[] = []
  const sortedExpenses = [...rentExpenses].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Calculate statistics
  const totalPaid = rentExpenses.reduce((sum, e) => sum + e.amount, 0)
  const averageRent = totalPaid / rentExpenses.length
  const lastRent = sortedExpenses[0]
  const previousRent = sortedExpenses[1]

  // Trend analysis
  if (previousRent) {
    const trend = ((lastRent.amount - previousRent.amount) / previousRent.amount) * 100
    if (trend > 5) {
      insights.push(`Your rent increased by ${trend.toFixed(1)}% from the previous payment`)
    } else if (trend < -5) {
      insights.push(`You saved ${Math.abs(trend).toFixed(1)}% on your last rent payment`)
    } else {
      insights.push("Your rent has remained stable")
    }
  }

  // Payment consistency
  const weeklyRates = rentExpenses.filter((e) => e.paymentDetails?.weeklyRate).map((e) => e.paymentDetails!.weeklyRate!)

  if (weeklyRates.length >= 3) {
    const rateVariance = Math.max(...weeklyRates) - Math.min(...weeklyRates)
    if (rateVariance < 5) {
      insights.push("Your weekly rent rate has been very consistent")
    } else {
      insights.push(`Your weekly rate varies by up to $${rateVariance.toFixed(2)}`)
    }
  }

  // Budget impact (assuming 30% rule for housing)
  const monthlyIncome = 5000 // This would come from actual income data
  const rentToIncomeRatio = (averageRent / monthlyIncome) * 100

  if (rentToIncomeRatio <= 30) {
    insights.push(`Your rent is ${rentToIncomeRatio.toFixed(0)}% of income - within recommended 30% range`)
  } else {
    insights.push(`Your rent is ${rentToIncomeRatio.toFixed(0)}% of income - consider ways to reduce housing costs`)
  }

  // Payment timing
  const totalWeeks = rentExpenses.reduce((sum, e) => sum + (e.paymentDetails?.rentPeriod?.totalWeeks || 0), 0)
  const avgWeeksPerPayment = totalWeeks / rentExpenses.length

  if (avgWeeksPerPayment >= 4) {
    insights.push("You typically pay rent monthly, which helps with budgeting")
  } else if (avgWeeksPerPayment <= 1.5) {
    insights.push("You pay rent weekly - consider if monthly payments would simplify budgeting")
  }

  return {
    hasData: true,
    insights,
    stats: {
      totalPaid,
      averageRent,
      rentToIncomeRatio,
      paymentsCount: rentExpenses.length,
    },
  }
}
