"use client"

import { useEffect, useState } from "react"
import type { User } from "@/types/auth"

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userStorage = localStorage.getItem("user")

    if (userStorage) {
      setUser(JSON.parse(userStorage))
    }
  }, [])

  return { user }
}