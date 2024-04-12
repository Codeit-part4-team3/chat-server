import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class PatchServerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
