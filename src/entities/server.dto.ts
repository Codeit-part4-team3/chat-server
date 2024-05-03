import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  inviteeEmail: string;

  @IsNotEmpty()
  @IsNumber()
  serverId: number;
}

export class InviteServerLinkDto {
  @IsNotEmpty()
  @IsString()
  inviteLink: string;
}
