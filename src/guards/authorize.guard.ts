import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import {
  AccountStatus,
  GroupPolicy,
  IAM,
  UserType,
} from 'src/proto-interfaces/authorize';
import { AUTHORIZE_MENU_KEY } from './authorize.decorator';

interface JwtPayload {
  userId: string;
  accountStatus: AccountStatus;
  userType: UserType;
  iam: IAM;
  groupPolicyId: string;
}

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const menu = this.reflector.getAllAndOverride<GroupPolicy>(
      AUTHORIZE_MENU_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (menu === undefined) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const payload = this.decodeJwt(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    const response = await this.authService.authorize({
      accountStatus: payload.accountStatus,
      userType: payload.userType,
      iam: payload.iam,
      userId: payload.userId,
      groupPolicyId: payload.groupPolicyId,
      menu,
    });

    if (response.statusCode !== 200) {
      throw new UnauthorizedException(response.message ?? 'Unauthorized');
    }

    return true;
  }

  private extractBearerToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.slice(7);
  }

  private decodeJwt(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const raw = Buffer.from(parts[1], 'base64url').toString('utf8');
      return JSON.parse(raw) as JwtPayload;
    } catch {
      return null;
    }
  }
}
