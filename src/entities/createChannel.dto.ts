import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
