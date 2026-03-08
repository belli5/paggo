"use client"

import { useEffect, useState } from "react"
import { DocumentAnalysis } from "@/types/analysis"
import { API_URL } from "@/lib/api"

type UseDocumentAnalysisProps = {
  documentId?: string
}

export function useDocumentAnalysis({ documentId }: UseDocumentAnalysisProps) {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalysis() {
      if (!documentId) {
        setAnalysis(null)
        setError(null)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `${API_URL}/documents/${documentId}/analysis`,
          {
            cache: "no-store",
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            setError("Análise ainda não foi gerada para este documento.")
            return
          }

          throw new Error("Erro ao buscar análise")
        }

        const data: DocumentAnalysis = await response.json()

        setAnalysis(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [documentId])

  return {
    analysis,
    loading,
    error,
  }
}