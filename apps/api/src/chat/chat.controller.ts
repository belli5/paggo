import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatWithDocumentDto } from './dto/chat-with-document.dto';

@Controller('documents')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // gerar análise do documento usando LLM
  @Post(':id/analyze')
  generateAnalysis(@Param('id') id: string) {
    return this.chatService.generateAnalysis(id);
  }

  // buscar análise do documento
  @Get(':id/analysis')
  getAnalysis(@Param('id') id: string) {
    return this.chatService.getAnalysis(id);
  }

  // enviar pergunta sobre o documento
  @Post(':id/chat')
  chatWithDocument(
    @Param('id') id: string,
    @Body() dto: ChatWithDocumentDto,
  ) {
    return this.chatService.chatWithDocument(id, dto.message);
  }

  // buscar histórico de chat
  @Get(':id/chat/messages')
  getMessages(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }
}