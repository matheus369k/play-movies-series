import { useContext, useEffect } from "react";
import { setParamsAtUrl } from "../functions/add-url-params";
import { PaginationContext } from "@/context/pagination-context";
import { WatchContext } from "@/context/watch-context";
import { AxiosOmbdapi } from "@/util/axios-omdbapi";

export function FeatchApiPagination(params: string, paramsName?: string) {
  const { state, handleCompleteResponseData, handleErrorResponseData } =
    useContext(PaginationContext);

  useEffect(() => {
    AxiosOmbdapi.get(params)
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
  imdbID: string | undefined,
  paramsName?: string
) {
  const { state, handleCompleteResponseData, handleErrorResponseData } =
    useContext(WatchContext);

  const idMovie = imdbID || state.imdbID;

  useEffect(() => {
    const params = `?i=${idMovie}`;

    AxiosOmbdapi.get(params)
      .then((resp) => {
        if (resp.data.Response === "False")
          throw new Error("databese not found");

        handleCompleteResponseData({
          imdbID: resp.data.imdbID,
          data: resp.data,
        });
      })
      .catch(() => {
        handleErrorResponseData();
      });

    if (idMovie === "" || idMovie === undefined || paramsName === undefined)
      return;

    setParamsAtUrl(paramsName, idMovie);
  }, [idMovie]);
}
