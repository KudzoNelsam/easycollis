export function isPassActive(passValidUntil?: string): boolean {
  if (!passValidUntil) return false
  return new Date(passValidUntil).getTime() >= Date.now()
}

export function extendPass(passValidUntil: string | undefined, days = 30): string {
  const base = passValidUntil && isPassActive(passValidUntil) ? new Date(passValidUntil) : new Date()
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return next.toISOString()
}

export function formatPassDate(passValidUntil?: string): string {
  if (!passValidUntil) return "—"
  try {
    return new Date(passValidUntil).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return "—"
  }
}
