import { ObjectId } from 'mongodb';

export interface IFilm {
  _id: ObjectId;
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  isBookmarked?: boolean;
}

export interface CastCrew {
  _id: ObjectId;
  Title: string;
  Title_URL: string;
  Image: string;
  Birthday: string;
}

export interface Award {
  name: string;
  date: string;
  imdb: string;
  url: string;
}
