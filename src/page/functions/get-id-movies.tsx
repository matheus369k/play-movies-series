import { NavigateFunction } from "react-router";
import { resetScroll } from "../../components/functions/reset-scroll";
import { ReduceStateType as ReducerPaginationStateType } from "@/context/pagination-context";
import { ReducerStateType as ReducerWatchStateType } from "@/context/watch-context";
import { WATCH_ROUTE } from "@/router/path-routes";

export function handleGetIdMovie(
  id: string | undefined,
  handleAddIDBMID: ({ imdbID }: Pick<ReducerWatchStateType, "imdbID">) => void,
  navigate: NavigateFunction,
  handleAddData?: ({ data }: Pick<ReducerPaginationStateType, "data">) => void,
  response?: Pick<ReducerPaginationStateType, "data">
) {
  const input = document.querySelector("[name='search']") as HTMLFormElement;

  if (input) input.value = "";

  if (id) {
    handleAddIDBMID({ imdbID: id });
  }

  if (handleAddData && response) {
    handleAddData({ data: response.data });
  }

  resetScroll();

  navigate(WATCH_ROUTE);
}
