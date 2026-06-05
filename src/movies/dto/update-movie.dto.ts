import { IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * PUT /movies/:id only ever changes the bookmark flag and release date,
 * so those are the only fields accepted. Everything else is stripped.
 */
export class UpdateMovieDto {
  @IsOptional()
  @IsBoolean()
  isBookmarked?: boolean;

  @IsOptional()
  @IsString()
  release_date?: string;
}
