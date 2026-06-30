"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { BottomNav } from "@/components/app/BottomNav"
import { DashboardSkeleton } from "@/components/app/DashboardSkeleton"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)
  const { isLoggedIn } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    if (!isLoggedIn) {
      router.replace("/login")
    }
  }, [isHydrated, isLoggedIn, router])

  if (!isHydrated) return <DashboardSkeleton />
  if (!isLoggedIn) return <DashboardSkeleton />

  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}
