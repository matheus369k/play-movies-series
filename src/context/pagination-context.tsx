import { createContext, useReducer } from "react";
import { MORE_ROUTE, SEARCH_ROUTE } from "@/router/path-routes";

interface ContextPaginationType {
  state: ReduceStateType;
  handleRemoveData: () => void;
  handleAddSearchTitle: ({ title }: Pick<ReduceStateType, "title">) => void;
  handleGetMovies: ({
    currentPage,
    title,
    data,
    type,
    year,
  }: Omit<ReduceStateType, "totalPages">) => void;
  handleAddData: ({ data }: Pick<ReduceStateType, "data">) => void;
  handleCompleteResponseData: ({
    data,
    totalPages,
  }: Pick<ReduceStateType, "data" | "totalPages">) => void;
  handleErrorResponseData: () => void
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleStartPage: () => void;
  handleLastPage: () => void;
}

export interface ReducerStateDataType {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

export interface ReduceStateType {
  data?: ReducerStateDataType[];
  title: string;
  totalPages: number;
  currentPage: number;
  loading: "loading" | "finnish" | "error";
  type?: string;
  year?: number;
}

interface ReducerActionType {
  type: string;
  payload?: {
    data?: ReducerStateDataType[];
    title?: string;
    totalPages?: number;
    currentPage?: number;
    type?: string;
    year?: number;
    loading?: "loading" | "finnish" | "error";
  };
}

export const PaginationContext = createContext({} as ContextPaginationType);

const ReducerCases = {
  REMOVE_DATA: "remove/data",
  ADD_TITLE: "add/title",
  GET_MOVIES: "get/movies",
  ADD_DATA: "add/data",
  NEXT_PAGE: "next/page",
  PREV_PAGE: "prev/page",
  START_PAGE: "start/page",
  LAST_PAGE: "last/page",
  COMPLETE_RESPONSE_DATA: "complete/response/data",
  ERROR_RESPONSE_DATA: "error/response/data",
};

const reducer = (
  state: ReduceStateType,
  action: ReducerActionType
): ReduceStateType => {
  switch (action.type) {
    case ReducerCases.REMOVE_DATA:
      return {
        ...state,
        loading: "loading",
        data: undefined,
      };
    case ReducerCases.ADD_TITLE:
      if (!action.payload?.title) return state;

      return {
        ...state,
        loading: "loading",
        currentPage: 1,
        title: action.payload.title,
      };
    case ReducerCases.GET_MOVIES:
      return {
        ...state,
        data: action.payload?.data,
        currentPage: action.payload?.currentPage || 1,
        type: action.payload?.type,
        year: action.payload?.year,
        title: action.payload?.title || "all",
        loading: "loading",
        totalPages: 1,
      };
    case ReducerCases.ADD_DATA:
      return {
        ...state,
        data: action.payload?.data,
      };
    case ReducerCases.NEXT_PAGE:
      return {
        ...state,
        loading: "loading",
        currentPage: state.currentPage + 1,
      };
    case ReducerCases.PREV_PAGE:
      return {
        ...state,
        loading: "loading",
        currentPage: state.currentPage - 1,
      };
    case ReducerCases.START_PAGE:
      return {
        ...state,
        loading: "loading",
        currentPage: 1,
      };
    case ReducerCases.LAST_PAGE:
      return {
        ...state,
        loading: "loading",
        currentPage: state.totalPages,
      };
    case ReducerCases.COMPLETE_RESPONSE_DATA:
      return {
        ...state,
        loading: "finnish",
        data: action.payload?.data,
        totalPages: action.payload?.totalPages || 1,
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

const handleInitialReducer = (state: ReduceStateType) => {
  const url = new URL(window.location.toString());
  const pathName = window.location.pathname;

  function getUrlParams(url: URL, nameParams: string) {
    return url.searchParams.get(nameParams);
  }

  if (pathName === SEARCH_ROUTE && url.searchParams.has("search")) {
    return {
      ...state,
      title: getUrlParams(url, "search")?.replace("+", " ") || "all",
      currentPage: parseInt(getUrlParams(url, "page") || "1"),
    };
  }
  if (pathName === MORE_ROUTE) {
    return {
      ...state,
      title: getUrlParams(url, "title")?.replace("+", " ") || "Todos",
      currentPage: parseInt(getUrlParams(url, "page") || "1"),
      type: getUrlParams(url, "type") || "",
      year: parseInt(getUrlParams(url, "year") || "1999"),
    };
  }

  return state;
};

export function PaginationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    reducer,
    {
      title: "all",
      totalPages: 1,
      currentPage: 1,
      loading: "loading",
    },
    handleInitialReducer
  );

  function handleRemoveData() {
    dispatch({ type: ReducerCases.REMOVE_DATA });
  }

  function handleAddSearchTitle({ title }: Pick<ReduceStateType, "title">) {
    dispatch({ type: ReducerCases.ADD_TITLE, payload: { title: title } });
  }

  function handleGetMovies({
    currentPage,
    loading,
    title,
    data,
    type,
    year,
  }: Omit<ReduceStateType, "totalPages">) {
    dispatch({
      type: ReducerCases.GET_MOVIES,
      payload: {
        data,
        loading,
        currentPage,
        title,
        type,
        year,
      },
    });
  }

  function handleAddData({ data }: Pick<ReduceStateType, "data">) {
    dispatch({ type: ReducerCases.ADD_DATA, payload: { data } });
  }

  function handleNextPage() {
    dispatch({ type: ReducerCases.NEXT_PAGE });
  }

  function handlePrevPage() {
    dispatch({ type: ReducerCases.PREV_PAGE });
  }

  function handleStartPage() {
    dispatch({ type: ReducerCases.START_PAGE });
  }

  function handleLastPage() {
    dispatch({ type: ReducerCases.LAST_PAGE });
  }

  function handleCompleteResponseData({
    data,
    totalPages,
  }: Pick<ReduceStateType, "data" | "totalPages">) {
    dispatch({
      type: ReducerCases.COMPLETE_RESPONSE_DATA,
      payload: { data, totalPages },
    });
  }

  function handleErrorResponseData() {
    dispatch({ type: ReducerCases.ERROR_RESPONSE_DATA });
  }

  return (
    <PaginationContext.Provider
      value={{
        state,
        handleRemoveData,
        handleAddSearchTitle,
        handleGetMovies,
        handleAddData,
        handleNextPage,
        handlePrevPage,
        handleStartPage,
        handleLastPage,
        handleCompleteResponseData,
        handleErrorResponseData,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
}
