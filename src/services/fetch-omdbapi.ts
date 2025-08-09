import { AxiosOmbdapi } from '@/util/axios-omdbapi'

interface ResponseOneDataType {
  Title?: string
  Year?: string
  Rated?: string
  Released?: string
  Runtime?: string
  Genre?: string
  Director?: string
  Writer?: string
  Actors?: string
  Plot?: string
  Language?: string
  Country?: string
  Awards?: string
  Poster?: string
  Ratings?: { Source: string; Value: string }[]
  Metascore?: string
  imdbRating?: string
  imdbVotes?: string
  imdbID?: string
  Type?: string
  DVD?: string
  BoxOffice?: string
  Production?: string
  totalSeasons?: string
  Website?: string
  Response?: string
}

export interface MoviesInfoType {
  Poster: string
  Title: string
  Type: string
  Year: string
  imdbID: string
}

export async function fetchOneOmbdapi({ id }: { id: string }) {
  try {
    const response = await AxiosOmbdapi.get(`?i=${id}`)
    const data: ResponseOneDataType = await response.data

    if (!data) {
      throw new Error('Error: To request datas on fetchOneOmbdapi...')
    }

    return { ...data }
  } catch (error) {
    console.log(error)
  }
}

export interface ResponseManyDataType {
  Search: MoviesInfoType[]
  totalResults: string
}

export async function fetchManyOmbdapi({ params }: { params: string }) {
  try {
    const response = await AxiosOmbdapi.get(params)
    const data: ResponseManyDataType = await response.data

    if (!data) {
      throw new Error('Error: To request datas on fetchManyOmbdapi..')
    }

    return { ...data }
  } catch (error) {
    console.log(error)
  }
}
