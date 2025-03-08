import type { ReducerStateType } from "@/context/watch-context";
import { ReducerCases } from "./action-types";

interface ReducerActionType {
  type: string;
  payload?: {
    imdbID?: string;
    index?: number;
    loading?: "loading" | "finnish" | "error";
  };
}

// Função que direciona para a ação escolhida
export const reducer = (
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
export const handleInitialReducer = (state: ReducerStateType) => {
  const url = new URL(window.location.toString());
  const id = url.pathname.split("/")[3];

  // Verificar se ha um query parametro id na url
  if (id) {
    return {
      ...state,
      imdbID: id,
    };
  }

  return state;
};
