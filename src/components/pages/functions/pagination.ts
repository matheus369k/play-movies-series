import { TStateDataMoviesSeries } from "../../../types"

interface TPageDataContext {
    dataMoviesSeries?: TStateDataMoviesSeries
    setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries>>
}

export function handlePassToNextPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, loading: "loading", currentPage: (dataMoviesSeries?.currentPage || 1) + 1 })
    }
}

export function handlePassToEndPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, loading: "loading", currentPage: (dataMoviesSeries?.totalPages || 1) })
    }
}

export function handlePassToPreviousPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, loading: "loading", currentPage: (dataMoviesSeries?.currentPage || 1) - 1 })
    }
}

export function handlePassToStartPage({ setDataMoviesSeries, dataMoviesSeries }: TPageDataContext) {
    if (setDataMoviesSeries) {
        setDataMoviesSeries({ ...dataMoviesSeries, loading: "loading", currentPage: 1 })
    }
}