import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get, 
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { DocumentsService } from './documents.service';

@ApiTags('documents') // grupo no swagger
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')

  @ApiOperation({ summary: 'Upload de documento' })

  @ApiConsumes('multipart/form-data')

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  @ApiResponse({
    status: 201,
    description: 'Documento enviado com sucesso',
  })

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.resolve('storage/uploads');

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const fileUrl = `storage/uploads/${file.filename}`;

    const userId = '1';

    const document = await this.documentsService.create({
      userId,
      filename: file.originalname,
      mimeType: file.mimetype,
      fileUrl,
    });

    return document;
  }

  @Get()
  @ApiOperation({ summary: 'Listar documentos' })
  @ApiResponse({ status: 200, description: 'Lista de documentos' })
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar documento por ID' })
  @ApiResponse({ status: 200, description: 'Documento encontrado' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }
}