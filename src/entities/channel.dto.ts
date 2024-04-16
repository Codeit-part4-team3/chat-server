import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  isPrivate: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isVoice: boolean;

  @IsNotEmpty()
  @IsNumber()
  serverId: number;
}

export class PactchChannelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsBoolean()
  @IsOptional()
  isVoice?: boolean;
}
