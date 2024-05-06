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
  id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;
}

export class InviteServerLinkDto {
  @IsNotEmpty()
  @IsString()
  inviteLink: string;
}

export class InvitedServer {
  inviteId: number;
  serverName: string;
  inviterName: string;
}

export class User {
  id: number;
  email: string;
  nickname: string;
}
