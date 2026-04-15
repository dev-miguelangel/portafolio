import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import type { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsEnum(['idea', 'demo', 'production'])
  @IsOptional()
  status?: ProjectStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsUrl()
  @IsOptional()
  demoUrl?: string | null;

  @IsUrl()
  @IsOptional()
  productionUrl?: string | null;

  @IsUrl()
  @IsOptional()
  imageUrl?: string | null;
}
