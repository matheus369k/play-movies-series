import { TStateDataMoviesSeries } from "../../../types"

interface TPageDataContext {
    dataMoviesSeries?: TStateDataMoviesSeries
    setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries>>
}

export function passToNextPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, loading: "loading", currentPage: (dataMoviesSeries?.currentPage || 1) + 1 })
    }
}

export function passToEndPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, loading: "loading", currentPage: (dataMoviesSeries?.totalPages || 1) })
    }
}

export function passToPreviousPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, loading: "loading", currentPage: (dataMoviesSeries?.currentPage || 1) - 1 })
    }
}

export function passToStartPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, loading: "loading", currentPage: 1 })
    }
}