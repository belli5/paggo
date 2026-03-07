export type UploadedDocument = {
  id: string
  userId: string
  filename: string
  mimeType: string
  fileUrl: string
  createdAt?: string
}

export type AnalysisResponse = {
  id: string
  documentId: string
  summary: string
  createdAt?: string
  updatedAt?: string
}

export type UploadResult = {
  documentId: string
  summary: string
}