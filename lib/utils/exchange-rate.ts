"use client"

// Exchange rate utilities for USD to NPR conversion
export interface ExchangeRate {
  currency: string
  buy: number
  sell: number
  date: string
}

export interface ExchangeRateData {
  usd: ExchangeRate
  lastUpdated: Date
}

// Cache exchange rate for 1 hour
let exchangeRateCache: { data: ExchangeRateData; timestamp: number } | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export async function getUSDToNPRRate(): Promise<ExchangeRateData> {
  // Check cache first
  if (exchangeRateCache && Date.now() - exchangeRateCache.timestamp < CACHE_DURATION) {
    return exchangeRateCache.data
  }

  try {
    // Get today's date in Y-m-d format
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    // Try Nepal Rastra Bank API
    const response = await fetch(
      `https://www.nrb.org.np/api/forex/v1/rates?from=${yesterday}&to=${today}&per_page=10&page=1`,
    )

    if (response.ok) {
      const data = await response.json()
      if (data.data?.payload && data.data.payload.length > 0) {
        const latestRates = data.data.payload[0]
        const usdRate = latestRates.rates.find((r: any) => r.currency.iso3 === "USD")

        if (usdRate) {
          const exchangeData: ExchangeRateData = {
            usd: {
              currency: "USD",
              buy: Number.parseFloat(usdRate.buy),
              sell: Number.parseFloat(usdRate.sell),
              date: latestRates.date,
            },
            lastUpdated: new Date(),
          }

          // Update cache
          exchangeRateCache = {
            data: exchangeData,
            timestamp: Date.now(),
          }

          return exchangeData
        }
      }
    }
  } catch (error) {
    console.error("Error fetching exchange rate from NRB:", error)
  }

  // Fallback to approximate rate
  const fallbackData: ExchangeRateData = {
    usd: {
      currency: "USD",
      buy: 132.5,
      sell: 133.1,
      date: new Date().toISOString().split("T")[0],
    },
    lastUpdated: new Date(),
  }

  exchangeRateCache = {
    data: fallbackData,
    timestamp: Date.now(),
  }

  return fallbackData
}

export function convertUSDToNPR(usdAmount: number, rate: number): number {
  return Math.round(usdAmount * rate * 100) / 100
}

export function convertNPRToUSD(nprAmount: number, rate: number): number {
  return Math.round((nprAmount / rate) * 100) / 100
}

export function formatCurrency(amount: number, currency: "USD" | "NPR"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  } else {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
    }).format(amount)
  }
}

export function getTransferFee(method: string, amount: number): number {
  switch (method) {
    case "western-union":
      return amount < 100 ? 5 : amount < 500 ? 10 : 15
    case "moneygram":
      return amount < 100 ? 4.5 : amount < 500 ? 9.5 : 14
    case "bank-transfer":
      return 25
    case "crypto":
      return amount * 0.01 // 1% fee
    default:
      return 0
  }
}

export function getExpectedDeliveryDate(method: string): Date {
  const deliveryDays = {
    "western-union": 1,
    moneygram: 1,
    "bank-transfer": 3,
    crypto: 0.5,
    other: 2,
  }

  const days = deliveryDays[method as keyof typeof deliveryDays] || 2
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + Math.ceil(days))
  return deliveryDate
}
