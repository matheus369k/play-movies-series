import type { ReducerStateType } from '@/context/watch-context'
import { ReducerCases } from './action-types'

interface ReducerActionType {
  type: string
  payload?: {
    imdbID?: string
    index?: number
    loading?: 'loading' | 'finnish' | 'error'
  }
}

export const reducer = (
  state: ReducerStateType,
  action: ReducerActionType
): ReducerStateType => {
  switch (action.type) {
    case ReducerCases.RESET_DATA:
      return {
        ...state,
        imdbID: '',
        index: 0,
      }
    case ReducerCases.ADD_IDBM_ID:
      return {
        ...state,
        index: 0,
        imdbID: action.payload?.imdbID || '',
      }
    case ReducerCases.ADD_INDEX:
      return {
        ...state,
        index: action.payload?.index || 0,
      }
    default:
      return state
  }
}

export const handleInitialReducer = (state: ReducerStateType) => {
  const url = new URL(window.location.toString())
  const id = url.pathname.split('/')[3]

  if (id) {
    return {
      ...state,
      imdbID: id,
    }
  }

  return state
}
