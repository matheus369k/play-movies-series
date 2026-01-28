import { WatchContext } from '@/contexts/watch-context'
import { dbFocusData } from '@/data/movies-id'
import { useContext } from 'react'
import { useRoutes } from '@/hooks/useRoutes'
import { useGetMovieOmbdapi } from '@/services/use-get-movie'

export function useSlideEmphasisMovies() {
  const { state, handleAddIndex, handleAddIDBMID } = useContext(WatchContext)
  const mainMoviesIds = dbFocusData[state?.index || 0].imdbid
  const { data, isError, isLoading } = useGetMovieOmbdapi(mainMoviesIds)
  const route = useRoutes()

  function handlePassToNextMovieSeries() {
    if (state === undefined) return

    handleAddIndex({
      index: Number(state.index || 0) + 1,
    })
  }

  function handlePassToPreviousMovieSeries() {
    if (state === undefined) return

    handleAddIndex({
      index: Number(state.index || 0) - 1,
    })
  }

  function handlePassToMovieSeries(index: number) {
    handleAddIndex({
      index: Number(index),
    })
  }

  function handleClickedPlayOnMovie({ id }: { id: string }) {
    handleAddIDBMID({ imdbID: id })
    route.NavigateToWatchPage({ movieId: id })
  }

  return {
    handleClickedPlayOnMovie,
    handlePassToPreviousMovieSeries,
    handlePassToNextMovieSeries,
    handlePassToMovieSeries,
    isLoading,
    isError,
    state,
    data,
  }
}
