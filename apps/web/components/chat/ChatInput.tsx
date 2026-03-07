"use client"

import { SendHorizonal } from "lucide-react"
import { useState } from "react"

type ChatInputProps = {
  disabled?: boolean
  loading?: boolean
  disabledMessage?: string
  onSendMessage?: (message: string) => void | Promise<void>
}

export default function ChatInput({
  disabled = false,
  loading = false,
  disabledMessage = "Envie um documento para liberar a conversa...",
  onSendMessage,
}: ChatInputProps) {
  const [message, setMessage] = useState("")

  async function handleSend() {
    const trimmedMessage = message.trim()

    if (!trimmedMessage || disabled || loading) return

    await onSendMessage?.(trimmedMessage)
    setMessage("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex w-full justify-center py-4">
      <div
        className={`flex w-full max-w-3xl items-end gap-3 rounded-2xl border px-4 py-3 shadow-lg transition ${
          disabled
            ? "border-gray-200 bg-gray-100"
            : "border-gray-300 bg-white focus-within:border-black"
        }`}
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? disabledMessage
              : loading
              ? "A IA está respondendo..."
              : "Pergunte algo sobre o documento..."
          }
          rows={1}
          disabled={disabled || loading}
          className="max-h-32 min-h-6 flex-1 resize-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || loading || !message.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  )
}