import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Options,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { MovieService } from 'src/movie/movie.service';
import { IFilm } from 'src/type';

@Controller('movies')
export class MoviesController {
  constructor(private service: MovieService) {}

  @Options()
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  public options() {
    return {};
  }

  @Get()
  public getAllMovies() {
    return this.service.getAllMovies();
  }

  @Get(':id')
  public async getMovieById(@Param('id') id: string) {
    const movie = await this.service.getMovieById(id);
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    return movie;
  }

  //get movie by name
  @Get('/name/:name')
  public async getMovieByName(@Param('name') name: string) {
    const movie = await this.service.getMovieByName(name);
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    return movie;
  }

  @Post()
  public async addMovie(@Body() movie: IFilm) {
    try {
      return await this.service.addMovie(movie);
    } catch (error) {
      if (error.message === 'Movie already exists') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Movie already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'An unexpected error occurred',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  public async updateMovie(@Body() movie: IFilm, @Param('id') id: string) {
    return this.service.updateMovie(id, movie);
  }
}
