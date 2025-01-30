import { createContext, useReducer } from "react";

export interface ReducerDataStateType {
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  Ratings?: { Source: string; Value: string }[];
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  Type?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  totalSeasons?: string;
  Website?: string;
  Response?: string;
}

export interface ReducerStateType {
  data: ReducerDataStateType;
  imdbID: string;
  index: number;
  loading: "loading" | "finnish" | "error";
}

interface ReducerActionType {
  type: string;
  payload?: {
    data?: {
      Title?: string;
      Year?: string;
      Rated?: string;
      Released?: string;
      Runtime?: string;
      Genre?: string;
      Director?: string;
      Writer?: string;
      Actors?: string;
      Plot?: string;
      Language?: string;
      Country?: string;
      Awards?: string;
      Poster?: string;
      Ratings?: { Source: string; Value: string }[];
      Metascore?: string;
      imdbRating?: string;
      imdbVotes?: string;
      imdbID?: string;
      Type?: string;
      DVD?: string;
      BoxOffice?: string;
      Production?: string;
      totalSeasons?: string;
      Website?: string;
      Response?: string;
    };
    imdbID?: string;
    index?: number;
    loading?: "loading" | "finnish" | "error";
  };
}

interface ContextMovieWatchType {
  state: ReducerStateType;
  handleResetData: () => void;
  handleAddIDBMID: ({ imdbID }: Pick<ReducerStateType, "imdbID">) => void;
  handleAddIndex: ({ index }: Pick<ReducerStateType, "index">) => void;
  handleCompleteResponseData: ({
    data,
    imdbID,
  }: Pick<ReducerStateType, "data" | "imdbID">) => void;
  handleErrorResponseData: ()=> void;
}

const ReducerCases = {
  RESET_DATA: "reset/data",
  ADD_IDBM_ID: "add/imdbID",
  ADD_INDEX: "add/index",
  COMPLETE_RESPONSE_DATA: "complete/response/data",
  ERROR_RESPONSE_DATA: "error/response/data",
};

const reducer = (
  state: ReducerStateType,
  action: ReducerActionType
): ReducerStateType => {
  switch (action.type) {
    case ReducerCases.RESET_DATA:
      return {
        ...state,
        imdbID: "",
        data: {},
        index: 0,
        loading: "loading",
      };
    case ReducerCases.ADD_IDBM_ID:
      return {
        ...state,
        data: {},
        index: 0,
        loading: "loading",
        imdbID: action.payload?.imdbID || "",
      };
    case ReducerCases.ADD_INDEX:
      return {
        ...state,
        loading: "loading",
        index: action.payload?.index || 0,
      };
    case ReducerCases.COMPLETE_RESPONSE_DATA:
      return {
        ...state,
        imdbID: action.payload?.imdbID || "",
        data: action.payload?.data || {},
        loading: "finnish",
      };
    case ReducerCases.ERROR_RESPONSE_DATA:
        return {
          ...state,
          loading: "error",
        };
    default:
      return state;
  }
};

const handleInitialReducer = (state: ReducerStateType) => {
  const url = new URL(window.location.toString());
  if (url.searchParams.has("id")) {
    return {
      ...state,
      imdbID: url.searchParams.get("id") || "",
    };
  }

  return state;
};

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
      loading: "loading",
      index: 0,
      data: {},
    },
    handleInitialReducer
  );

  function handleResetData() {
    dispatch({ type: ReducerCases.RESET_DATA });
  }

  function handleAddIDBMID({ imdbID }: Pick<ReducerStateType, "imdbID">) {
    dispatch({ type: ReducerCases.ADD_IDBM_ID, payload: { imdbID } });
  }

  function handleAddIndex({ index }: Pick<ReducerStateType, "index">) {
    dispatch({ type: ReducerCases.ADD_INDEX, payload: { index } });
  }

  function handleCompleteResponseData({
    data,
    imdbID,
  }: Pick<ReducerStateType, "data" | "imdbID">) {
    dispatch({
      type: ReducerCases.COMPLETE_RESPONSE_DATA,
      payload: { data, imdbID },
    });
  }

  function handleErrorResponseData() {
    dispatch({ type: ReducerCases.ERROR_RESPONSE_DATA });
  }

  return (
    <WatchContext.Provider
      value={{
        state,
        handleResetData,
        handleAddIDBMID,
        handleAddIndex,
        handleCompleteResponseData,
        handleErrorResponseData
      }}
    >
      {children}
    </WatchContext.Provider>
  );
}
