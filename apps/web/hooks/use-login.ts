"use client"

import { useState } from "react"
import type { LoginPayload, LoginResponse } from "@/types/auth"
import { API_URL } from "@/lib/api"

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function login(data: LoginPayload): Promise<LoginResponse | null> {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Erro ao fazer login"
        )
      }

      localStorage.setItem("access_token", result.access_token)
      localStorage.setItem("user", JSON.stringify(result.user))

      return result
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro inesperado ao fazer login"

      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    loading,
    error,
  }
}