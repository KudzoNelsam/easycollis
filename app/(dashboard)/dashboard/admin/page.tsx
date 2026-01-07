"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Package } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) router.push("/login")
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Panneau administrateur (placeholder)</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
