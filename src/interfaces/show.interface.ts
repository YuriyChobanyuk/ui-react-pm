export enum ShowType {
  MOVIE = 'movie',
  SERIES = 'series',
  EPISODE = 'episode',
  GAME = 'game',
}

export interface ShowData {
  title: string;
  year: string;
  released: Date;
  genre: string[];
  director: string;
  actors: string[];
  poster: string;
  imdbRating: number;
  imdbId: string;
  type: ShowType;
  totalSeasons?: number;
  stats: string;
}
