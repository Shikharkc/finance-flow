import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  type QueryConstraint,
} from "firebase/firestore"
import { db } from "./config"

export interface Expense {
  id?: string
  userId: string
  amount: number
  category: string
  subcategory?: string
  description: string
  date: Date
  paymentMethod?: string
  receiptUrl?: string
  location?: string
  recurring?: boolean
  tags?: string[]

  // Enhanced payment details for Room Rent and other categories
  paymentDetails?: {
    paymentDate?: Date
    status?: "paid" | "unpaid" | "partial" | "overdue"
    actualAmount?: number

    // Room Rent specific fields
    rentPeriod?: {
      startDate: Date
      endDate: Date
      totalDays: number
      totalWeeks: number
    }
    weeklyRate?: number
    calculatedAmount?: number
    landlordName?: string
    roomDetails?: string
  }

  // File attachments
  files?: Array<{
    fileId: string
    fileName: string
    fileUrl: string
    fileType: string
    fileSize: number
    uploadDate: Date
    documentType: "receipt" | "invoice" | "contract" | "photo" | "other"
    ocrText?: string
  }>

  // Automation metadata
  automation?: {
    isRecurring: boolean
    recurrencePattern?: string
    autoCalculate: boolean
    savedRateUsed: boolean
  }

  timestamps?: {
    dueDate?: Date
    reminderDate?: Date
  }

  createdAt: Date
  updatedAt: Date
}

export interface Income {
  id?: string
  userId: string
  amount: number
  source: string
  type: string
  description: string
  date: Date
  recurring?: boolean
  frequency?: "weekly" | "bi-weekly" | "monthly" | "quarterly" | "annual"
  createdAt: Date
  updatedAt: Date
}

