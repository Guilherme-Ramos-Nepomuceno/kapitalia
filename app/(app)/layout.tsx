"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { BottomNav } from "@/components/app/BottomNav"
import { DashboardSkeleton } from "@/components/app/DashboardSkeleton"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)
  const { isLoggedIn, isOnboarded } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    if (!isLoggedIn) {
      router.replace("/login")
    } else if (!isOnboarded) {
      router.replace("/onboarding")
    }
  }, [isHydrated, isLoggedIn, isOnboarded, router])

  if (!isHydrated) return <DashboardSkeleton />
  if (!isLoggedIn || !isOnboarded) return <DashboardSkeleton />

  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}
