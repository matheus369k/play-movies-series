import { ReducerStateDataType as MoviesInfoType } from "@/context/pagination-context";
import { ReducerDataStateType as MovieInfoType } from "@/context/watch-context";
import { AxiosOmbdapi } from "@/util/axios-omdbapi";

type ResponseOneDataType = MovieInfoType;

export async function fetchOneOmbdapi({ id }: { id: string }) {
  const response = await AxiosOmbdapi.get(`?i=${id}`);
  const data: ResponseOneDataType = await response.data;

  if (!data) {
    throw new Error("Error: To request datas on fetchOneOmbdapi...");
  }

  return { ...data };
}

interface ResponseOneManyType {
  Search: MoviesInfoType[];
  totalResults: string;
}

export async function fetchManyOmbdapi({ params }: { params: string }) {
  const response = await AxiosOmbdapi.get(params);
  const data: ResponseOneManyType = await response.data;

  if (!data) {
    throw new Error("Error: To request datas on fetchManyOmbdapi..");
  }

  return { ...data };
}