export interface Budget {
  id?: string
  userId: string
  category: string
  amount: number
  spent: number
  period: "monthly" | "weekly" | "annual"
  color: string
  icon: string
  rollover: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id?: string
  userId: string
  displayName?: string
  email?: string
  rentalSettings?: {
    weeklyRate: number
    monthlyRate?: number
    currentLandlord?: {
      name: string
      phone?: string
      email?: string
    }
    roomDetails?: string
    leaseStart?: Date
    leaseEnd?: Date
    paymentDueDay?: number
    preferredMethod?: string
    rateHistory?: Array<{
      rate: number
      effectiveDate: Date
    }>
  }
  expenseRules?: {
    autoCategorize: boolean
    saveFrequentMerchants: boolean
    remindOverdue: boolean
    autoBackupReceipts: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface FamilyRecipient {
  id?: string
  userId: string
  name: string
  relationship: string
  phone?: string
  email?: string
  address?: {
    street?: string
    city?: string
    country: string
  }
  bankDetails?: {
    accountName?: string
    accountNumber?: string
    bankName?: string
    swiftCode?: string
  }
  preferredMethod?: "western-union" | "moneygram" | "bank-transfer" | "crypto" | "other"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface FamilyRemittance {
  id?: string
  userId: string
  recipientId: string
  recipientName: string
  amount: number
  currency: "USD"
  exchangeRate: number
  localAmount: number
  localCurrency: "NPR"
  transferMethod: "western-union" | "moneygram" | "bank-transfer" | "crypto" | "other"
  transferFee: number
  totalCost: number
  purpose: "medical" | "education" | "living" | "emergency" | "gift" | "other"
  deliveryOption: "cash-pickup" | "bank-deposit" | "mobile-wallet" | "home-delivery"
  status: "pending" | "in-transit" | "completed" | "failed" | "cancelled"
  transferReference?: string
  expectedDelivery?: Date
  actualDelivery?: Date
  receiptUrl?: string
  notes?: string
  reminderSet?: boolean
  isRecurring?: boolean
  recurringPattern?: "weekly" | "bi-weekly" | "monthly" | "quarterly"
  date: Date
  createdAt: Date
  updatedAt: Date
}

// Expense operations
export async function addExpense(expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) {
  const data: any = {
    ...expense,
    date: Timestamp.fromDate(expense.date),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  // Convert date fields in paymentDetails
  if (expense.paymentDetails) {
    data.paymentDetails = { ...expense.paymentDetails }
    if (expense.paymentDetails.paymentDate) {
      data.paymentDetails.paymentDate = Timestamp.fromDate(expense.paymentDetails.paymentDate)
    }
    if (expense.paymentDetails.rentPeriod) {
      data.paymentDetails.rentPeriod = {
        ...expense.paymentDetails.rentPeriod,
        startDate: Timestamp.fromDate(expense.paymentDetails.rentPeriod.startDate),
        endDate: Timestamp.fromDate(expense.paymentDetails.rentPeriod.endDate),
      }
    }
  }

  // Convert file upload dates
  if (expense.files) {
    data.files = expense.files.map((file) => ({
      ...file,
      uploadDate: Timestamp.fromDate(file.uploadDate),
    }))
  }

  // Convert timestamp fields
  if (expense.timestamps) {
    data.timestamps = { ...expense.timestamps }
    if (expense.timestamps.dueDate) {
      data.timestamps.dueDate = Timestamp.fromDate(expense.timestamps.dueDate)
    }
    if (expense.timestamps.reminderDate) {
      data.timestamps.reminderDate = Timestamp.fromDate(expense.timestamps.reminderDate)
    }
  }

  const docRef = await addDoc(collection(db, "expenses"), data)
  return docRef.id
}

export async function updateExpense(id: string, expense: Partial<Expense>) {
  const docRef = doc(db, "expenses", id)
  await updateDoc(docRef, {
    ...expense,
    ...(expense.date && { date: Timestamp.fromDate(expense.date) }),
    ...(expense.paymentDetails?.paymentDate && { paymentDetails: { ...expense.paymentDetails, paymentDate: Timestamp.fromDate(expense.paymentDetails.paymentDate) } }),\
    ...(expense.paymentDetails?.rentPeriod && { paymentDetails: { ...expense.paymentDetails, rentPeriod: { ...expense.paymentDetails.rentPeriod, startDate: Timestamp.fromDate(expense.paymentDetails.rentPeriod.startDate), endDate: Timestamp.fromDate(expense.paymentDetails.rentPeriod.endDate) } }),
    ...(expense.files && { files: expense.files.map(file => ({ ...file, uploadDate: Timestamp.fromDate(file.uploadDate) })) }),
    ...(expense.timestamps?.dueDate && { timestamps: { ...expense.timestamps, dueDate: Timestamp.fromDate(expense.timestamps.dueDate) } }),
    ...(expense.timestamps?.reminderDate && { timestamps: { ...expense.timestamps, reminderDate: Timestamp.fromDate(expense.timestamps.reminderDate) } }),
    updatedAt: Timestamp.now(),
  })
}
\
export async function deleteExpense(id: string) {
  await deleteDoc(doc(db, "expenses", id))
}

export async function getExpenses(userId: string, constraints: QueryConstraint[] = []) {
  const q = query(collection(db, "expenses"), where("userId", "==", userId), orderBy("date", "desc"), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    const expense: any = {
      id: doc.id,
      ...data,
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    }
    
    // Convert paymentDetails dates
    if (data.paymentDetails) {
      expense.paymentDetails = { ...data.paymentDetails }
      if (data.paymentDetails.paymentDate) {
        expense.paymentDetails.paymentDate = data.paymentDetails.paymentDate.toDate()
      }
      if (data.paymentDetails.rentPeriod) {
        expense.paymentDetails.rentPeriod = {
          ...data.paymentDetails.rentPeriod,
          startDate: data.paymentDetails.rentPeriod.startDate.toDate(),
          endDate: data.paymentDetails.rentPeriod.endDate.toDate(),
        }
      }
    }
    
    // Convert file dates
    if (data.files) {
      expense.files = data.files.map((file: any) => ({
        ...file,
        uploadDate: file.uploadDate.toDate(),
      }))
    }
    
    // Convert timestamp fields
    if (data.timestamps) {
      expense.timestamps = { ...data.timestamps }
      if (data.timestamps.dueDate) {
        expense.timestamps.dueDate = data.timestamps.dueDate.toDate()
      }
      if (data.timestamps.reminderDate) {
        expense.timestamps.reminderDate = data.timestamps.reminderDate.toDate()
      }
    }
    
    return expense as Expense
  })
}

// Income operations
export async function addIncome(income: Omit<Income, "id" | "createdAt" | "updatedAt">) {
  const docRef = await addDoc(collection(db, "income"), {
    ...income,
    date: Timestamp.fromDate(income.date),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateIncome(id: string, income: Partial<Income>) {
  const docRef = doc(db, "income", id)
  await updateDoc(docRef, {
    ...income,
    ...(income.date && { date: Timestamp.fromDate(income.date) }),
    updatedAt: Timestamp.now(),
  })
}

export async function deleteIncome(id: string) {
  await deleteDoc(doc(db, "income", id))
}

export async function getIncome(userId: string, constraints: QueryConstraint[] = []) {
  const q = query(collection(db, "income"), where("userId", "==", userId), orderBy("date", "desc"), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Income
  })
}

// Budget operations
export async function addBudget(budget: Omit<Budget, "id" | "createdAt" | "updatedAt">) {
  const docRef = await addDoc(collection(db, "budgets"), {
    ...budget,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateBudget(id: string, budget: Partial<Budget>) {
  const docRef = doc(db, "budgets", id)
  await updateDoc(docRef, {
    ...budget,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteBudget(id: string) {
  await deleteDoc(doc(db, "budgets", id))
}

export async function getBudgets(userId: string) {
  const q = query(collection(db, "budgets"), where("userId", "==", userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Budget
  })
}

// Real-time listeners
export function subscribeToExpenses(
  userId: string,
  callback: (expenses: Expense[]) => void,
  constraints: QueryConstraint[] = [],
) {
  const q = query(collection(db, "expenses"), where("userId", "==", userId), orderBy("date", "desc"), ...constraints)
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map((doc) => {
      const data = doc.data()
      const expense: any = {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      }
      
      // Convert paymentDetails dates
      if (data.paymentDetails) {
        expense.paymentDetails = { ...data.paymentDetails }
        if (data.paymentDetails.paymentDate) {
          expense.paymentDetails.paymentDate = data.paymentDetails.paymentDate.toDate()
        }
        if (data.paymentDetails.rentPeriod) {
          expense.paymentDetails.rentPeriod = {
            ...data.paymentDetails.rentPeriod,
            startDate: data.paymentDetails.rentPeriod.startDate.toDate(),
            endDate: data.paymentDetails.rentPeriod.endDate.toDate(),
          }
        }
      }
      
      // Convert file dates
      if (data.files) {
        expense.files = data.files.map((file: any) => ({
          ...file,
          uploadDate: file.uploadDate.toDate(),
        }))
      }
      
      // Convert timestamp fields
      if (data.timestamps) {
        expense.timestamps = { ...data.timestamps }
        if (data.timestamps.dueDate) {
          expense.timestamps.dueDate = data.timestamps.dueDate.toDate()
        }
        if (data.timestamps.reminderDate) {
          expense.timestamps.reminderDate = data.timestamps.reminderDate.toDate()
        }
      }
      
      return expense as Expense
    })
    callback(expenses)
  })
}

export function subscribeToIncome(
  userId: string,
  callback: (income: Income[]) => void,
  constraints: QueryConstraint[] = [],
) {
  const q = query(collection(db, "income"), where("userId", "==", userId), orderBy("date", "desc"), ...constraints)
  return onSnapshot(q, (snapshot) => {
    const income = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Income
    })
    callback(income)
  })
}

export function subscribeToBudgets(userId: string, callback: (budgets: Budget[]) => void) {
  const q = query(collection(db, "budgets"), where("userId", "==", userId))
  return onSnapshot(q, (snapshot) => {
    const budgets = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Budget
    })
    callback(budgets)
  })
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const q = query(collection(db, "userProfiles"), where("userId", "==", userId))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  
  const doc = snapshot.docs[0]
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    ...(data.rentalSettings?.leaseStart && {
      rentalSettings: {
        ...data.rentalSettings,
        leaseStart: data.rentalSettings.leaseStart.toDate(),
        leaseEnd: data.rentalSettings.leaseEnd?.toDate(),
        rateHistory: data.rentalSettings.rateHistory?.map((r: any) => ({
          ...r,
          effectiveDate: r.effectiveDate.toDate(),
        })),
      },
    }),
  } as UserProfile
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  const q = query(collection(db, "userProfiles"), where("userId", "==", userId))
  const snapshot = await getDocs(q)
  
  const data: any = { ...profile, updatedAt: Timestamp.now() }
  
  // Convert rental settings dates
  if (profile.rentalSettings) {
    data.rentalSettings = { ...profile.rentalSettings }
    if (profile.rentalSettings.leaseStart) {
      data.rentalSettings.leaseStart = Timestamp.fromDate(profile.rentalSettings.leaseStart)
    }
    if (profile.rentalSettings.leaseEnd) {
      data.rentalSettings.leaseEnd = Timestamp.fromDate(profile.rentalSettings.leaseEnd)
    }
    if (profile.rentalSettings.rateHistory) {
      data.rentalSettings.rateHistory = profile.rentalSettings.rateHistory.map(r => ({
        ...r,
        effectiveDate: Timestamp.fromDate(r.effectiveDate),
      }))
    }
  }
  
  if (snapshot.empty) {
    await addDoc(collection(db, "userProfiles"), {
      userId,
      ...data,
      createdAt: Timestamp.now(),
    })
  } else {
    const docRef = doc(db, "userProfiles", snapshot.docs[0].id)
    await updateDoc(docRef, data)
  }
}

// Family Recipient operations
export async function addFamilyRecipient(recipient: Omit<FamilyRecipient, "id" | "createdAt" | "updatedAt">) {
  const docRef = await addDoc(collection(db, "familyRecipients"), {
    ...recipient,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateFamilyRecipient(id: string, recipient: Partial<FamilyRecipient>) {
  const docRef = doc(db, "familyRecipients", id)
  await updateDoc(docRef, {
    ...recipient,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteFamilyRecipient(id: string) {
  await deleteDoc(doc(db, "familyRecipients", id))
}

export async function getFamilyRecipients(userId: string) {
  const q = query(collection(db, "familyRecipients"), where("userId", "==", userId), orderBy("name", "asc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as FamilyRecipient
  })
}

// Family Remittance operations
export async function addFamilyRemittance(remittance: Omit<FamilyRemittance, "id" | "createdAt" | "updatedAt">) {
  const data: any = {
    ...remittance,
    date: Timestamp.fromDate(remittance.date),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  if (remittance.expectedDelivery) {
    data.expectedDelivery = Timestamp.fromDate(remittance.expectedDelivery)
  }
  if (remittance.actualDelivery) {
    data.actualDelivery = Timestamp.fromDate(remittance.actualDelivery)
  }

  const docRef = await addDoc(collection(db, "familyRemittances"), data)
  return docRef.id
}

export async function updateFamilyRemittance(id: string, remittance: Partial<FamilyRemittance>) {
  const docRef = doc(db, "familyRemittances", id)
  const data: any = {
    ...remittance,
    updatedAt: Timestamp.now(),
  }

  if (remittance.date) data.date = Timestamp.fromDate(remittance.date)
  if (remittance.expectedDelivery) data.expectedDelivery = Timestamp.fromDate(remittance.expectedDelivery)
  if (remittance.actualDelivery) data.actualDelivery = Timestamp.fromDate(remittance.actualDelivery)

  await updateDoc(docRef, data)
}

export async function deleteFamilyRemittance(id: string) {
  await deleteDoc(doc(db, "familyRemittances", id))
}

export async function getFamilyRemittances(userId: string, constraints: QueryConstraint[] = []) {
  const q = query(
    collection(db, "familyRemittances"),
    where("userId", "==", userId),
    orderBy("date", "desc"),
    ...constraints
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      date: data.date.toDate(),
      expectedDelivery: data.expectedDelivery?.toDate(),
      actualDelivery: data.actualDelivery?.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as FamilyRemittance
  })
}

export function subscribeToFamilyRemittances(
  userId: string,
  callback: (remittances: FamilyRemittance[]) => void,
  constraints: QueryConstraint[] = []
) {
  const q = query(
    collection(db, "familyRemittances"),
    where("userId", "==", userId),
    orderBy("date", "desc"),
    ...constraints
  )
  return onSnapshot(q, (snapshot) => {
    const remittances = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        expectedDelivery: data.expectedDelivery?.toDate(),
        actualDelivery: data.actualDelivery?.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as FamilyRemittance
    })
    callback(remittances)
  })
}
