import axios from "axios";
import React, { useContext, useEffect } from "react";
import { TMovieWatch } from "../../../types";
import { setParamsAtUrl } from "../functions/add-url-params";
import { PaginationContext } from "@/context/pagination-context";

export function FeatchApiPagination(url: string, paramsName?: string) {
  const { state, handleCompleteResponseData, handleErrorResponseData } =
    useContext(PaginationContext);

  useEffect(() => {
    axios
      .get(url)
      .then((resp) => {
        if (resp.data.Search === undefined) {
          throw new Error("database not found");
        }

        handleCompleteResponseData({
          data: resp.data.Search,
          totalPages: Math.round(parseInt(resp.data.totalResults) / 10),
        });

        setParamsAtUrl("page", state?.currentPage || 1);
      })
      .catch(() => {
        handleErrorResponseData();
      });

    if (
      state?.title === undefined ||
      state?.title === "" ||
      paramsName === undefined
    )
      return;

    setParamsAtUrl(paramsName, state.title);
  }, [state?.title, state?.currentPage]);
}

export function FeatchApiOneData(
  state: TMovieWatch | undefined,
  setState: React.Dispatch<React.SetStateAction<TMovieWatch>> | undefined,
  imdbID: string | undefined,
  paramsName?: string
) {
  if (state === undefined || setState === undefined) return;

  const idMovie = imdbID || state.imdbID;

  useEffect(() => {
    const url = `https://www.omdbapi.com/?apikey=d074a25e&i=${idMovie}`;

    axios
      .get(url)
      .then((resp) => {
        if (resp.data.Response === "False")
          throw new Error("databese not found");

        setState({
          ...state,
          imdbID: resp.data.imdbID,
          data: resp.data,
          loading: "finnish",
        });
      })
      .catch(() => {
        setState({ ...state, loading: "error" });
      });

    if (idMovie === "" || idMovie === undefined || paramsName === undefined)
      return;

    setParamsAtUrl(paramsName, idMovie);
  }, [idMovie]);
}
