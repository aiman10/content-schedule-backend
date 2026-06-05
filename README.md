<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

REST API (NestJS + MongoDB) backing the Film Enthusiast SPA.

## Security & configuration

All configuration comes from environment variables — **no secrets are committed**.
Copy `.env.example` to `.env` and fill it in:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string (includes credentials) |
| `MONGODB_DB` | Database name (default `ContentCalender`) |
| `AUTH0_DOMAIN` | Auth0 tenant domain, e.g. `dev-...us.auth0.com` |
| `AUTH0_AUDIENCE` | Identifier of the Auth0 API created for this backend |
| `CORS_ORIGINS` | Comma-separated allowed front-end origins (no wildcard) |
| `PORT` | Listen port (Render sets this automatically) |

What is enforced:

- **Auth0 JWT validation** on every route (RS256 via the tenant JWKS, with
  `iss` / `aud` / `exp` checked). Missing/invalid token → **401**. Only the
  `GET /` health route is `@Public()`.
- **CORS** restricted to `CORS_ORIGINS` (the app fails closed if it is unset).
- **Body validation** via a global `ValidationPipe` + DTOs on `POST`/`PUT /movies`
  (unknown fields stripped, so NoSQL-operator payloads can't reach Mongo).
- **Rate limiting** at 100 requests/minute per IP.

> Ops follow-ups that can't be done in code: **rotate the MongoDB credentials**
> (the old `Admin:admin` pair was committed to git history and is compromised),
> rotate the RapidAPI key, create the Auth0 API to obtain `AUTH0_AUDIENCE`, and
> purge the secrets from git history (BFG / git-filter-repo).

## Installation

```bash
$ npm install
$ cp .env.example .env   # then fill in the values
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
