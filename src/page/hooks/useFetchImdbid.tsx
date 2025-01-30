import { useContext, useEffect } from "react";
import { setParamsAtUrl } from "../functions/add-url-params";
import { PaginationContext } from "@/context/pagination-context";
import { WatchContext } from "@/context/watch-context";
import { AxiosOmbdapi } from "@/util/axios-omdbapi";
import { useQuery } from "@tanstack/react-query";
import { fetchManyOmbdapi, fetchOneOmbdapi } from "@/services/fetch-omdbapi";

export function usefetchOmbdapi() {
  function getManyData({ params, key }: { params: string; key?: string }) {
    const { state, handleCompleteResponseData, handleErrorResponseData } =
      useContext(PaginationContext);

    const { data, isError } = useQuery({
      queryFn: async () => await fetchManyOmbdapi({ params }),
      queryKey: [params],
    });

    if (isError) {
      handleErrorResponseData();
    }

    useEffect(() => {
      if (data) {
        handleCompleteResponseData({
          data: data.Search,
          totalPages: Math.round(parseInt(data.totalResults) / 10),
        });

        setParamsAtUrl("page", state?.currentPage || 1);
      }

      if (state?.title.length > 0 && key) {
        setParamsAtUrl(key, state.title);
      }
    }, [data]);
  }

  function getOneData({
    imdbID,
    paramsName,
  }: {
    imdbID?: string;
    paramsName?: string;
  }) {
    const { state, handleCompleteResponseData, handleErrorResponseData } =
      useContext(WatchContext);

    const movieID = imdbID || state.imdbID;
    const { data, isError } = useQuery({
      queryFn: async () => await fetchOneOmbdapi({ id: movieID }),
      queryKey: ["movie", movieID],
    });

    if (isError) {
      handleErrorResponseData();
    }

    useEffect(() => {
      if (data) {
        handleCompleteResponseData({
          imdbID: movieID,
          data: data,
        });
      }

      if (movieID.length > 0 && paramsName) {
        setParamsAtUrl(paramsName, movieID);
      }
    }, [data]);
  }

  return {
    getManyData,
    getOneData,
  };
}
