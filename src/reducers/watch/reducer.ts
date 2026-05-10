import type { ReducerStateType } from '@/contexts/watch-context'
import { ReducerCases } from './action-types'

type ReducerActionType =
  | { type: 'reset/data' }
  | {
      type: 'add/imdbID'
      payload: {
        imdbID: string
      }
    }
  | {
      type: 'add/index'
      payload: {
        index: number
      }
    }

export const reducer = (
  state: ReducerStateType,
  action: ReducerActionType,
): ReducerStateType => {
  switch (action.type) {
    case ReducerCases.RESET_DATA:
      return {
        ...state,
        imdbID: '',
        index: 0,
      }
    case ReducerCases.ADD_IDBM_ID:
      const imdbID =  action.payload.imdbID || ''  

      return {
        ...state,
        index: 0,
        imdbID,
      }
    case ReducerCases.ADD_INDEX:
      const index = action.payload.index || 0;
      return {
        ...state,
        index,
      }
    default:
      return state
  }
}

export const handleInitialReducer = (state: ReducerStateType) => {
  const url = new URL(window.location.toString())
  const imdbID = url.pathname.split('/watch/')[1]

  if (imdbID) {
    return {
      ...state,
      imdbID,
    }
  }

  return state
}
