import jsPDF from "jspdf"

type ChatMessage = {
  role: string
  content: string
}

type GenerateChatReportParams = {
  filename: string
  summary?: string
  extractedText?: string
  messages: ChatMessage[]
}

function normalizeText(text?: string) {
  return (text || "")
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .trim()
}

export function generateChatReportPdf({
  filename,
  summary,
  extractedText,
  messages,
}: GenerateChatReportParams) {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14
  const maxWidth = pageWidth - margin * 2
  let y = 20

  const ensureSpace = (space = 10) => {
    if (y + space > pageHeight - 15) {
      doc.addPage()
      y = 20
    }
  }

  const addSectionTitle = (title: string) => {
    ensureSpace(12)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text(title, margin, y)
    y += 8
  }

  const addParagraph = (text?: string) => {
    const safeText = normalizeText(text)

    if (!safeText) {
      ensureSpace(8)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.text("Não disponível.", margin, y)
      y += 7
      return
    }

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)

    const lines = doc.splitTextToSize(safeText, maxWidth)

    for (const line of lines) {
      ensureSpace(7)
      doc.text(line, margin, y)
      y += 6
    }

    y += 2
  }

  const addDivider = () => {
    ensureSpace(6)
    doc.line(margin, y, pageWidth - margin, y)
    y += 6
  }

  const safeFilename = filename.replace(/\.[^/.]+$/, "")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("Relatório do Documento", margin, y)
  y += 10

  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text(`Arquivo: ${filename}`, margin, y)
  y += 7
  doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, margin, y)
  y += 10

  addDivider()

  addSectionTitle("Resumo")
  addParagraph(summary)

  addDivider()

  addSectionTitle("Texto extraído")
  addParagraph(extractedText)

  addDivider()

  addSectionTitle("Histórico do chat")

  if (!messages.length) {
    addParagraph("Nenhuma interação encontrada.")
  } else {
    messages.forEach((message, index) => {
      const role =
        message.role?.toUpperCase() === "USER"
          ? "Usuário"
          : message.role?.toUpperCase() === "ASSISTANT"
          ? "IA"
          : message.role || "Mensagem"

      ensureSpace(10)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.text(`${index + 1}. ${role}`, margin, y)
      y += 7

      addParagraph(message.content)
    })
  }

  doc.save(`${safeFilename}-relatorio.pdf`)
}