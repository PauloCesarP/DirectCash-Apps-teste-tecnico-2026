import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdateSubtaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsInt()
  @IsOptional()
  order?: number;
}
