import { useEffect, useReducer } from "react";
import { Loading } from "./loading";
import { Error } from "./error";
import { ReduceStateType as ReducePaginationStateType } from "../../context/pagination-context";
import { CategorySectionHeader } from "./category-section-header";
import { MovieCard } from "./movie-card";
import { MoviesCarouselProvider } from "./movies-carousel";
import { AxiosOmbdapi } from "@/util/axios-omdbapi";

interface PropsSectionMovieAndSeries {
  type: string;
  page: number;
  title: string;
  year: number;
}

export type ReducerStateType = Pick<
  ReducePaginationStateType,
  "data" | "loading"
>;

const ReducerCases = {
  COMPLETE_RESPONSE: "complete/response",
  ERROR_RESPONSE: "error/response",
  LOADING_RESPONSE: "loading/response",
};
const reducer = (
  state: ReducerStateType,
  action: {
    type: string;
    payload?: Omit<ReducerStateType, "loading">;
  }
): ReducerStateType => {
  switch (action.type) {
    case ReducerCases.LOADING_RESPONSE:
      return {
        ...state,
        loading: "loading",
      };
    case ReducerCases.COMPLETE_RESPONSE:
      return {
        ...state,
        loading: "finnish",
        data: action.payload?.data,
      };
    case ReducerCases.ERROR_RESPONSE:
      return {
        ...state,
        loading: "error",
      };
    default:
      return state;
  }
};

export function CategorySection({
  type,
  page,
  title,
  year,
}: PropsSectionMovieAndSeries) {
  const [state, dispatch] = useReducer(reducer, { loading: "loading" });

  useEffect(() => {
    const params = `?s=all&plot=full&y=${year}&type=${type}&page=${page}`;

    AxiosOmbdapi.get(params)
      .then((resp) => {
        dispatch({
          type: ReducerCases.COMPLETE_RESPONSE,
          payload: { data: resp.data.Search },
        });
      })
      .catch(() => {
        dispatch({ type: ReducerCases.ERROR_RESPONSE });
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto h-fit w-full py-4">
      <CategorySectionHeader
        title={title}
        type={type}
        page={page}
        year={year}
        state={state}
      />

      {state.loading === "loading" && (
        <Loading message="Carregando" styles="py-16" />
      )}

      {state.loading === "error" && (
        <Error message="Error ao tentar carregar" styles="py-16" />
      )}

      {state?.data && (
        <MoviesCarouselProvider>
          {state.data.map((MovieSeries) => {
            return (
              <MovieCard key={MovieSeries.imdbID} {...MovieSeries} onlyImage />
            );
          })}
        </MoviesCarouselProvider>
      )}
    </div>
  );
}
