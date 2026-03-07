"use client"

import { useState } from "react"
import type {
  AnalysisResponse,
  UploadResult,
  UploadedDocument,
} from "@/types/document"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export type UploadStatus =
  | "idle"
  | "uploading"
  | "running-ocr"
  | "analyzing"
  | "success"
  | "error"

export function useUploadDocument() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [statusMessage, setStatusMessage] = useState("")

  async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
    })

    if (!response.ok) {
      let message = "Erro na requisição"

      try {
        const errorData = await response.json()
        message = errorData.message || message
      } catch {
        //
      }

      throw new Error(message)
    }

    return response.json()
  }

  async function uploadDocument(
    file: File,
    userId: string
  ): Promise<UploadedDocument> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", userId)

    const response = await fetch(`${API_URL}/documents/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      let message = "Erro ao fazer upload do arquivo"

      try {
        const errorData = await response.json()
        message = errorData.message || message
      } catch {
        //
      }

      throw new Error(message)
    }

    return response.json()
  }

  async function runOcr(documentId: string) {
    return request(`/documents/${documentId}/ocr`, {
      method: "POST",
    })
  }

  async function analyzeDocument(documentId: string): Promise<AnalysisResponse> {
    return request(`/documents/${documentId}/analyze`, {
      method: "POST",
    })
  }

  async function uploadAndAnalyze(file: File, userId: string) {
    try {
      setLoading(true)
      setError(null)
      setResult(null)
      setStatus("uploading")
      setStatusMessage("Enviando arquivo...")

      const uploadedDocument = await uploadDocument(file, userId)
      const documentId = uploadedDocument.id

      setStatus("running-ocr")
      setStatusMessage("Extraindo texto do documento...")

      await runOcr(documentId)

      setStatus("analyzing")
      setStatusMessage("Gerando resumo com IA...")

      const analysis = await analyzeDocument(documentId)

      const finalResult: UploadResult = {
        documentId,
        summary: analysis.summary,
      }

      setResult(finalResult)
      setStatus("success")
      setStatusMessage("Arquivo processado com sucesso.")

      return finalResult
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao processar documento"

      setError(message)
      setStatus("error")
      setStatusMessage(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  function resetUploadState() {
    setLoading(false)
    setError(null)
    setResult(null)
    setStatus("idle")
    setStatusMessage("")
  }

  return {
    uploadAndAnalyze,
    uploadDocument,
    runOcr,
    analyzeDocument,
    loading,
    error,
    result,
    status,
    statusMessage,
    resetUploadState,
  }
}