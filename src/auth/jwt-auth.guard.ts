import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  GetPublicKeyOrSecret,
  JwtPayload,
  verify,
  VerifyOptions,
} from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { IS_PUBLIC_KEY } from './public.decorator';

/**
 * Validates Auth0-issued access tokens (RS256) on every request.
 *
 * - Signature is verified against the tenant's JWKS endpoint.
 * - issuer, audience and expiry are all enforced.
 * - Routes marked with @Public() bypass the check.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private readonly issuer: string;
  private readonly audience: string;
  private readonly jwks: JwksClient;

  constructor(
    private readonly reflector: Reflector,
    config: ConfigService,
  ) {
    const domain = config.get<string>('AUTH0_DOMAIN');
    const audience = config.get<string>('AUTH0_AUDIENCE');
    if (!domain || !audience) {
      throw new Error(
        'AUTH0_DOMAIN and AUTH0_AUDIENCE must be set to enable JWT validation.',
      );
    }
    // Normalise to the canonical Auth0 issuer form (https://<domain>/).
    this.issuer = `https://${domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}/`;
    this.audience = audience;
    this.jwks = new JwksClient({
      jwksUri: `${this.issuer}.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const payload = await this.verifyToken(token);
      // Attach the verified claims for downstream use (e.g. payload.sub).
      (request as Request & { user?: JwtPayload }).user = payload;
      return true;
    } catch (error) {
      this.logger.warn(`Rejected token: ${(error as Error).message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractBearerToken(request: Request): string | null {
    const header = request.headers.authorization;
    if (!header) {
      return null;
    }
    const [scheme, value] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !value) {
      return null;
    }
    return value;
  }

  private verifyToken(token: string): Promise<JwtPayload> {
    const getKey: GetPublicKeyOrSecret = (header, callback) => {
      this.jwks.getSigningKey(header.kid, (err, key) => {
        if (err || !key) {
          callback(err ?? new Error('Signing key not found'));
          return;
        }
        callback(null, key.getPublicKey());
      });
    };

    const options: VerifyOptions = {
      algorithms: ['RS256'],
      issuer: this.issuer,
      audience: this.audience,
    };

    return new Promise<JwtPayload>((resolve, reject) => {
      verify(token, getKey, options, (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
          reject(err ?? new Error('Invalid token payload'));
          return;
        }
        resolve(decoded);
      });
    });
  }
}
