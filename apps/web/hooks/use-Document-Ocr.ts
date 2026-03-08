"use client"

import { useEffect, useState } from "react"
import { DocumentOcr } from "@/types/ocr"
import { API_URL } from "@/lib/api"

type UseDocumentOcrProps = {
  documentId?: string
}

export function useDocumentOcr({ documentId }: UseDocumentOcrProps) {
  const [ocr, setOcr] = useState<DocumentOcr | null>(null)
  const [loadingOcr, setLoadingOcr] = useState(false)
  const [ocrError, setOcrError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOcr() {
      if (!documentId) {
        setOcr(null)
        setOcrError(null)
        return
      }

      try {
        setLoadingOcr(true)
        setOcrError(null)

        const response = await fetch(
          `${API_URL}/documents/${documentId}/ocr`,
          {
            cache: "no-store",
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            setOcrError("OCR ainda não foi gerado para este documento.")
            return
          }

          throw new Error("Erro ao buscar OCR")
        }

        const data: DocumentOcr = await response.json()
        setOcr(data)
      } catch (err) {
        setOcrError(err instanceof Error ? err.message : "Erro inesperado")
      } finally {
        setLoadingOcr(false)
      }
    }

    fetchOcr()
  }, [documentId])

  return {
    ocr,
    loadingOcr,
    ocrError,
  }
}