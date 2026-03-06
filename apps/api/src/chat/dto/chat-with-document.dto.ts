import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatWithDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}