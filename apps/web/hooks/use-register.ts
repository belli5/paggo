"use client"

import { useState } from "react"
import type { RegisterPayload, RegisterResponse } from "@/types/auth"
import { API_URL } from "@/lib/api"

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function register(data: RegisterPayload) {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Erro ao cadastrar usuário")
      }

      localStorage.setItem("token", result.access_token)
      localStorage.setItem("user", JSON.stringify(result.user))

      return result as RegisterResponse
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro inesperado ao cadastrar"
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    register,
    loading,
    error,
  }
}