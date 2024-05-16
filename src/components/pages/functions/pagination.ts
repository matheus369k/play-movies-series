interface TMoviesSeries {
    Poster: string
    Title: string
    Type: string
    Year: string
    imdbID: string
}

interface TStateDataMoviesSeries {
    data?: TMoviesSeries[]
    title?: string
    totalPages?: number
    currentPage?: number
    type?: string
    year?: number
}

interface TPageDataContext {
    dataMoviesSeries?: TStateDataMoviesSeries
    setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries>>
}

export function passToNextPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, currentPage: (dataMoviesSeries?.currentPage || 1) + 1 })
    }
}

export function passToEndPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, currentPage: (dataMoviesSeries?.totalPages || 1) })
    }
}

export function passToPreviousPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, currentPage: (dataMoviesSeries?.currentPage || 1) - 1 })
    }
}

export function passToStartPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, currentPage: 1 })
    }
}