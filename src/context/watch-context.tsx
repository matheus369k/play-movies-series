import { ReducerCases as WatchCases } from "@/reducers/watch/action-types";
import { handleInitialReducer, reducer } from "@/reducers/watch/reducer";
import { createContext, useReducer } from "react";

// Reducer types
export interface ReducerStateType {
  imdbID: string;
  index: number;
}

// Context types
interface ContextMovieWatchType {
  state: ReducerStateType;
  handleResetData: () => void;
  handleAddIDBMID: ({ imdbID }: Pick<ReducerStateType, "imdbID">) => void;
  handleAddIndex: ({ index }: Pick<ReducerStateType, "index">) => void;
}

export const WatchContext = createContext({} as ContextMovieWatchType);

export function WatchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    reducer,
    {
      imdbID: "",
      index: 0,
    },
    handleInitialReducer
  );

  function handleResetData() {
    dispatch({ type: WatchCases.RESET_DATA });
  }

  function handleAddIDBMID({ imdbID }: Pick<ReducerStateType, "imdbID">) {
    dispatch({ type: WatchCases.ADD_IDBM_ID, payload: { imdbID } });
  }

  function handleAddIndex({ index }: Pick<ReducerStateType, "index">) {
    dispatch({ type: WatchCases.ADD_INDEX, payload: { index } });
  }

  return (
    <WatchContext.Provider
      value={{
        state,
        handleResetData,
        handleAddIDBMID,
        handleAddIndex,
      }}
    >
      {children}
    </WatchContext.Provider>
  );
}
