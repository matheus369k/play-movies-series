import { ReducerDataStateType as MovieInfoType } from "@/context/watch-context";
import { AxiosOmbdapi } from "@/util/axios-omdbapi";

type ResponseOneDataType = MovieInfoType;

export interface MoviesInfoType {
    Poster: string
    Title: string
    Type: string
    Year: string
    imdbID: string
}

// requisição de um unico dado
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

// requisição de Varios dados
export async function fetchManyOmbdapi({ params }: { params: string }) {
  const response = await AxiosOmbdapi.get(params);
  const data: ResponseOneManyType = await response.data;

  if (!data) {
    throw new Error("Error: To request datas on fetchManyOmbdapi..");
  }

  return { ...data };
}
