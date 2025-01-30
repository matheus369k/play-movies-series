// Configurações padrões para requisições a api ( omdbapi)
import axios from "axios";
import { env } from "./env";

export const AxiosOmbdapi = axios.create({
  baseURL: env.VITE_API_OMDBAPI,
  params: {apikey: env.VITE_API_OMDBAPI_KEY},
  headers: {
    "Content-Type": "application/json",
  },
});
