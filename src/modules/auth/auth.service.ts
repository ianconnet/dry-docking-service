import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AUTHORIZE_PACKAGE_NAME,
  AuthorizeRequest,
  AuthorizeResponse,
  AuthorizeServiceClient,
  AUTHORIZE_SERVICE_NAME,
} from 'src/proto-interfaces/authorize';
import {
  LoginRequest,
  LoginResponse,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'src/proto-interfaces/user';

@Injectable()
export class AuthService implements OnModuleInit {
  private authorizeService!: AuthorizeServiceClient;
  private userAuthService!: UserServiceClient;

  constructor(@Inject(AUTHORIZE_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authorizeService = this.client.getService<AuthorizeServiceClient>(
      AUTHORIZE_SERVICE_NAME,
    );
    this.userAuthService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  authorize(request: AuthorizeRequest): Promise<AuthorizeResponse> {
    return firstValueFrom(this.authorizeService.authorizeUser(request));
  }

  login(request: LoginRequest): Promise<LoginResponse> {
    return firstValueFrom(this.userAuthService.login(request));
  }
}
