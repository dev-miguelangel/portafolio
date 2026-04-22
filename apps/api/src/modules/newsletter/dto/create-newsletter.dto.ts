import { IsBoolean, IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNewsletterDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  summary: string;

  @IsString()
  content: string;

  @IsDateString()
  @IsOptional()
  publishedAt?: string | null;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
