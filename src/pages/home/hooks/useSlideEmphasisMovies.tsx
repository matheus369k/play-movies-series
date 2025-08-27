import { WatchContext } from '@/contexts/watch-context'
import { dbFocusData } from '@/data/movies-id'
import { REGISTER_USER } from '@/util/consts'
import { fetchOneOmbdapi } from '@/services/fetch-omdbapi'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { useRoutes } from '@/hooks/useRoutes'
import { UserContext } from '@/contexts/user-context'

export function useSlideEmphasisMovies() {
  const { state, handleAddIndex, handleAddIDBMID } = useContext(WatchContext)
  const { user } = useContext(UserContext)
  const mainMoviesIds = dbFocusData[state?.index || 0].imdbid
  const { data, isError, isLoading } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ['movie', mainMoviesIds],
    queryFn: async () => {
      return await fetchOneOmbdapi({ id: mainMoviesIds })
    },
  })
  const { NavigateToWatchPage } = useRoutes()

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
    if (!user) return <Navigate to={REGISTER_USER} />

    handleAddIDBMID({ imdbID: id })
    NavigateToWatchPage({ movieId: id, userId: user.id })
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
