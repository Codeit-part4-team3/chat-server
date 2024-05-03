import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

export class InviteServerDto {
  @IsNotEmpty()
  @IsNumber()
  inviterId: number;

  @IsNotEmpty()
  @IsEmail()
  inviteeEmail: string;
}

export class InviteUserServerResponseDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class InviteServerLinkDto {
  @IsNotEmpty()
  @IsString()
  inviteLink: string;
}
