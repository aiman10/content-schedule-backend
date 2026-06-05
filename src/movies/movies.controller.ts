import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { MovieService } from 'src/movie/movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private service: MovieService) {}

  private assertValidId(id: string): void {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid movie id');
    }
  }

  @Get()
  public getAllMovies() {
    return this.service.getAllMovies();
  }

  @Get(':id')
  public async getMovieById(@Param('id') id: string) {
    this.assertValidId(id);
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
  public async addMovie(@Body() movie: CreateMovieDto) {
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
  public async updateMovie(
    @Body() movie: UpdateMovieDto,
    @Param('id') id: string,
  ) {
    this.assertValidId(id);
    return this.service.updateMovie(id, movie);
  }
}
