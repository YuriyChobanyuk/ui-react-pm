import { ShowType } from './show.interface';

export interface OmdbSearchData {
  title: string;
  year: string;
  imdbId: string;
  type: ShowType;
}

export interface OmdbSearchQuery {
  // search value
  s: string;
  type?: ShowType;
  page?: number;
  // year
  y?: string;
}

export interface OmdbDetailsQuery {
  // imdb id
  i: string;
  // show title
  t?: string;
  type?: ShowType;
  // year
  y?: string;
}
