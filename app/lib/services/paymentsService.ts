import payments from "@/lib/mocks/payments.json"
import type {
  ClientPack,
  GPPack,
  PaymentRole,
  PaymentTransaction,
  PendingPayment,
} from "@/lib/models"

const TRANSACTIONS_KEY = "easycollis_transactions"
const PENDING_KEY = "easycollis_pending_payments"

export function listClientPacks(): ClientPack[] {
  return payments.clientPacks
}

export function listGPPacks(): GPPack[] {
  return payments.gpPacks
}

export function getCurrency(): string {
  return payments.currency
}

export function getTransactions(userId?: string): PaymentTransaction[] {
  const raw = localStorage.getItem(TRANSACTIONS_KEY)
  if (!raw) return []
  try {
    const all = JSON.parse(raw) as PaymentTransaction[]
    if (!userId) return all
    return all.filter((t) => t.userId === userId)
  } catch {
    return []
  }
}

export function createMockPurchase(params: {
  userId: string
  role: PaymentRole
  packId: string
  amount: number
  currency: string
  status?: PaymentTransaction["status"]
}): PaymentTransaction {
  const tx: PaymentTransaction = {
    id: `tx-${Date.now()}`,
    userId: params.userId,
    role: params.role,
    packId: params.packId,
    amount: params.amount,
    currency: params.currency,
    status: params.status ?? "paid",
    createdAt: new Date().toISOString(),
  }
  const next = [tx, ...getTransactions()]
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next))
  return tx
}

export function createPendingPayment(data: Omit<PendingPayment, "createdAt">) {
  const pending: PendingPayment = {
    ...data,
    createdAt: new Date().toISOString(),
  }
  const all = getPendingPayments()
  all.unshift(pending)
  localStorage.setItem(PENDING_KEY, JSON.stringify(all))
  return pending
}

export function getPendingPayments(): PendingPayment[] {
  const raw = localStorage.getItem(PENDING_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as PendingPayment[]
  } catch {
    return []
  }
}

export function getPendingPayment(ref: string): PendingPayment | undefined {
  return getPendingPayments().find((p) => p.ref === ref)
}

export function removePendingPayment(ref: string) {
  const next = getPendingPayments().filter((p) => p.ref !== ref)
  localStorage.setItem(PENDING_KEY, JSON.stringify(next))
}
