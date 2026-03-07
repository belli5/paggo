"use client"

import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react"
import type { UploadStatus } from "@/hooks/use-upload-document"

type Props = {
  status: UploadStatus
  message: string
}

export default function UploadFeedback({ status, message }: Props) {
  if (status === "idle" || !message) return null

  const isLoading =
    status === "uploading" ||
    status === "running-ocr" ||
    status === "analyzing"

  const isSuccess = status === "success"
  const isError = status === "error"

  return (
    <div
      className={[
        "mt-5 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium",
        isLoading && "border-blue-200 bg-blue-50 text-blue-700",
        isSuccess && "border-green-200 bg-green-50 text-green-700",
        isError && "border-red-200 bg-red-50 text-red-700",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
      {isSuccess && <CheckCircle2 className="h-5 w-5 text-green-600" />}
      {isError && <CircleAlert className="h-5 w-5 text-red-600" />}

      <span>{message}</span>
    </div>
  )
}