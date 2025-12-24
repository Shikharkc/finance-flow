"use client"

// AI-powered automatic categorization based on merchant and description
export interface CategoryRule {
  keywords: string[]
  category: string
  subcategory?: string
  confidence: number
}

const categoryRules: CategoryRule[] = [
  // Housing
  {
    keywords: ["rent", "landlord", "lease", "apartment", "housing"],
    category: "Housing",
    subcategory: "Rent",
    confidence: 0.95,
  },
  {
    keywords: ["insurance", "renters insurance", "home insurance"],
    category: "Housing",
    subcategory: "Insurance",
    confidence: 0.9,
  },

  // Food & Dining
  {
    keywords: ["starbucks", "coffee", "cafe", "dunkin", "peet's", "dutch bros", "tim hortons", "caribou coffee"],
    category: "Food",
    subcategory: "Coffee",
    confidence: 0.95,
  },
  {
    keywords: ["whole foods", "trader joe's", "safeway", "kroger", "albertsons", "grocery", "supermarket", "market"],
    category: "Food",
    subcategory: "Groceries",
    confidence: 0.9,
  },
  {
    keywords: [
      "restaurant",
      "dining",
      "chipotle",
      "mcdonald's",
      "burger king",
      "taco bell",
      "subway",
      "panera",
      "chick-fil-a",
    ],
    category: "Food",
    subcategory: "Restaurants",
    confidence: 0.85,
  },

  // Transportation
  {
    keywords: ["uber", "lyft", "taxi", "cab", "rideshare"],
    category: "Transportation",
    subcategory: "Rideshare",
    confidence: 0.95,
  },
  {
    keywords: ["shell", "chevron", "exxon", "mobil", "bp", "gas", "fuel", "gasoline", "petrol"],
    category: "Transportation",
    subcategory: "Gas",
    confidence: 0.9,
  },
  {
    keywords: ["parking", "park", "garage"],
    category: "Transportation",
    subcategory: "Parking",
    confidence: 0.85,
  },

  // Entertainment
  {
    keywords: ["netflix", "hulu", "disney+", "amazon prime", "hbo", "spotify", "apple music", "streaming"],
    category: "Entertainment",
    subcategory: "Subscriptions",
    confidence: 0.95,
  },
  {
    keywords: ["cinema", "movie", "theater", "theatre", "amc", "regal"],
    category: "Entertainment",
    subcategory: "Movies",
    confidence: 0.9,
  },

  // Utilities
  {
    keywords: ["electric", "electricity", "power", "pge", "utility"],
    category: "Utilities",
    subcategory: "Electric",
    confidence: 0.9,
  },
  {
    keywords: ["internet", "comcast", "xfinity", "at&t", "verizon", "spectrum"],
    category: "Utilities",
    subcategory: "Internet",
    confidence: 0.9,
  },
  {
    keywords: ["phone", "mobile", "t-mobile", "sprint", "wireless"],
    category: "Utilities",
    subcategory: "Phone",
    confidence: 0.85,
  },

  // Shopping
  {
    keywords: ["amazon", "ebay", "target", "walmart", "costco", "best buy"],
    category: "Shopping",
    subcategory: "Online Shopping",
    confidence: 0.8,
  },
]

export function autoCategorizExpense(
  description: string,
  amount: number,
): {
  category: string
  subcategory?: string
  confidence: number
} {
  const lowerDesc = description.toLowerCase()

  // Find best matching rule
  let bestMatch: CategoryRule | null = null
  let bestScore = 0

  for (const rule of categoryRules) {
    for (const keyword of rule.keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        const score = rule.confidence * (keyword.length / description.length)
        if (score > bestScore) {
          bestScore = score
          bestMatch = rule
        }
      }
    }
  }

  if (bestMatch && bestScore > 0.3) {
    return {
      category: bestMatch.category,
      subcategory: bestMatch.subcategory,
      confidence: Math.min(bestScore, 1),
    }
  }

  // Default fallback
  return {
    category: "Other",
    confidence: 0.1,
  }
}

export function learnFromUserCorrection(
  description: string,
  originalCategory: string,
  correctedCategory: string,
  correctedSubcategory?: string,
) {
  // In a real app, this would store the correction and improve future predictions
  console.log("Learning from correction:", {
    description,
    from: originalCategory,
    to: correctedCategory,
    subcategory: correctedSubcategory,
  })
}
