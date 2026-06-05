import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

// jwks-rsa pulls in the ESM-only `jose` package, which ts-jest can't transform.
// We don't reach JWKS fetching in these tests, so stub the client.
jest.mock('jwks-rsa', () => ({
  JwksClient: jest.fn().mockImplementation(() => ({
    getSigningKey: jest.fn(),
  })),
}));

import { JwtAuthGuard } from './jwt-auth.guard';

function makeContext(
  headers: Record<string, string> = {},
): ExecutionContext {
  const request = { headers };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
}

function makeGuard(reflector: Reflector): JwtAuthGuard {
  const config = {
    get: (key: string) =>
      key === 'AUTH0_DOMAIN'
        ? 'tenant.us.auth0.com'
        : key === 'AUTH0_AUDIENCE'
          ? 'https://api.film-enthusiast'
          : undefined,
  } as unknown as ConfigService;
  return new JwtAuthGuard(reflector, config);
}

describe('JwtAuthGuard', () => {
  it('throws when AUTH0 config is missing', () => {
    const config = { get: () => undefined } as unknown as ConfigService;
    expect(() => new JwtAuthGuard(new Reflector(), config)).toThrow();
  });

  it('allows @Public() routes without a token', async () => {
    const reflector = {
      getAllAndOverride: () => true,
    } as unknown as Reflector;
    const guard = makeGuard(reflector);
    await expect(guard.canActivate(makeContext())).resolves.toBe(true);
  });

  it('rejects protected routes with no bearer token', async () => {
    const reflector = {
      getAllAndOverride: () => false,
    } as unknown as Reflector;
    const guard = makeGuard(reflector);
    await expect(guard.canActivate(makeContext())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects a malformed (non-bearer) authorization header', async () => {
    const reflector = {
      getAllAndOverride: () => false,
    } as unknown as Reflector;
    const guard = makeGuard(reflector);
    await expect(
      guard.canActivate(makeContext({ authorization: 'Basic abc123' })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
