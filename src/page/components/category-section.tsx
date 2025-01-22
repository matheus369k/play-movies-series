import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonPlay } from "./button-play";
import { Loading } from "./loading";
import { Error } from "./error";
import { handleGetIdMovie } from "../functions/get-id-movies";
import {
  PaginationContext,
  ReduceStateType as ReducePaginationStateType,
} from "../../context/pagination-context";
import { WatchContext } from "../../context/watch-context";
import { CategorySectionHeader } from "./category-section-header";

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
  const { handleAddData } = useContext(PaginationContext);
  const { handleAddIDBMID } = useContext(WatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `https://www.omdbapi.com/?apikey=d074a25e&s=all&plot=full&y=${year}&type=${type}&page=${page}`;

    axios
      .get(url)
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
    <div className="max-w-7xl mx-auto h-fit w-full px-6 m-6 max-lg:m-0 max-xl:px-2">
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

      {state.loading === "finnish" && (
        <ul
          data-testid="category-section-movies"
          className="flex gap-6 px-10 w-full max-xl:gap-2 max-xl:px-5 max-sm:px-2"
        >
          {state.data?.slice(0, 6).map((MovieSeries, index) => (
            <li
              data-testid="category-section-movie-play"
              onClick={() =>
                handleGetIdMovie(
                  MovieSeries.imdbID,
                  handleAddIDBMID,
                  navigate,
                  handleAddData,
                  state
                )
              }
              key={"release-id-" + MovieSeries.imdbID}
              className={`relative bg-black/50 rounded-md border border-gray-100 w-max z-40 cursor-pointer group/play ${
                index === 3 && "max-sm:hidden"
              } ${index === 4 && "max-lg:hidden"}`}
            >
              <div>
                <img
                  src={MovieSeries.Poster}
                  className="w-full h-full max-h-64 max-w-44 object-cover transition-all opacity-100 group-hover/play:opacity-40"
                  alt={MovieSeries.Type + ": " + MovieSeries.Title}
                />
                <ButtonPlay />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
