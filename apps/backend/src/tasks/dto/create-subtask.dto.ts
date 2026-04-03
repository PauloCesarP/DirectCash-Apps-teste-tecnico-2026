import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateSubtaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsOptional()
  order?: number;
}
