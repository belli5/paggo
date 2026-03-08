"use client"

import { useRef, useState } from "react"
import { Loader2, UploadCloud } from "lucide-react"
import { useUploadDocument } from "@/hooks/use-upload-document"
import UploadFeedback from "@/components/upload/UploadFeedback"
import { DocumentItem } from "@/types/historico"

type Props = {
  userId: string
  onFinished?: (data: { document: DocumentItem; summary: string }) => void
}

export default function UploadBox({ userId, onFinished }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFileName, setSelectedFileName] = useState("")

  const {
    uploadAndAnalyze,
    loading,
    status,
    statusMessage,
    resetUploadState,
  } = useUploadDocument()

  async function handleSelectFile(file: File | null) {
    if (!file) return

    setSelectedFileName(file.name)
    resetUploadState()

    try {
      const data = await uploadAndAnalyze(file, userId)

      const mappedDocument: DocumentItem = {
        id: data.document.id,
        filename: data.document.filename,
        fileUrl: data.document.fileUrl ?? "",
        createdAt: data.document.createdAt ?? new Date().toISOString(),
        userId: data.document.userId ?? userId,
        mimeType: data.document.mimeType ?? file.type,
      }

      onFinished?.({
        document: mappedDocument,
        summary: data.summary,
      })
    } catch {
      //
    }
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border-2 border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex w-full flex-col items-center justify-center"
      >
        {loading ? (
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-gray-500" />
        ) : (
          <UploadCloud className="mb-4 h-12 w-12 text-gray-500" />
        )}

        <p className="text-lg font-semibold text-gray-800">
          Faça o upload do seu arquivo aqui
        </p>

        <p className="mt-2 text-sm text-gray-500">
          e receba o seu resumo completo
        </p>

        <span className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
          {loading ? "Processando arquivo..." : "Selecionar arquivo"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        onChange={(e) => handleSelectFile(e.target.files?.[0] || null)}
      />

      {selectedFileName && (
        <p className="mt-4 text-sm text-gray-600">
          Arquivo selecionado:{" "}
          <span className="font-medium">{selectedFileName}</span>
        </p>
      )}

      <UploadFeedback status={status} message={statusMessage} />
    </div>
  )
}