import {
  removeParamsAtUrl,
  setParamsAtUrl,
} from "@/page/functions/add-url-params";
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

// Reducer types
export interface ReducerStateType {
  imdbID: string;
  index: number;
}

interface ReducerActionType {
  type: string;
  payload?: {
    imdbID?: string;
    index?: number;
    loading?: "loading" | "finnish" | "error";
  };
}

// Context types
interface ContextMovieWatchType {
  state: ReducerStateType;
  handleResetData: () => void;
  handleAddIDBMID: ({ imdbID }: Pick<ReducerStateType, "imdbID">) => void;
  handleAddIndex: ({ index }: Pick<ReducerStateType, "index">) => void;
}

// Possiveis ações do reducer
const ReducerCases = {
  RESET_DATA: "reset/data",
  ADD_IDBM_ID: "add/imdbID",
  ADD_INDEX: "add/index",
};

// Função que direciona para a ação escolhida
const reducer = (
  state: ReducerStateType,
  action: ReducerActionType
): ReducerStateType => {
  switch (action.type) {
    // resetar os dados para o valor padrãp
    case ReducerCases.RESET_DATA:
      return {
        ...state,
        imdbID: "",
        index: 0,
      };
    // Setar o id do filme seleciona
    case ReducerCases.ADD_IDBM_ID:
      return {
        ...state,
        index: 0,
        imdbID: action.payload?.imdbID || "",
      };
    // Atualizar o index, relacionado a paginação do filmes em destaque
    case ReducerCases.ADD_INDEX:
      return {
        ...state,
        index: action.payload?.index || 0,
      };
    // Retornar valor padrão
    default:
      return state;
  }
};

// Setar o valor inicial do reducer
const handleInitialReducer = (state: ReducerStateType) => {
  const url = new URL(window.location.toString());

  // Verificar se ha um query parametro id na url
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
      index: 0,
    },
    handleInitialReducer
  );

  function handleResetData() {
    dispatch({ type: ReducerCases.RESET_DATA });
    removeParamsAtUrl("id");
  }

  function handleAddIDBMID({ imdbID }: Pick<ReducerStateType, "imdbID">) {
    dispatch({ type: ReducerCases.ADD_IDBM_ID, payload: { imdbID } });
    setParamsAtUrl("id", imdbID);
  }

  function handleAddIndex({ index }: Pick<ReducerStateType, "index">) {
    dispatch({ type: ReducerCases.ADD_INDEX, payload: { index } });
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
