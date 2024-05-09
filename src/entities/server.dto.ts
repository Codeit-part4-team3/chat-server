import {
  IsBoolean,
  IsDate,
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

export class AcceptInviteDto {
  @IsNotEmpty()
  @IsNumber()
  inviteId: number;

  @IsNotEmpty()
  @IsBoolean()
  isAccept: boolean;
}

export class EventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  start: Date;

  @IsNotEmpty()
  @IsNumber()
  serverId: number;
}

export class GetEventDto {
  @IsNotEmpty()
  @IsNumber()
  serverId: number;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
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
