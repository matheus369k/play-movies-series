export interface FMoviesSeriesInFocus {
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

export interface TStateDataMoviesSeries {
    data?: TMoviesSeries[]
    title?: string
    totalPages?: number
    currentPage?: number
    type?: string
    year?: number
}