"use client"

import { useEffect, useRef, useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import UploadBox from "@/components/upload/UploadBox"
import ChatInput from "@/components/chat/ChatInput"
import ChatMessages from "@/components/chat/ChatMessages"
import { useDocumentAnalysis } from "@/hooks/use-document-analysis"
import { useDocumentChat } from "@/hooks/use-document-chat"
import { DocumentItem } from "@/types/historico"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { useDocumentOcr } from "@/hooks/use-Document-Ocr"
import { generateChatReportPdf } from "@/lib/pdf/generate-chat-report"
import { API_URL } from "@/lib/api"

export default function ChatPage() {
  const [summary, setSummary] = useState("")
  const [userId, setUserId] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const { ocr } = useDocumentOcr({
    documentId: selectedDocument?.id,
    })

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

  const handleDownloadOriginal = () => {
    if (!selectedDocument?.fileUrl) return

    const downloadUrl = `${API_URL}${selectedDocument.fileUrl}`

    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = selectedDocument.filename
    link.target = "_blank"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    }

    const handleDownloadReportPdf = () => {
        if (!selectedDocument) return

        generateChatReportPdf({
            filename: selectedDocument.filename,
            summary: analysis?.summary || "",
            extractedText: ocr?.rawText || "",
            messages: messages.map((message) => ({
            role: message.role,
            content: message.content,
            })),
        })
    }

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

                <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                        {selectedDocument.filename}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                        Análise gerada pela IA
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                        onClick={handleDownloadOriginal}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                        <Download size={18} />
                        Original
                        </button>

                        <button
                        onClick={handleDownloadReportPdf}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                        <FileText size={18} />
                        Relatório PDF
                        </button>
                    </div>
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