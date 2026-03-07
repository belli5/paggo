"use client"

import { useEffect, useState } from "react"
import { DocumentItem } from "@/types/historico"

type UseUserDocumentsProps = {
  userId?: string
}

export function useUserDocuments({ userId }: UseUserDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDocuments() {
      if (!userId) {
        setDocuments([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `http://localhost:3001/documents/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        )

        if (!response.ok) {
          throw new Error("Erro ao buscar documentos do usuário")
        }

        const data: DocumentItem[] = await response.json()
        setDocuments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [userId])

  return {
    documents,
    loading,
    error,
  }
}