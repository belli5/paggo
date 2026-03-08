import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";

const pdfParse = require("pdf-parse");
import { fromPath } from "pdf2pic";

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    filename: string;
    mimeType: string;
    fileUrl: string;
  }) {
    return this.prisma.document.create({
      data: {
        userId: data.userId,
        filename: data.filename,
        mimeType: data.mimeType,
        fileUrl: data.fileUrl,
      },
    });
  }

  findAll() {
    return this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  async runOcr(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      throw new Error("Documento não encontrado")
    }

    const relativePath = document.fileUrl.replace(/^\/+/, '')
    const filePath = path.resolve(process.cwd(), relativePath)

    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`)
    }

    let extractedText = ""

    if (document.mimeType === "application/pdf") {
      const buffer = fs.readFileSync(filePath)

      const parsed = await pdfParse(buffer)

      extractedText = parsed.text?.trim() || ""
    } else {
      const result = await Tesseract.recognize(
        filePath,
        "por+eng"
      )

      extractedText = result.data.text
    }

    const saved = await this.prisma.ocrResult.create({
      data: {
        documentId: document.id,
        rawText: extractedText,
      },
    })

    return saved
  }

  findAllByUserId(userId: string) {
    return this.prisma.document.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOcrByDocumentId(documentId: string) {
    return this.prisma.ocrResult.findFirst({
      where: {
        documentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}