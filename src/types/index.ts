export interface TMoviesSeriesInFocus {
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
    index?: number
}

export interface TMoviesSeries {
    Poster: string
    Title: string
    Type: string
    Year: string
    imdbID: string
}

export interface TStateDataMoviesSeries extends TResponse{
  data?: TMoviesSeries[]
  title?: string
  totalPages?: number
  currentPage?: number
  type?: string
  year?: number
}

export interface TPageDataContext {
  dataMoviesSeries?: TStateDataMoviesSeries
  setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries>>
}

export interface TIdContext {
  imdbID?: string | null
  setImdbID?: React.Dispatch<React.SetStateAction<string | null>>
}

export interface TResponse{
  data?: TMoviesSeries[]
  loading: "loading" | "finnish" | "error"
}