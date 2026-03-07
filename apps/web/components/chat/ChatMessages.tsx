"use client"

import { ChatMessage } from "@/types/chat"

type ChatMessagesProps = {
  messages: ChatMessage[]
  loading?: boolean
}

export default function ChatMessages({
  messages,
  loading = false,
}: ChatMessagesProps) {
  if (loading) {
    return (
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Carregando mensagens...</p>
      </div>
    )
  }

  if (!messages.length) {
    return (
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Nenhuma mensagem ainda. Faça uma pergunta sobre o documento.
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      {messages.map((message) => {
        const isUser = message.role === "USER"

        return (
          <div
            key={message.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                isUser
                  ? "bg-black text-white"
                  : "border border-gray-200 bg-white text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}