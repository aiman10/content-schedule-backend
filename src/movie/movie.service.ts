import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { IFilm } from 'src/type';
import { ObjectId } from 'mongodb';

const url =
  'mongodb+srv://Admin:admin@webframeworkscluster.0dkna9w.mongodb.net/test';

@Injectable()
export class MovieService {
  private client = new MongoClient(url);

  constructor() {}

  onModuleInit() {
    this.client.connect();
  }

  onModuleDestroy() {
    this.client.close();
  }
  public async getMovieById(movieId: string): Promise<IFilm> {
    const objectId = new ObjectId(movieId);
    const movie = await this.client
      .db('ContentCalender')
      .collection('movies')
      .findOne<IFilm>({ _id: objectId });
    return movie;
  }

  //get movie by name
  public async getMovieByName(movieName: string): Promise<IFilm> {
    const movie = await this.client
      .db('ContentCalender')
      .collection('movies')
      .findOne<IFilm>({ title: movieName });
    return movie;
  }

  public async getAllMovies() {
    let movie = await this.client
      .db('ContentCalender')
      .collection('movies')
      .find<IFilm>({})
      .toArray();
    return movie;
  }

  public async addMovie(movie: IFilm) {
    // Check for an existing movie with the same title and release_date
    const existingMovie = await this.client
      .db('ContentCalender')
      .collection('movies')
      .findOne({ title: movie.title, release_date: movie.release_date });

    if (existingMovie) {
      throw new Error('Movie already exists');
    }

    const _id = new ObjectId();
    movie._id = _id;
    await this.client
      .db('ContentCalender')
      .collection('movies')
      .insertOne(movie);
    return movie;
  }

  public async updateMovie(
    movieId: string,
    updatedMovie: IFilm,
  ): Promise<IFilm | null> {
    const objectId = new ObjectId(movieId);

    const existingMovie = await this.client
      .db('ContentCalender')
      .collection('movies')
      .findOne<IFilm>({ _id: objectId });
    if (!existingMovie) {
      return null; // Movie not found
    }
    existingMovie.isBookmarked = updatedMovie.isBookmarked;
    existingMovie.release_date = updatedMovie.release_date;
    // Perform the update operation
    await this.client
      .db('ContentCalender')
      .collection('movies')
      .updateOne({ _id: objectId }, { $set: existingMovie });
    return existingMovie;
  }
}
