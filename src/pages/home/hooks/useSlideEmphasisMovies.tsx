import { WatchContext } from '@/contexts/watch-context'
import { dbFocusData } from '@/data/movies-id'
import { fetchOneOmbdapi } from '@/services/fetch-omdbapi'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { useRoutes } from '@/hooks/useRoutes'

export function useSlideEmphasisMovies() {
  const { state, handleAddIndex, handleAddIDBMID } = useContext(WatchContext)
  const mainMoviesIds = dbFocusData[state?.index || 0].imdbid
  const { data, isError, isLoading } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ['movie', mainMoviesIds],
    queryFn: async () => {
      return await fetchOneOmbdapi({ id: mainMoviesIds })
    },
  })
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
    data,
    isError,
    isLoading,
    state,
  }
}
