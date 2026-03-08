"use client"

import { useCallback, useEffect, useState } from "react"
import { ChatMessage, ChatResponse } from "@/types/chat"
import { API_URL } from "@/lib/api"

type UseDocumentChatProps = {
  documentId?: string
}

export function useDocumentChat({ documentId }: UseDocumentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!documentId) {
      setMessages([])
      return
    }

    try {
      setLoadingMessages(true)
      setError(null)

      const response = await fetch(
        `${API_URL}/documents/${documentId}/chat/messages`
      )

      if (!response.ok) {
        throw new Error("Erro ao buscar mensagens")
      }

      const data: ChatMessage[] = await response.json()
      setMessages(data)
    } catch (err) {
      console.error(err)
      setError("Não foi possível carregar o histórico do chat.")
    } finally {
      setLoadingMessages(false)
    }
  }, [documentId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  async function sendMessage(message: string) {
    if (!documentId || !message.trim()) return

    const tempUserMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      documentId,
      role: "USER",
      content: message,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempUserMessage])

    try {
      setSendingMessage(true)
      setError(null)

      const response = await fetch(
        `${API_URL}/documents/${documentId}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem")
      }

      const data: ChatResponse = await response.json()

      const assistantMessage: ChatMessage = {
        id: data.messageId,
        documentId,
        role: "ASSISTANT",
        content: data.answer,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== tempUserMessage.id),
        tempUserMessage,
        assistantMessage,
      ])
    } catch (err) {
      console.error(err)

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id)
      )

      setError("Não foi possível enviar a mensagem.")
    } finally {
      setSendingMessage(false)
    }
  }

  return {
    messages,
    loadingMessages,
    sendingMessage,
    error,
    sendMessage,
    refetchMessages: fetchMessages,
  }
}