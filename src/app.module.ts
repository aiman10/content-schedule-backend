import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DatabaseModule } from './database/database.module';
import { MovieService } from './movie/movie.service';
import { MoviesController } from './movies/movies.controller';
import { CastCrewService } from './cast-crew/cast-crew.service';
import { CastCrewController } from './cast-crew/cast-crew.controller';
import { AwardsService } from './awards/awards.service';
import { AwardsController } from './awards/awards.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    // Public API: cap each client IP to 100 requests/minute.
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
  ],
  controllers: [AppController, MoviesController, CastCrewController, AwardsController],
  providers: [
    AppService,
    MovieService,
    CastCrewService,
    AwardsService,
    // Order matters: rate-limit first, then authenticate.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
