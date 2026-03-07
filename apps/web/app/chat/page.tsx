"use client"

import { useEffect, useRef, useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import UploadBox from "@/components/upload/UploadBox"
import ChatInput from "@/components/chat/ChatInput"
import ChatMessages from "@/components/chat/ChatMessages"
import { useDocumentAnalysis } from "@/hooks/use-document-analysis"
import { useDocumentChat } from "@/hooks/use-document-chat"
import { DocumentItem } from "@/types/historico"
import { ArrowLeft } from "lucide-react"

export default function ChatPage() {
  const [summary, setSummary] = useState("")
  const [userId, setUserId] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const user = localStorage.getItem("user")

    if (user) {
      const parsedUser = JSON.parse(user)
      setUserId(parsedUser.id)
    }
  }, [])

  const { analysis, loading, error } = useDocumentAnalysis({
    documentId: selectedDocument?.id,
  })

  const {
    messages,
    loadingMessages,
    sendingMessage,
    error: chatError,
    sendMessage,
  } = useDocumentChat({
    documentId: selectedDocument?.id,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sendingMessage])

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar
        onSelectDocument={(document) => {
          setSelectedDocument(document)
          setSummary("")
        }}
        selectedDocumentId={selectedDocument?.id}
      />

      <div className="flex min-h-screen w-full flex-col p-8">
        <div className="flex w-full flex-1 flex-col items-center pb-32">
          {!selectedDocument && userId && (
            <UploadBox
              userId={userId}
              onFinished={({ summary }) => {
                setSummary(summary)
                setSelectedDocument(null)
              }}
            />
          )}

          {!selectedDocument && summary && (
            <div className="mt-8 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Resumo do documento
              </h2>
              <div className="whitespace-pre-line text-sm leading-7 text-gray-700">
                {summary}
              </div>
            </div>
          )}

          {selectedDocument && (
            <>
              <div className="mb-6 w-full max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={18} />
                  Voltar para upload
                </button>

                <div className="mb-6 border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {selectedDocument.filename}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Análise gerada pela IA
                  </p>
                </div>

                {loading && (
                  <p className="text-sm text-gray-500">Carregando análise...</p>
                )}

                {!loading && error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                {!loading && !error && analysis && (
                  <div className="whitespace-pre-line text-sm leading-7 text-gray-700">
                    {analysis.summary}
                  </div>
                )}
              </div>

              <ChatMessages
                messages={messages}
                loading={loadingMessages}
              />

              {chatError && (
                <div className="mt-4 w-full max-w-4xl rounded-xl bg-red-50 p-4 text-sm text-red-600">
                  {chatError}
                </div>
              )}

              {sendingMessage && (
                <div className="mt-4 w-full max-w-4xl text-sm text-gray-500">
                  A IA está respondendo...
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="sticky bottom-0 z-20">
          <ChatInput
            disabled={!selectedDocument}
            loading={sendingMessage}
            disabledMessage="Antes de usar o chat faça o upload."
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </main>
  )
}