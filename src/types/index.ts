export interface TMovieAllInfo{
    Title?: string
    Year?: string
    Rated?: string
    Released?: string
    Runtime?: string
    Genre?: string
    Director?: string
    Writer?: string
    Actors?: string
    Plot?: string
    Language?: string
    Country?: string
    Awards?: string
    Poster?: string
    Ratings?: { Source: string, Value: string }[]
    Metascore?: string
    imdbRating?: string
    imdbVotes?: string
    imdbID?: string
    Type?: string
    DVD?: string
    BoxOffice?: string
    Production?: string
    totalSeasons?: string
    Website?: string
    Response?: string
}

export interface TMovieInfo {
    Poster: string
    Title: string
    Type: string
    Year: string
    imdbID: string
}

export interface TMovieWatch {
  data: TMovieAllInfo
  imdbID: string
  index: number
  loading: "loading" | "finnish" | "error"
}

export interface TMoviesInfoWithPagination extends TResponse{
  totalPages?: number
  currentPage?: number
  title?: string
  type?: string
  year?: number
}

export interface TStateMoviesInfoWithPagination {
  moviesInfoWithPagination?: TMoviesInfoWithPagination
  setMoviesInfoWithPagination?: React.Dispatch<React.SetStateAction<TMoviesInfoWithPagination>>
}

export interface TStateMovieAllInfo {
  movieWatch?: TMovieWatch
  setMovieWatch?: React.Dispatch<React.SetStateAction<TMovieWatch>>
}

export interface TResponse{
  data?: TMovieInfo[]
  loading: "loading" | "finnish" | "error"
}