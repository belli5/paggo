import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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
}