export type ChatRole = "USER" | "ASSISTANT"

export type ChatMessage = {
  id: string
  documentId: string
  role: ChatRole
  content: string
  createdAt: string
}

export type ChatResponse = {
  answer: string
  messageId: string
}