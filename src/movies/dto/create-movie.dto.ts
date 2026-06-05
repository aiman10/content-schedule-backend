import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * Whitelisted shape for POST /movies. The global ValidationPipe strips any
 * property not declared here, so arbitrary/object payloads (e.g. NoSQL
 * operators) can't reach Mongo.
 */
export class CreateMovieDto {
  @IsBoolean()
  adult: boolean;

  @IsOptional()
  @IsString()
  backdrop_path?: string;

  @IsArray()
  @IsInt({ each: true })
  genre_ids: number[];

  @IsInt()
  id: number;

  @IsString()
  original_language: string;

  @IsString()
  original_title: string;

  @IsString()
  overview: string;

  @IsNumber()
  popularity: number;

  @IsString()
  poster_path: string;

  @IsString()
  release_date: string;

  @IsString()
  title: string;

  @IsBoolean()
  video: boolean;

  @IsNumber()
  vote_average: number;

  @IsInt()
  vote_count: number;

  @IsOptional()
  @IsBoolean()
  isBookmarked?: boolean;
}
