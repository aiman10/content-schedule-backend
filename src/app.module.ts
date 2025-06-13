import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieService } from './movie/movie.service';
import { MoviesController } from './movies/movies.controller';
import { CastCrewService } from './cast-crew/cast-crew.service';
import { CastCrewController } from './cast-crew/cast-crew.controller';
import { AwardsService } from './awards/awards.service';
import { AwardsController } from './awards/awards.controller';

@Module({
  imports: [],
  controllers: [AppController, MoviesController, CastCrewController, AwardsController],
  providers: [AppService, MovieService, CastCrewService, AwardsService],
})
export class AppModule {}
