import { AuthService } from './auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.authService.tokenGetUser(accessToken);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
