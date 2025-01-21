import React from "react";
import { NavigateFunction } from "react-router";
import { resetScroll } from "../../functions/reset-scroll";
import { TMovieWatch } from "../../../types";
import { ReduceStateType } from "@/context/pagination-context";
import { WATCH_ROUTE } from "@/router/path-routes";

export function handleGetIdMovie(
  id: string | undefined,
  setMovieWatch: React.Dispatch<React.SetStateAction<TMovieWatch>> | undefined,
  navigate: NavigateFunction,
  handleAddData?: ({ data }: Pick<ReduceStateType, "data">) => void,
  response?: Pick<ReduceStateType, "data">
) {
  const input = document.querySelector("[name='search']") as HTMLFormElement;

  if (input) input.value = "";

  if (setMovieWatch && id) {
    setMovieWatch({
      data: {},
      index: 0,
      loading: "loading",
      imdbID: id,
    });
  }

  if (handleAddData && response) {
    handleAddData({
      data: response.data,
    });
  }

  resetScroll();

  navigate(WATCH_ROUTE);
}
