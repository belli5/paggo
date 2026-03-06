import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChatRole } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class ChatService {
  private client: GoogleGenAI;
  private model: string;

  constructor(private readonly prisma: PrismaService) {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
      });

      return response.text?.trim() || '';
    } catch (error) {
      console.error('Erro ao chamar Gemini:', error);
      throw new InternalServerErrorException('Falha ao gerar resposta com IA');
    }
  }

  private buildAnalysisPrompt(rawText: string) {
    return `
Você é um assistente especializado em explicar documentos extraídos por OCR.

Sua tarefa é analisar e explicar de forma clara todo o conteúdo do documento abaixo.

Regras:
- Responda em português do Brasil.
- Não invente informações.
- Se algum trecho estiver ilegível ou duvidoso, avise isso claramente.
- Organize a resposta nas seções abaixo:

1. Tipo de documento
2. Resumo geral
3. Principais informações encontradas
4. Pessoas, empresas ou entidades citadas
5. Datas, valores, números e identificadores relevantes
6. Observações importantes
7. Explicação final em linguagem simples

Conteúdo do documento:
"""
${rawText}
"""
    `.trim();
  }

  private buildChatPrompt(params: {
    rawText: string;
    summary: string;
    history: { role: string; content: string }[];
    question: string;
  }) {
    const historyText = params.history.length
      ? params.history.map((msg) => `${msg.role}: ${msg.content}`).join('\n')
      : 'Sem histórico anterior.';

    return `
Você é um assistente que responde perguntas sobre um documento.

Regras:
- Responda em português do Brasil.
- Use o documento como fonte principal.
- Use a análise geral como apoio.
- Não invente informações.
- Se a resposta não estiver no documento, diga isso claramente.
- Seja objetivo e útil.

ANÁLISE GERAL:
"""
${params.summary}
"""

TEXTO OCR:
"""
${params.rawText}
"""

HISTÓRICO:
"""
${historyText}
"""

PERGUNTA:
"""
${params.question}
"""
    `.trim();
  }

  async generateAnalysis(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        ocr: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    if (!document.ocr) {
      throw new BadRequestException('OCR ainda não foi executado para este documento');
    }

    if (!document.ocr.rawText?.trim()) {
      throw new BadRequestException('O documento não possui texto extraído');
    }

    const prompt = this.buildAnalysisPrompt(document.ocr.rawText);
    const summary = await this.generateText(prompt);

    return this.prisma.documentAnalysis.upsert({
      where: { documentId },
      update: { summary },
      create: {
        documentId,
        summary,
      },
    });
  }

  async getAnalysis(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    const analysis = await this.prisma.documentAnalysis.findUnique({
      where: { documentId },
    });

    if (!analysis) {
      throw new NotFoundException('Análise ainda não foi gerada para este documento');
    }

    return analysis;
  }

  async chatWithDocument(documentId: string, message: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        ocr: true,
        documentAnalysis: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    if (!document.ocr) {
      throw new BadRequestException('OCR ainda não foi executado para este documento');
    }

    if (!document.documentAnalysis) {
      throw new BadRequestException('A análise do documento ainda não foi gerada');
    }

    await this.prisma.chatMessage.create({
      data: {
        documentId,
        role: ChatRole.USER,
        content: message,
      },
    });

    const history = await this.prisma.chatMessage.findMany({
      where: { documentId },
      orderBy: { createdAt: 'asc' },
      take: 6,
    });

    const prompt = this.buildChatPrompt({
      rawText: document.ocr.rawText,
      summary: document.documentAnalysis.summary,
      history: history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      question: message,
    });

    const answer = await this.generateText(prompt);

    const savedAnswer = await this.prisma.chatMessage.create({
      data: {
        documentId,
        role: ChatRole.ASSISTANT,
        content: answer,
      },
    });

    return {
      answer,
      messageId: savedAnswer.id,
    };
  }

  async getMessages(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    return this.prisma.chatMessage.findMany({
      where: { documentId },
      orderBy: { createdAt: 'asc' },
    });
  }
}