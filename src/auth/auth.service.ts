import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

@Injectable()
export class AuthService {
  private readonly cognitoClient: CognitoIdentityServiceProvider;

  constructor() {
    this.cognitoClient = new CognitoIdentityServiceProvider({
      region: 'ap-northeast-2',
    });
  }

  async tokenLogin(accessToken: string) {
    return await this.cognitoClient
      .getUser({ AccessToken: accessToken })
      .promise();
  }

  async tokenGetUser(token: string) {
    try {
      const email = (await this.tokenLogin(token)).UserAttributes.find(
        (it) => it.Name === 'email',
      ).Value;

      return email;
    } catch (_) {
      throw new HttpException('unauthorization user', HttpStatus.NOT_FOUND);
    }
  }
}
