"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { DashboardSkeleton } from "@/components/app/DashboardSkeleton"

export default function Root() {
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)
  const { isLoggedIn } = useAppStore()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    if (isLoggedIn) router.replace("/home")
    else router.replace("/login")
  }, [isHydrated, isLoggedIn, router])

  return <DashboardSkeleton />
}
