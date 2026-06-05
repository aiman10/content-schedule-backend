import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { IFilm } from 'src/type';
import { DatabaseService } from 'src/database/database.service';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(private readonly db: DatabaseService) {}

  private movies() {
    return this.db.collection<IFilm>('movies');
  }

  public async getMovieById(movieId: string): Promise<IFilm> {
    const objectId = new ObjectId(movieId);
    return this.movies().findOne({ _id: objectId });
  }

  //get movie by name
  public async getMovieByName(movieName: string): Promise<IFilm> {
    return this.movies().findOne({ title: movieName });
  }

  public async getAllMovies() {
    return this.movies().find({}).toArray();
  }

  public async addMovie(movie: CreateMovieDto) {
    // Check for an existing movie with the same title and release_date
    const existingMovie = await this.movies().findOne({
      title: movie.title,
      release_date: movie.release_date,
    });

    if (existingMovie) {
      throw new Error('Movie already exists');
    }

    const document: IFilm = { ...movie, _id: new ObjectId() };
    await this.movies().insertOne(document);
    return document;
  }

  public async updateMovie(
    movieId: string,
    updatedMovie: UpdateMovieDto,
  ): Promise<IFilm | null> {
    const objectId = new ObjectId(movieId);

    const existingMovie = await this.movies().findOne({ _id: objectId });
    if (!existingMovie) {
      return null; // Movie not found
    }
    if (updatedMovie.isBookmarked !== undefined) {
      existingMovie.isBookmarked = updatedMovie.isBookmarked;
    }
    if (updatedMovie.release_date !== undefined) {
      existingMovie.release_date = updatedMovie.release_date;
    }
    // Perform the update operation
    await this.movies().updateOne({ _id: objectId }, { $set: existingMovie });
    return existingMovie;
  }
}
