import { WatchContext } from '@/context/watch-context'
import { dbFocusData } from '@/data/movies-id'
import { WATCH_ROUTE } from '@/router/path-routes'
import { fetchOneOmbdapi } from '@/services/fetch-omdbapi'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

export function useSlideEmphasisMovies() {
  const { state, handleAddIndex, handleAddIDBMID } = useContext(WatchContext)
  const mainMoviesIds = dbFocusData[state?.index || 0].imdbid
  const { data, isError, isLoading } = useQuery({
    queryKey: ['movie', mainMoviesIds],
    queryFn: async () => {
      return await fetchOneOmbdapi({ id: mainMoviesIds })
    },
  })
  const navigate = useNavigate()

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

  function handleClickedPlayOnMovie({ id }: { id: string }) {
    handleAddIDBMID({ imdbID: id })
    navigate(WATCH_ROUTE.replace(':id', id))
  }

  return {
    handleClickedPlayOnMovie,
    handlePassToPreviousMovieSeries,
    handlePassToNextMovieSeries,
    data,
    isError,
    isLoading,
    state,
  }
}
