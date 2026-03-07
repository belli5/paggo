"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import UploadBox from "@/components/upload/UploadBox"

export default function ChatPage() {
  const [summary, setSummary] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("user")

    if (user) {
      const parsedUser = JSON.parse(user)
      setUserId(parsedUser.id)
    }
  }, [])

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex w-full flex-col items-center justify-center p-8">
        {userId && (
          <UploadBox
            userId={userId}
            onFinished={({ summary }) => setSummary(summary)}
          />
        )}

        {summary && (
          <div className="mt-8 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Resumo do documento
            </h2>
            <div className="whitespace-pre-line text-sm leading-7 text-gray-700">
              {summary}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}